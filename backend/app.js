const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(cookieParser())



// Import routes
const products = require('./routes/product');
const category = require('./routes/category');
const auth = require('./routes/auth');  
// const user = require('./routes/user');

// Use routes
app.use('/api/v1', products);   
app.use('/api/v1', category);
app.use('/api/v1', auth);   

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;