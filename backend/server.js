const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./utils/db');
const authRoutes = require('./routes/auth');
//for country detail 
const { getNames } = require('country-list');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Route to get country list
app.get('/api/countries', (req, res) => {
    const countries = getNames(); // Get a list of country names
    res.json(countries);
});

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
