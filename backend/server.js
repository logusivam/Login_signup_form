const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./utils/db');
const authRoutes = require('./routes/auth');
//for country detail 
const { countries } = require('countries-list'); 

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const path = require('path'); // Add this to handle file paths 
 
// Connect to MongoDB
connectDB();

// Serve static files (styles, scripts, HTML)
app.use(express.static(path.join(__dirname, '../Register')));
// Routes for Pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Register/register.html'));
});


app.use(express.static(path.join(__dirname, '../')));
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
}); 


// Route to get countries and phone codes
app.get('/api/countries', (req, res) => {
    const countryData = Object.keys(countries).map(key => ({
        name: countries[key].name,
        code: countries[key].phone,
    }));
    res.json(countryData);
});

// Middleware
app.use(bodyParser.json());
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
