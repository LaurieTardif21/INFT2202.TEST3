// Function to update the footer with name and current year
function updateFooter() {
  const footerSpan = document.querySelector('footer .text-body-secondary');
  const currentYear = new Date().getFullYear();
  footerSpan.textContent = `Laurie Tardif ${currentYear}`; // Replace 'Your Name' with your actual name
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
    row.innerHTML = `
        <td>${movie.title}</td>
        <td>${movie.genre}</td>
        <td>${new Date(Number(movie.release_date) * 1000).toLocaleDateString()}</td>
        <td>${movie.director}</td>
        <td class="rating">${movie.rating}</td>
      `;

    // Access the rating cell directly after creating it
    const ratingCell = row.querySelector('.rating');

    // Change the background color based on the rating value
    const rating = parseInt(movie.rating);
      if (rating >= 2 && rating <= 5) {
          ratingCell.style.backgroundColor = 'yellow';
      } else if (rating < 2){
          ratingCell.style.backgroundColor = 'red';
      }
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