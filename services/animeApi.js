const axios = require('axios'); // I import axios to make HTTP requests

const API_KEY = process.env.RAPIDAPI_KEY; // I store my API key securely in the .env file
const BASE_URL = 'https://myanimelist.p.rapidapi.com'; // I define the base URL for the API

// Function to fetch a list of anime from the API
async function fetchAnimeList(page = 1, limit = 10) { // I set default values for pagination: page 1, 10 items
  try {
    const response = await axios.get(`${BASE_URL}/anime`, { // I make a GET request to the anime endpoint
      headers: {
        'X-RapidAPI-Key': API_KEY, // I use my RapidAPI key from .env
        'X-RapidAPI-Host': 'myanimelist.p.rapidapi.com' // I specify the API host for this request
      },
      params: {
        page,    // I send the page number for pagination
        limit    // I limit the number of items per page
      }
    });
    return response.data; // I return the anime list data from the response
  } catch (error) {
    console.error('Error fetching anime list:', error); // I log any errors that occur during the request
    throw error; // I throw the error to handle it elsewhere
  }
}

// Function to fetch details of a specific anime
async function fetchAnimeDetails(id) { // I use the anime ID to get specific anime details
  try {
    const response = await axios.get(`${BASE_URL}/anime/${id}`, { // I make a GET request to the specific anime endpoint
      headers: {
        'X-RapidAPI-Key': API_KEY, // I use my RapidAPI key from .env
        'X-RapidAPI-Host': 'myanimelist.p.rapidapi.com' // I specify the API host for this request
      }
    });
    return response.data; // I return the anime details data from the response
  } catch (error) {
    console.error('Error fetching anime details:', error); // I log any errors that occur during the request
    throw error; // I throw the error to handle it elsewhere
  }
}

module.exports = {
  fetchAnimeList,      // I export the fetchAnimeList function to use in other files
  fetchAnimeDetails    // I export the fetchAnimeDetails function to use in other files
};