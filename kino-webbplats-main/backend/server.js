// Laddar in miljövariabler från .env filen
require('dotenv').config();

// Importerar nödvändiga paket
const express = require('express');
const markdown = require('markdown-it')();
const path = require('path');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const Booking = require('./models/Booking');
const auth = require('./middleware/auth');

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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

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
        ? markdown.render(movie.attributes.description)
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

// Funktion för att filtrera visningar inom de närmaste 5 dagarna
function filterScreeningsWithin5Days(screenings) {
  const today = new Date();
  const fiveDaysLater = new Date();
  fiveDaysLater.setDate(today.getDate() + 5);
  fiveDaysLater.setHours(23, 59, 59, 999);

  return screenings
    .filter(item => {
      const screeningDate = new Date(item.attributes.start_time);
      return screeningDate >= today && screeningDate <= fiveDaysLater;
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
    const filtered = filterScreeningsWithin5Days(screenings);
    res.json(filtered);
  } catch (error) {
    console.error('Misslyckades med att hämta visningar:', error);
    res.status(500).json({ message: 'Något gick fel!' });
  }
});

// Routes för inloggning och registrering
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

app.get('/auth/login', (req, res) => {
  res.render('login');
});

app.get('/auth/register', (req, res) => {
  res.render('register');
});

// Bokningssida för inloggade användare
app.get('/auth/book/:id', async (req, res) => {
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

    res.render('book', { movie, screenings });
  } catch (error) {
    res.status(500).render('error', { message: 'Kunde inte ladda bokningssidan.' });
  }
});

// Hanterar fall där ingen film är vald för bokning
app.get('/auth/book', (req, res) => {
  res.render('error', { message: 'Ingen film vald för bokning.' });
});

// Bokningssida för alla användare
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

    res.render('book', { movie, screenings });
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
module.exports = { app, filterScreeningsWithin5Days };

// Startar servern om filen körs direkt
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
