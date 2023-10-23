const mongoose = require('mongoose');

// Replace 'your-database-url' with the actual MongoDB connection string
const dbURI = 'mongodb://your-database-url';

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;
