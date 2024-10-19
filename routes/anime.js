const express = require('express');
const router = express.Router();
const animeApi = require('../services/animeApi'); // Import the anime API service

// Route to get details of a specific anime
router.get('/anime/:id', async (req, res) => {
  try {
    const animeDetails = await animeApi.fetchAnimeDetails(req.params.id); // Fetch details of the anime by ID
    res.render('animeDetails', { anime: animeDetails }); // Render the details view and pass the data
  } catch (error) {
    console.error('Error fetching anime details:', error);
    res.redirect('/error');
  }
});

module.exports = router;