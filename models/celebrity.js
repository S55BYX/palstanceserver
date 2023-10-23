// models/celebrity.js

const mongoose = require('mongoose');

const celebritySchema = new mongoose.Schema({
  name: String,
  field: String,
});

const Celebrity = mongoose.model('Celebrity', celebritySchema);

module.exports = Celebrity;
