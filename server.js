// Load environment variables from .env file
require('dotenv').config(); // I load environment variables like database URL and session secret

// Load the express web framework and other dependencies
const express = require('express'); // I import Express to set up my server
const path = require('path'); // I need 'path' to work with file paths
const passport = require('passport'); // I use Passport for Google OAuth authentication
require('./config/passport'); // I load the Passport configuration
const session = require('express-session'); // I need this for managing user sessions
const mongoose = require('mongoose'); // I use Mongoose to interact with MongoDB
const logger = require('morgan');  // I use Morgan to log requests for debugging
const cookieParser = require('cookie-parser');  // I need this to parse cookies in requests
const createError = require('http-errors'); // I use this for creating HTTP error codes

// Import routes from the Routes folder
const indexRouter = require('./routes/index'); // I import the index router to handle homepage routes
const animeRouter = require('./routes/anime'); // Import the anime router for anime-related routes


// Create the Express app
const app = express(); // I create my Express application here

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.DATABASE_URL) // I connect to MongoDB using the URL from .env
  .then(() => console.log('MongoDB connected')) // I log a success message if the connection works
  .catch(err => console.log('MongoDB connection error:', err)); // I log an error if the connection fails

// Set the view engine to EJS and configure the views directory
app.set('view engine', 'ejs'); // I tell Express to use EJS as my templating engine
app.set('views', path.join(__dirname, './views')); // I define the folder where my EJS files are located

// Middleware: Log requests
app.use(logger('dev')); // I log every request to the console during development

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next(); // Proceed if the user is authenticated
    }
    res.redirect('/auth/google'); // Redirect to Google login if the user is not authenticated
  }  

// Middleware: Parse incoming JSON and URL-encoded data
app.use(express.json()); // I can handle JSON data in requests
app.use(express.urlencoded({ extended: false })); // I can handle URL-encoded form data

// Middleware: Parse cookies
app.use(cookieParser()); // I use this to parse and read cookies from the client

// Middleware: Set up sessions
app.use(session({
  secret: process.env.SECRET, // I use a secret from .env for session security
  resave: false, // I don't want to resave sessions that haven't been modified
  saveUninitialized: false // I don't create a session until something is stored
}));

// Initialize Passport for authentication
app.use(passport.initialize()); // I initialize Passport for user authentication
app.use(passport.session()); // I tell Passport to manage sessions for logged-in users

// Make user info available to all views
app.use(function(req, res, next) {
  res.locals.user = req.user; // I store the user info in res.locals to make it available in my views
  next(); // I move to the next middleware or route handler
});

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public'))); // I serve static files (like CSS and images) from the public folder

// Use routes defined in the index router (for homepage)
app.use('/', indexRouter); // I tell Express to use the index router for homepage routes
app.use('/', animeRouter); // I tell Express to use the anime router for anime-related routes


// Define the Google authentication routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] })); // I start Google OAuth login process

// Google OAuth callback route
app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/' // If authentication fails, I redirect to the homepage
}), (req, res) => {
  res.redirect('/'); // After successful login, I redirect to the watchlist page
});

app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); } // If there's an error, pass it to the error handler
      res.redirect('/'); // Redirect to the homepage after successful logout
    });
  });  

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404)); // If no routes match, I send a 404 error
});

// Generic error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message; // I pass the error message to the template
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // I only show full error details in development

  // Render the error page
  res.status(err.status || 500); // I set the status code for the error
  res.render('error'); // I render the error template
});

// Start the server
const PORT = process.env.PORT || 3001; // I define the port from .env, or default to 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // I log a message that the server is running
});

module.exports = app; // I export the app to use in other files