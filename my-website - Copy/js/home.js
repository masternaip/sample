const apiKey = '7e863169c39e42ac68d117c538af97fc'; // Replace with your actual API key
const apiUrl = 'https://api.themoviedb.org/3/movie/popular?api_key=' + apiKey;
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const movieContainer = document.getElementById('movie-container');
const customBaseUrl = 'https://hilcodigital.com/Sample/'; // Your specified base URL
const tmdbMovieBaseUrl = 'https://www.themoviedb.org/movie/'; // Base URL for TMDb movie details

// Use a WeakMap to store click counts for each movie element
const clickCounts = new WeakMap();
let currentItem = null; // Store the current movie/TV show item

async function fetchMovies() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching movies:', error);
        movieContainer.innerHTML = '<p>Failed to load movies.</p>';
    }
}

function changeServer() {
    const server = document.getElementById('server').value;
    const type = currentItem.media_type === "movie" ? "movie" : "tv";
    let embedURL = "";

    if (server === "vidsrc.cc") {
        embedURL = `https://vidsrc.cc/v2/embed/${type}/${currentItem.id}`;
    } else if (server === "vidsrc.me") {
        embedURL = `https://vidsrc.net/embed/${type}/?tmdb=${currentItem.id}`;
    } else if (server === "player.videasy.net") {
        embedURL = `https://player.videasy.net/${type}/${currentItem.id}`;
    }

    if (embedURL) {
        movieContainer.innerHTML = `
            <div style="position: relative; width: 100%; padding-bottom: 56.25%; /* 16:9 aspect ratio */">
                <iframe
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                    src="${embedURL}"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
            </div>
        `;
    } else {
        movieContainer.innerHTML = `<p>Invalid server selected.</p>`;
    }
}

function displayMovies(movies) {
    movieContainer.innerHTML = ''; // Clear previous content
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.style.cursor = 'pointer'; // Indicate it's clickable

        // Initialize click count for this movie
        clickCounts.set(movieCard, 0);

        movieCard.addEventListener('click', () => {
            let currentClicks = clickCounts.get(movieCard);
            currentClicks++;
            clickCounts.set(movieCard, currentClicks);
            currentItem = movie; // Store the current movie

            if (currentClicks === 1) {
                // First click: Redirect to custom URL
                const movieLink = customBaseUrl + movie.id;
                window.open(movieLink, '_blank');
            } else {
                // Second click (and subsequent clicks): Show server selection
                movieContainer.innerHTML = `
                    <div style="margin-bottom: 10px;">
                        <label for="server">Select Server:</label>
                        <select id="server" onchange="changeServer()">
                            <option value="">Select a server</option>
                            <option value="vidsrc.cc">VidSrc CC</option>
                            <option value="vidsrc.me">VidSrc ME</option>
                            <option value="player.videasy.net">Videasy</option>
                        </select>
                    </div>
                    <div id="embed-container"></div>
                `;
            }
        });

        const posterPath = movie.poster_path ? imageBaseUrl + movie.poster_path : 'placeholder.jpg'; // Use a placeholder if no poster
        const poster = document.createElement('img');
        poster.src = posterPath;
        poster.alt = movie.title;

        const movieInfo = document.createElement('div');
        movieInfo.classList.add('movie-info');

        const title = document.createElement('h2');
        title.classList.add('movie-title');
        title.textContent = movie.title;

        const rating = document.createElement('p');
        rating.classList.add('movie-rating');
        rating.textContent = 'Rating: ' + movie.vote_average;

        movieInfo.appendChild(title);
        movieInfo.appendChild(rating);
        movieCard.appendChild(poster);
        movieCard.appendChild(movieInfo);
        movieContainer.appendChild(movieCard);
    });
}

// Call the fetchMovies function when the page loads
document.addEventListener('DOMContentLoaded', fetchMovies);
