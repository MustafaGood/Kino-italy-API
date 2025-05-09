const express = require('express');
const markdown = require('markdown-it')();
const path = require('path');
const fetch = require('node-fetch');  
const app = express();
const port = 5080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const response = await fetch('https://plankton-app-xhkom.ondigitalocean.app/api/movies');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    let movies = (await response.json()).data;

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

app.get('/movies/:id', async (req, res) => {
  try {
    const response = await fetch(`https://plankton-app-xhkom.ondigitalocean.app/api/movies/${req.params.id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const movie = (await response.json()).data;
    if (movie) {
      movie.attributes.description = movie.attributes.description
        ? markdown.render(movie.attributes.description)
        : 'Ingen beskrivning tillgänglig.';
      res.render('movie', { movie });
    } else {
      res.status(404).render('error', { message: 'Filmen hittades inte' });
    }
  } catch (error) {
    console.error('Misslyckades med att hämta film:', error);
    res.status(500).render('error', { message: 'Fel vid hämtnasding av filmdetaljer' });
  }
});

// Betalningsrutter (Christoffers branch)
/*

// Betalning (Christoffers branch) [IMPLEMENTERA] med mongoDB, login och bokningssystem.
app.get('/payment', async (req, res) => {
  try {
    const { screeningId, tickets } = req.query;
    
    if (!screeningId || !tickets) {
      return res.status(400).render('error', { message: 'Saknar nödvändig information för betalning' });
    }

    const response = await fetch(`https://plankton-app-xhkom.ondigitalocean.app/api/screenings/${screeningId}?populate=movie`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const screening = (await response.json()).data;

    const screeningData = {
      id: screening.id,
      start_time: screening.attributes.start_time,
      movie: {
        title: screening.attributes.movie.data.attributes.title,
        image: screening.attributes.movie.data.attributes.image
      }
    };

    res.render('payment', { 
      screening: screeningData, 
      tickets: parseInt(tickets) 
    });
  } catch (error) {
    console.error('Fel vid förberedelse av betalning:', error);
    res.status(500).render('error', { message: 'Kunde inte förbereda betalning' });
  }
});

// Bekräftelse (Christoffers branch) [IMPLEMENTERA] med mongoDB, login och bokningssystem.
app.get('/confirmation', async (req, res) => {
  try {
    const { screeningId, tickets } = req.query;
    
    if (!screeningId || !tickets) {
      return res.status(400).render('error', { message: 'Saknar nödvändig information för bekräftelse' });
    }

    const response = await fetch(`https://plankton-app-xhkom.ondigitalocean.app/api/screenings/${screeningId}?populate=movie`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const screening = (await response.json()).data;

    const screeningData = {
      id: screening.id,
      start_time: screening.attributes.start_time,
      movie: {
        title: screening.attributes.movie.data.attributes.title,
        image: screening.attributes.movie.data.attributes.image
      }
    };

    // (Christoffers branch) [IMPLEMENTERA] med mongoDB, login och bokningssystem.
    const bookingId = Math.floor(100000 + Math.random() * 900000);

    res.render('confirmation', { 
      screening: screeningData, 
      tickets: parseInt(tickets),
      bookingId: bookingId
    });
  } catch (error) {
    console.error('Fel vid generering av bekräftelse:', error);
    res.status(500).render('error', { message: 'Kunde inte generera bekräftelse' });
  }
});
*/

function filterScreeningsWithinDays(screenings, days) {
  const today = new Date();
  const lastFilterDay = new Date();
  lastFilterDay.setDate(today.getDate() + days);
  lastFilterDay.setHours(23, 59, 59, 999);

  if (days == 0 ) return null;

  return screenings
    .filter(item => {
      const screeningDate = new Date(item.attributes.start_time);
      return screeningDate >= today && screeningDate <= lastFilterDay;
    })
    .sort((a, b) => new Date(a.attributes.start_time) - new Date(b.attributes.start_time))
    .slice(0, 10);
}

app.get('/api/screenings', async (req, res) => {
  try {
    const response = await fetch('https://plankton-app-xhkom.ondigitalocean.app/api/screenings?populate=movie');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const screenings = (await response.json()).data;
    const filtered = filterScreeningsWithinDays(screenings, 5);
    res.json(filtered);
  } catch (error) {
    console.error('Misslyckades med att hämta visningar:', error);
    res.status(500).json({ message: 'Något gick fel! Försök igen.' });
  }
});

module.exports = { app, filterScreeningsWithinDays };

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
