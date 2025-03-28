// Function to update the footer with name and current year
function updateFooter() {
  const footerSpan = document.querySelector('footer .text-body-secondary');
  const currentYear = new Date().getFullYear();
  footerSpan.textContent = `Your Name ${currentYear}`; // Replace 'Your Name' with your actual name
}

// Function to fetch movies from the server
function fetchMovies(genre, rating) {
  let url = 'http://localhost:3022/api/movies';
  const params = [];

  if (genre) {
    params.push(`genre=${genre}`);
  }
  if (rating) {
    params.push(`rating=${rating}`);
  }

  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok, status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
      throw error; // Re-throw to be handled in the caller
    });
}

// Function to insert movies into the table
function insertMoviesIntoTable(movies) {
  const tableBody = document.querySelector('table tbody');
  const table = document.querySelector('table');
  const alert = document.querySelector('.alert');

  // Clear existing table rows
  tableBody.innerHTML = '';

  if (movies.length === 0) {
    table.classList.add('d-none');
    alert.classList.remove('d-none');
    return;
  }

  table.classList.remove('d-none');
  alert.classList.add('d-none');

  // Add new rows
  movies.forEach((movie) => {
    const row = document.createElement('tr');
    const releaseDate = new Date(Number(movie.release_date) * 1000).toLocaleDateString();

    // Create cells
    const movieNameCell = document.createElement('td');
    movieNameCell.textContent = movie.title;
    const genreCell = document.createElement('td');
    genreCell.textContent = movie.genre;
    const releaseDateCell = document.createElement('td');
    releaseDateCell.textContent = releaseDate;
    const directorCell = document.createElement('td');
    directorCell.textContent = movie.director;
    const ratingCell = document.createElement('td');
    ratingCell.textContent = movie.rating;

    // Add conditional classes based on the rating
    if (movie.rating < 2) {
        ratingCell.classList.add('rating-below-2');
    } else if (movie.rating >= 2 && movie.rating < 5) {
        ratingCell.classList.add('rating-2-to-5');
    } else if (movie.rating >= 5 && movie.rating < 8) {
        ratingCell.classList.add('rating-5-to-8');
    } else if (movie.rating >= 8) {
        ratingCell.classList.add('rating-8-plus');
    }
  
    // Append cells to the row
    row.appendChild(movieNameCell);
    row.appendChild(genreCell);
    row.appendChild(releaseDateCell);
    row.appendChild(directorCell);
    row.appendChild(ratingCell);

    tableBody.appendChild(row);
  });
}

// Get dropdown elements
const genreSelector = document.getElementById('genre-selector');
const ratingSelector = document.getElementById('rating-selector');

// Event listener for dropdown changes
function handleDropdownChange() {
  const selectedGenre = genreSelector.value;
  const selectedRating = ratingSelector.value;

  fetchMovies(selectedGenre, selectedRating)
    .then((movies) => insertMoviesIntoTable(movies))
    .catch((error) => {
      const table = document.querySelector('table');
      const alert = document.querySelector('.alert');
      table.classList.add('d-none');
      alert.classList.remove('d-none');
      alert.textContent = 'Error fetching data.';
    });
}

// Add event listeners
genreSelector.addEventListener('change', handleDropdownChange);
ratingSelector.addEventListener('change', handleDropdownChange);

// Initial fetch and update
fetchMovies()
  .then((movies) => insertMoviesIntoTable(movies))
  .catch((error) => {
    const table = document.querySelector('table');
    const alert = document.querySelector('.alert');
    table.classList.add('d-none');
    alert.classList.remove('d-none');
    alert.textContent = 'Error fetching data.';
  });

// Update the footer
updateFooter();