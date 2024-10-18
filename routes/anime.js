const express = require('express');
const router = express.Router();
const animeApi = require('../services/animeApi'); // Import the anime API service

// Route to get a list of anime
router.get('/', async (req, res) => {
  try {
    const animeList = await animeApi.fetchAnimeList(1, 10); // Fetch anime list, e.g., page 1 with 10 results
    res.render('animeList', { animeList }); // Render the list view and pass the data
  } catch (error) {
    console.error('Error fetching anime list:', error);
    res.redirect('/error'); // Redirect to error page if something goes wrong
  }
});

// Route to get details of a specific anime
router.get('/:id', async (req, res) => {
  try {
    const animeDetails = await animeApi.fetchAnimeDetails(req.params.id); // Fetch details of the anime by ID
    res.render('animeDetails', { anime: animeDetails }); // Render the details view and pass the data
  } catch (error) {
    console.error('Error fetching anime details:', error);
    res.redirect('/error');
  }
});

module.exports = router;