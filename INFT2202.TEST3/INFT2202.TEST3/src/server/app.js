import express from 'express';
import movies from './movies.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3022;

// Get the directory name of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../../public')));

// Root route : Return a simple message
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

/**
 * GET /api/movies
 *
 * This route handles requests for movie data. It supports filtering by rating and genre,
 * and it always sorts the results by rating (highest to lowest).
 *
 * Query Parameters:
 *   - rating (optional): A number between 1 and 10. If provided, the response will exclude movies
 *                        with a rating equal to or higher than this value.
 *   - genre (optional): A string representing a movie genre. If provided, the response will
 *                       include only movies in that genre (case-insensitive).
 *
 * Error Handling:
 *   - If an invalid rating is provided (not a number or out of range), a 400 error is returned.
 *
 * Response:
 *   - Returns a JSON array of movie objects, filtered and sorted according to the parameters.
 */
app.get('/api/movies', (req, res) => {
  // Get parameters from the request query string
  const ratingParam = req.query.rating;
  const genreParam = req.query.genre;

  // Start with the full array of movies
  let filteredMovies = [...movies]; // Create a copy to avoid modifying the original data

  // Filter by rating if provided
  if (ratingParam) {
    const rating = Number(ratingParam);
    if (isNaN(rating) || rating < 1 || rating > 10) {
      return res.status(400).json({ error: 'Rating must be a number between 1 and 10' });
    }
    filteredMovies = filteredMovies.filter(movie => movie.rating < rating);
  }

  // Filter by genre if provided
  if (genreParam) {
    const lowerCaseGenre = genreParam.toLowerCase();
    filteredMovies = filteredMovies.filter(movie => movie.genre.toLowerCase() === lowerCaseGenre);
  }

  // Sort by rating (highest to lowest)
  filteredMovies.sort((a, b) => b.rating - a.rating);

  // Send the filtered and sorted movies
  res.json(filteredMovies);
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});