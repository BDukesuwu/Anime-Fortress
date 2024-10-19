const https = require('https'); // Use the built-in https module

const API_KEY = process.env.RAPIDAPI_KEY; // I store my API key securely in the .env file
const BASE_URL = 'anime-db.p.rapidapi.com'; // The base URL for the Anime DB API

// Function to fetch a list of anime from the API
async function fetchAnimeList(page = 1, size = 10, search = '') { // I set default values for pagination
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: BASE_URL,
      path: `/anime?page=${page}&size=${size}&search=${encodeURIComponent(search)}`, // Build the path with query parameters
      headers: {
        'x-rapidapi-key': API_KEY, // I use my RapidAPI key from .env
        'x-rapidapi-host': 'anime-db.p.rapidapi.com' // I specify the API host for this request
      }
    };

    const req = https.request(options, function (res) {
      const chunks = [];

      res.on('data', function (chunk) {
        chunks.push(chunk); // Collect data chunks
      });

      res.on('end', function () {
        const body = Buffer.concat(chunks); // Combine the data chunks
        resolve(JSON.parse(body.toString())); // Parse and resolve the data as JSON
      });
    });

    req.on('error', function (error) {
      reject(error); // Handle errors
    });

    req.end(); // End the request
  });
}

// Function to fetch details of a specific anime (optional)
async function fetchAnimeDetails(id) {
  // Implementation for fetching details if needed
}

module.exports = {
  fetchAnimeList,      // I export the fetchAnimeList function to use in other files
  fetchAnimeDetails    // I export the fetchAnimeDetails function to use in other files
};