const express = require('express'); // Import Express to use its routing capabilities
const router = express.Router(); // Create a new router instance to handle routes

// Route for the homepage
router.get('/', (req, res) => { // When a GET request is made to the root URL ('/')
    res.render('index', { title: 'Welcome to Anime Fortress' });  // Pass the title variable
});

module.exports = router; // Export the router so it can be used in other files