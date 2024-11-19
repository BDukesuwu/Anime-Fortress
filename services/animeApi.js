const https = require('https'); // Use the built-in https module

const API_KEY = process.env.RAPIDAPI_KEY; // I store my API key securely in the .env file
const BASE_URL = 'anime-db.p.rapidapi.com'; // The base URL for the Anime DB API

// Variable to track the current page of anime (starts at 1)
let currentPage = 1;

// Function to fetch the anime list from the API
const fetchAnimeList = async (page = 1, size = 10, search = '') => {
  // I use a Promise to handle asynchronous operations easily
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET', // I use the GET request method to retrieve data
      hostname: BASE_URL, // This is the base URL of the API
      path: `/anime?page=${page}&size=${size}&search=${encodeURIComponent(search)}`, // I pass the page, size, and search term as query parameters
      headers: {
        'x-rapidapi-key': API_KEY, // My API key from .env for authentication
        'x-rapidapi-host': 'anime-db.p.rapidapi.com' // The API's host name
      }
    };

    // I create the request to the API
    const req = https.request(options, function (res) {
      const chunks = []; // This array stores the data chunks I receive

      res.on('data', function (chunk) {
        chunks.push(chunk); // I collect each data chunk
      });

      res.on('end', function () {
        const body = Buffer.concat(chunks); // I combine all chunks into a single buffer
        const responseData = JSON.parse(body.toString()); // Convert the buffer into a JSON object
        resolve(responseData.data); // I resolve the promise with the 'data' array
      });
    });

    req.on('error', function (error) {
      reject(error); // I handle errors by rejecting the promise
    });

    req.end(); // I end the request after setting it up
  });
};

// Function to show the next page of anime
const showNextPage = async (size = 10, search = '') => {
  currentPage++; // I move to the next page
  console.log(`Loading page ${currentPage}...`); // I log the current page for debugging
  const animeList = await fetchAnimeList(currentPage, size, search); // I fetch the new page
  console.log(animeList); // I display the anime list in the console
};

// Function to show the previous page of anime
const showPreviousPage = async (size = 10, search = '') => {
  if (currentPage > 1) { // I only go back if I'm not on the first page
    currentPage--; // I move to the previous page
    console.log(`Loading page ${currentPage}...`); // I log the current page for debugging
    const animeList = await fetchAnimeList(currentPage, size, search); // I fetch the new page
    console.log(animeList); // I display the anime list in the console
  } else {
    console.log('You are already on the first page!'); // I handle the case where there are no previous pages
  }
};

// Function to fetch details of a specific anime (optional for now)
async function fetchAnimeDetails(id) {
  // Implementation for fetching details if needed
}

// I export the functions to use them in other parts of the application
module.exports = {
  fetchAnimeList,      // This function fetches a paginated list of anime
  showNextPage,        // This function moves to the next page of anime
  showPreviousPage,    // This function moves to the previous page of anime
  fetchAnimeDetails    // This function fetches details of a specific anime
};