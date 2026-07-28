// models/Game.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  category: { type: String, default: 'General' },
  link: { type: String, required: true },
  isDeleted: { type: Boolean, default: false } // Added this line
});

module.exports = mongoose.model('Game', gameSchema);