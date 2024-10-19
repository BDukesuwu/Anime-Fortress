const express = require('express'); // Import Express
const router = express.Router(); // Create a new router instance
const animeApi = require('../services/animeApi'); // Import the anime API service

// Route for the homepage
router.get('/', async (req, res) => {
  try {
    const animeList = await animeApi.fetchAnimeList(1, 10); // Fetch the anime list
    console.log('Fetched Anime List:', animeList); // Log the anime list to check the format
    res.render('index', { animeList, title: 'Welcome to Anime Fortress' }); // Render the index view
  } catch (error) {
    console.error('Error fetching anime list:', error);
    res.redirect('/error'); // Redirect to an error page if fetching fails
  }
});

module.exports = router; // Export the router