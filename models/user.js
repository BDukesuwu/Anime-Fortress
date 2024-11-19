const mongoose = require('mongoose'); // I import Mongoose to interact with MongoDB.
const Schema = mongoose.Schema; // I use Mongoose's Schema constructor.

const userSchema = new Schema({ 
  googleId: String, // I store the user's Google ID.
  displayName: String, // I store the user's display name.
  email: String, // I store the user's email.
  avatar: String // I store the user's avatar URL.
}, { 
  timestamps: true // I enable automatic createdAt and updatedAt fields.
  
  //Watchlist functions: I want to store anime.id + Name and anime watch status in user data
});

module.exports = mongoose.model('User', userSchema); // I export the User model based on the schema.