// Follow the README.md to set up the rest of this file.
// src/client/js/index.js
function updateFooter() {
    const footerSpan = document.querySelector('.footer span');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    footerSpan.textContent = `Laurie Tardif ${currentYear}`; // Replace "Your Name"
}

/*
 *  fetchMovies
 *  This should take two parameters
 *  -   The genre you want to filter by, defaults to null
 *  -   The rating you want to filter by, defaults to null
 *  It should return a list a movies
 *  It should throw an error if something went wrong
 *  You need to use the following classes: URLSearchParams, URL, Headers, and Request.
 */
async function fetchMovies(genre = null, rating = null) {
    const url = new URL('http://localhost:3022/api/movies');
    const params = new URLSearchParams();

    if (genre) {
        params.append('genre', genre);
    }
    if (rating) {
        params.append('rating', rating);
    }
    url.search = params.toString();

    const headers = new Headers();
    const request = new Request(url, {
        method: 'GET',
        headers: headers,
    });

    try {
        const response = await fetch(request);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
}

/*
 *  insertMoviesIntoTable
 *  This should take two parameters
 *  - a reference to the table you want to populate
 *  - a list of movies to put in the table
 *  It should return nothing
 */
function insertMoviesIntoTable(movies) {
    const table = document.querySelector('table');
    const tbody = table.querySelector('tbody');
    const errorAlert = document.querySelector('.alert.alert-warning')

    tbody.innerHTML = '';

    if (movies.length === 0) {
        table.classList.add('d-none');
        errorAlert.classList.remove('d-none');
        errorAlert.textContent = "There are no movies in the databse that match your filters."
        return;
    }

    movies.forEach(movie => {
        const row = tbody.insertRow();
        // if a movie is rated two or below, make this row red
        // if this movie is rated higher than two but less than or equal to five, make this row orange
        // if this movie is rated higher than five but less than or equal to 8, make this row blue
        // if this movie is rated higher than eight, make this row green
        if (movie.rating <= 2) {
            row.style.backgroundColor = "red"
        } else if (movie.rating <= 5) {
            row.style.backgroundColor = "orange"
        } else if (movie.rating <= 8) {
            row.style.backgroundColor = "blue"
        } else {
            row.style.backgroundColor = "green"
        }
        const nameCell = row.insertCell();
        const genreCell = row.insertCell();
        const releaseDateCell = row.insertCell();
        const directorCell = row.insertCell();
        const ratingCell = row.insertCell();

        nameCell.textContent = movie.name;
        genreCell.textContent = movie.genre;
        // the datetime is a "unix timestamp", measured in seconds.  
        // javascript dates are measured in milliseconds.
        // convert this timestamp to a javascript date and print out the date as a normal string
        const releaseDate = new Date(movie.releaseDate);
        releaseDateCell.textContent = releaseDate.toLocaleDateString();
        directorCell.textContent = movie.director;
        ratingCell.textContent = movie.rating;
    });
    errorAlert.classList.add('d-none')
    table.classList.remove('d-none')
}

const genreSelector = document.getElementById('genre-selector');
const ratingSelector = document.getElementById('rating-selector');

function handleFilterChange() {
    const selectedGenre = genreSelector.value;
    const selectedRating = ratingSelector.value;

    fetchMovies(selectedGenre, selectedRating)
        .then(movies => insertMoviesIntoTable(movies))
        .catch(error => {
            console.error("An error ocurred", error)
            const errorAlert = document.querySelector('.alert.alert-warning')
            const table = document.querySelector('table');
            errorAlert.textContent = "An error has ocurred while fetching movies"
            errorAlert.classList.remove('d-none')
            table.classList.add('d-none')
        });
}

updateFooter()
handleFilterChange()
genreSelector.addEventListener('change', handleFilterChange);
ratingSelector.addEventListener('change', handleFilterChange);


/*
 *  fetchMovies
 *  This should take two parameters
 *  -   The genre you want to filter by, defaults to null
 *  -   The rating you want to filter by, defaults to null
 *  It should return a list a movies
 *  It should throw an error if something went wrong
 *  You need to use the following classes: URLSearchParams, URL, Headers, and Request.
 */



/*
 *  insertMoviesIntoTable
 *  This should take two parameters
 *  - a reference to the table you want to populate
 *  - a list of movies to put in the table
 *  It should return nothing
 */
    // use the reference to the table to get a reference to the tbody
    // empty the table first
    // for each movie
        // insert a row into your table element
        // insert a cell for each attribute of a movie
        // the datetime is a "unix timestamp", measured in seconds.  
        // javascript dates are measured in milliseconds.
        // convert this timestamp to a javascript date and print out the date as a normal string
        // if a movie is rated two or below, make this row red
        // if this movie is rated higher than two but less than or equal to five, make this row orange
        // if this movie is rated higher than five but less than or equal to 8, make this row blue
        // if this movie is rated higher than eight, make this row green