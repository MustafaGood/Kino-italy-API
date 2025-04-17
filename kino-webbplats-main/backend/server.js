const express = require('express');
const axios = require('axios');
const markdown = require('markdown-it')();
const path = require('path');
const app = express();
const port = 5080;

 app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

 app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../public')));

 app.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://plankton-app-xhkom.ondigitalocean.app/api/movies');
    let movies = response.data.data;

    if (movies.length < 10) {
      const extraResponse = await axios.get('https://plankton-app-xhkom.ondigitalocean.app/api/movies/1');
      const extraMovie = extraResponse.data.data;
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
    const response = await axios.get(`https://plankton-app-xhkom.ondigitalocean.app/api/movies/${req.params.id}`);
    if (response.data.data) {
      const movie = response.data.data;
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

function filterScreeningsWithin5Days(screenings) {
  const today = new Date();
  const fiveDaysLater = new Date();
  fiveDaysLater.setDate(today.getDate() + 5);
  fiveDaysLater.setHours(23, 59, 59, 999);  

  const filtered = screenings
    .filter(item => {
      const screeningDate = new Date(item.attributes.start_time);
      return screeningDate >= today && screeningDate <= fiveDaysLater;
    })
    .sort((a, b) => new Date(a.attributes.start_time) - new Date(b.attributes.start_time));

  const groupedByDate = {};
  const result = [];

  for (const s of filtered) {
    const date = new Date(s.attributes.start_time).toISOString().split("T")[0];
    if (!groupedByDate[date]) groupedByDate[date] = [];
    groupedByDate[date].push(s);
  }

  for (const date in groupedByDate) {
    for (const screening of groupedByDate[date]) {
      if (result.length < 10) result.push(screening);
    }
    if (result.length >= 10) break;
  }

  return result;
}

app.get('/api/screenings', async (req, res) => {
  try {
    const response = await axios.get('https://plankton-app-xhkom.ondigitalocean.app/api/screenings?populate=movie');
    const screenings = response.data.data;
    const filtered = filterScreeningsWithin5Days(screenings);
    res.json(filtered);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Något gick fel!' });
  }
});

module.exports = { app, filterScreeningsWithin5Days };

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
