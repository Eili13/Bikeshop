const express = require('express');  // Import express
const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');
const path = require('path');

dotenv.config({ path: './config/.env' });

// Serve static files (e.g., images) from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connection for database
connectDatabase();

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});