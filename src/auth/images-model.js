'use strict';

const mongoose = require('mongoose');

const images = new mongoose.Schema({
  title: {type: String, require: true},
  user_id: {type: String},
  description: {type: String},
  url: {type: String},
  created_at: {type: Date}
})

module.exports = mongoose.model('images', images);