// Laddar in miljövariabler från .env filen
require('dotenv').config();

// Importerar nödvändiga paket
const express = require('express');
// Ändrat: Kommenterar ut markdown-it för att kringgå installationsproblem
// const markdown = require('markdown-it')();
const path = require('path');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const Booking = require('./models/Booking');
const auth = require('./middleware/auth');

// Funktion som ersätter markdown-it för enkel HTML-konvertering av markdown
function simpleMarkdownRender(text) {
  if (!text) return 'Ingen beskrivning tillgänglig.';
  // Enkel ersättning för grundläggande markdown
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>')            // Italic
    .replace(/\n\n/g, '<br><br>')                    // Paragraphs
    .replace(/\n/g, '<br>');                         // Line breaks
}

// Ansluter till MongoDB databasen
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Hanterar databasanslutning
mongoose.connection.on('connected', () => {
  console.log('✅ Ansluten till MongoDB!');
});
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB-anslutningsfel:', err);
});

// Skapar Express-applikationen
const app = express();
const port = 5080;

// Konfigurerar Express
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Sätter upp statiska filer
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //REMOVE/TA BORT NÄR VI INTE BEHÖVER JSON och använder MongoDB istället

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// Payment routes
// Initierar betalningsprocessen för en bokning
app.get('/payment/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).render('error', { message: 'Bokningen hittades inte.' });
    }

    // Hämta filmdetaljer från API baserat på film-ID
    const response = await fetch(`https://plankton-app-xhkom.ondigitalocean.app/api/movies/${booking.movie}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const movieData = await response.json();
    const movie = movieData.data;

    // Hämta visningsdetaljer från API baserat på visnings-ID
    const screeningResponse = await fetch(`https://plankton-app-xhkom.ondigitalocean.app/api/screenings/${booking.screening}`);
    if (!screeningResponse.ok) throw new Error(`HTTP error! status: ${screeningResponse.status}`);
    const screeningData = await screeningResponse.json();
    const screening = {
      id: booking.screening,
      movie: { title: movie.attributes.title },
      start_time: screeningData.data.attributes.start_time
    };

    res.render('payment', { 
      booking,
      screening,
      tickets: booking.totalSeats
    });
  } catch (error) {
    console.error('Betalningsfel:', error);
    res.status(500).render('error', { message: 'Kunde inte ladda betalningssidan.' });
  }
});

// Hanterar betalningsbearbetning
app.post('/process-payment/:bookingId', async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const booking = await Booking.findById(req.params.bookingId);
    
    if (!booking) {
      return res.status(404).json({ error: 'Bokningen hittades inte.' });
    }

    // Generera ett fiktivt transaktions-ID
    const transactionId = 'TRX' + Date.now() + Math.floor(Math.random() * 1000);
    
    // Uppdatera bokningsinformation med betalningsuppgifter
    booking.paymentStatus = 'completed';
    booking.paymentMethod = paymentMethod;
    booking.transactionId = transactionId;
    booking.paidAt = new Date();
    
    await booking.save();
    
    res.json({ 
      success: true,
      redirectUrl: `/confirmation/${booking._id}`
    });
  } catch (error) {
    console.error('Betalningsbearbetningsfel:', error);
    res.status(500).json({ 
      error: 'Kunde inte bearbeta betalningen.', 
      details: error.message 
    });
  }
});

// Visar bekräftelsesidan efter en slutförd betalning
app.get('/confirmation/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).render('error', { message: 'Bokningen hittades inte.' });
    }

    // Om betalningen inte är slutförd, omdirigera till betalningssidan
    if (booking.paymentStatus !== 'completed') {
      return res.redirect(`/payment/${booking._id}`);
    }

    // Hämta filmdetaljer från API baserat på film-ID
    const response = await fetch(`https://plankton-app-xhkom.ondigitalocean.app/api/movies/${booking.movie}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const movieData = await response.json();
    const movie = movieData.data;

    // Hämta visningsdetaljer från API baserat på visnings-ID
    const screeningResponse = await fetch(`https://plankton-app-xhkom.ondigitalocean.app/api/screenings/${booking.screening}`);
    if (!screeningResponse.ok) throw new Error(`HTTP error! status: ${screeningResponse.status}`);
    const screeningData = await screeningResponse.json();
    const screening = screeningData.data;

    res.render('confirmation', { 
      booking,
      movie: movie.attributes,
      screening: screening.attributes
    });
  } catch (error) {
    console.error('Bekräftelsefel:', error);
    res.status(500).render('error', { message: 'Kunde inte ladda bekräftelsesidan.' });
  }
});

// Huvudsidan - visar alla filmer
app.get('/', async (req, res) => {
  try {
    // Hämtar filmer från extern API
    const response = await fetch('https://plankton-app-xhkom.ondigitalocean.app/api/movies');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    let movies = (await response.json()).data;

    // Om det finns för få filmer, lägg till en extra
    if (movies.length < 10) {
      const extraResponse = await fetch('https://plankton-app-xhkom.ondigitalocean.app/api/movies/1');
      if (!extraResponse.ok) throw new Error(`HTTP error! status: ${extraResponse.status}`);
      const extraMovie = (await extraResponse.json()).data;
      if (extraMovie) movies.push(extraMovie);
    }

    res.render('index', { movies });
  } catch (error) {
    console.error('Misslyckades med att hämta filmer:', error);
    res.render('error', { message: 'Misslyckades med att ladda filmer' });
  }
});

// Visar detaljerad information om en specifik film
app.get('/movies/:id', async (req, res) => {
  try {
    const response = await fetch(`https://plankton-app-xhkom.ondigitalocean.app/api/movies/${req.params.id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const movie = (await response.json()).data;
    if (movie) {
      // Konverterar markdown-beskrivning till HTML
      movie.attributes.description = movie.attributes.description
        ? simpleMarkdownRender(movie.attributes.description)
        : 'Ingen beskrivning tillgänglig.';
      res.render('movie', { movie });
    } else {
      res.status(404).render('error', { message: 'Filmen hittades inte' });
    }
  } catch (error) {
    console.error('Misslyckades med att hämta film:', error);
    res.status(500).render('error', { message: 'Fel vid hämtning av filmdetaljer' });
  }
});

// Funktion för att filtrera visningar inom angivet antal dagar
function filterScreeningsWithinDays(screenings, days) {
  const today = new Date();
  const lastFilterDay = new Date();
  lastFilterDay.setDate(today.getDate() + days);
  lastFilterDay.setHours(23, 59, 59, 999);

  if (days == 0 || screenings.length === 0) return null;

  return screenings
    .filter(item => {
      const screeningDate = new Date(item.attributes.start_time);
      return screeningDate >= today && screeningDate <= lastFilterDay;
    })
    .sort((a, b) => new Date(a.attributes.start_time) - new Date(b.attributes.start_time))
    .slice(0, 10);
}

// API endpoint för att hämta visningar
app.get('/api/screenings', async (req, res) => {
  try {
    const response = await fetch('https://plankton-app-xhkom.ondigitalocean.app/api/screenings?populate=movie');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const screenings = (await response.json()).data;
    const filtered = filterScreeningsWithinDays(screenings, 5);
    res.json(filtered);
  } catch (error) {
    console.error('Misslyckades med att hämta visningar:', error);
    res.status(500).json({ message: 'Något gick fel! Försök igen' });
  }
});

// Routes för inloggning och registrering - konsoliderade routes
app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

// Routes för kontakt och om oss sidor
app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/about', (req, res) => {
  res.render('about');
});

// Hantera POST-förfrågan från kontaktformuläret
app.post('/contact', express.urlencoded({ extended: true }), (req, res) => {
  // Här kan du lägga till logik för att hantera kontaktformuläret
  // Till exempel skicka e-post eller spara i databasen
  console.log('Kontaktformulär mottaget:', req.body);
  res.redirect('/contact?success=true');
});

// Bokningssida - konsoliderad route med stöd för både inloggade och icke-inloggade användare
app.get('/book/:id', async (req, res) => {
  try {
    // Hämtar filmens detaljer
    const response = await fetch(`https://plankton-app-xhkom.ondigitalocean.app/api/movies/${req.params.id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const movie = (await response.json()).data;

    // Hämtar visningar för denna film
    const screeningsResponse = await fetch(`https://plankton-app-xhkom.ondigitalocean.app/api/screenings?populate=movie`);
    const screeningsData = await screeningsResponse.json();
    const screenings = screeningsData.data.filter(
      s => s.attributes.movie.data && s.attributes.movie.data.id == req.params.id
    );

    // Skickar med information om användaren är inloggad (om auth middleware används)
    res.render('book', { 
      movie, 
      screenings,
      user: req.user || null
    });
  } catch (error) {
    res.status(500).render('error', { message: 'Kunde inte ladda bokningssidan.' });
  }
});

// Hanterar fall där ingen film är vald för bokning
app.get('/book', (req, res) => {
  res.render('error', { message: 'Ingen film vald för bokning.' });
});

// Admin-sida för att se alla bokningar
app.get('/admin/bookings', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).render('error', { message: 'Endast administratörer har behörighet.' });
  }
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.render('admin-bookings', { bookings });
});

// Exporterar app och funktioner
module.exports = { app, filterScreeningsWithinDays };

// Startar servern om filen körs direkt
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
