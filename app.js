const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');

require('dotenv').config(); // Load environmental variables from .env file

const dbURI = process.env.DB_URI;
const smtpService = process.env.SMTP_SERVICE;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const apiEndpoint = process.env.API_ENDPOINT;

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Terminate the process on MongoDB connection error
  }
}

// Call the connectToMongoDB function when your server starts
connectToMongoDB();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/get-celebrities', async (req, res) => {
  try {
    const database = client.db('celeblandingpage');
    const collection = database.collection('celebs');
    
    const celebrities = await collection.find({}).toArray();
    
    res.json({ celebrities });
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: 'Error retrieving data' });
  }
});



const transporter = nodemailer.createTransport({
  service: smtpService,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

app.post('/submit-form', (req, res) => {
  const { celebrityName, celebrityField } = req.body;

  const mailOptions = {
    from: smtpUser,
    to: smtpUser,
    subject: 'New Celebrity Submission',
    text: `Name: ${celebrityName}\nField: ${celebrityField}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).send('Error sending email: ' + error.message);
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
