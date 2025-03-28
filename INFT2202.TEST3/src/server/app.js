// import the express library
import express from 'express';
import movies from './data/movies.js'; // Updated path
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// set the port for the server, use 3022
const PORT = 3022;

// create a new server instance
const app = express();

// configure the body renderer to parse json inputs
app.use(express.json());

// create a new router instance
const router = express.Router();

// create a new route and route handler, check the README for more details.
router.get('/api/movies', (req, res) => {
    let filteredMovies = [...movies]; // Create a copy to avoid modifying the original data

    const { rating, genre } = req.query;

    if (rating) {
        const parsedRating = parseInt(rating, 10); // Parse as an integer

        if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 10) {
            return res.status(400).json({ error: 'Invalid rating. Rating must be a number between 1 and 10.' });
        }

        filteredMovies = filteredMovies.filter(movie => movie.rating < parsedRating);
    }

    if (genre) {
        filteredMovies = filteredMovies.filter(movie =>
            movie.genre.toLowerCase() === genre.toLowerCase()
        );
    }

    // Sort by rating (highest to lowest)
    filteredMovies.sort((a, b) => b.rating - a.rating);

    res.json(filteredMovies);
});

// configure the server to use your new router instance
app.use(router);

// automatically serve static assets from the client folder AFTER defining the routes.
app.use(express.static(path.join(__dirname, '../../..', 'client')));

// automatically serve static assets from the client folder AFTER defining the routes.
app.use('/js', express.static(path.join(__dirname, '../../..', 'client', 'js')));

// automatically serve static assets from the node_modules folder
app.use('/node_modules', express.static(path.join(__dirname, '../../..', 'node_modules')));


// start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});