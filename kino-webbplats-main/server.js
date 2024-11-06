const express = require('express');
const axios = require('axios');
const markdown = require('markdown-it')();
const path = require('path');
const app = express();
const port = 5080;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://plankton-app-xhkom.ondigitalocean.app/api/movies');
        const movies = response.data.data;
        res.render('index', { movies });
    } catch (error) {
        console.error('Failed to fetch movies:', error);
        res.render('error', { message: 'Failed to load movies' });
    }
});

app.get('/movies/:id', async (req, res) => {
    try {
        const response = await axios.get(`https://plankton-app-xhkom.ondigitalocean.app/api/movies/${req.params.id}`);
        if (response.data.data) {
            const movie = response.data.data;
            movie.attributes.description = movie.attributes.description ? markdown.render(movie.attributes.description) : 'No description available.';
            res.render('movie', { movie });
        } else {
            res.status(404).render('error', { message: 'Movie not found' });
        }
    } catch (error) {
        console.error('Failed to fetch movie:', error);
        res.status(500).render('error', { message: 'Error retrieving movie details' });
    }
});

app.get('/book/:id', async (req, res) => {
    try {
        const movieId = req.params.id;
        const response = await axios.get(`https://plankton-app-xhkom.ondigitalocean.app/api/movies/${movieId}`);
        if (response.data.data) {
            const movie = response.data.data;
            res.render('book', { movie });
        } else {
            res.status(404).render('error', { message: 'Movie not found' });
        }
    } catch (error) {
        console.error('Failed to fetch movie for booking:', error);
        res.status(500).render('error', { message: 'Error retrieving movie details' });
    }
});



app.get('/reviews/:id', async (req, res) => {
    try {
        const response = await axios.get(`https://plankton-app-xhkom.ondigitalocean.app/api/movies/${req.params.id}`);
        if (response.data.data) {
            const movie = response.data.data;
            const reviews = [
                { review: "Great movie!", rating: 5 },
                { review: "Loved the storyline.", rating: 4 }
            ];
            res.render('reviews', { movie, reviews });
        } else {
            res.status(404).render('error', { message: 'Movie not found' });
        }
    } catch (error) {
        console.error('Failed to fetch movie for reviews:', error);
        res.status(500).render('error', { message: 'Error retrieving movie details' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
