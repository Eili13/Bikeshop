const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require("cors")


app.use(cors())
app.use(express.json());
app.use(cookieParser())

// Import routes
const products = require('./routes/product');
const category = require('./routes/category');
const auth = require('./routes/auth');  
const order = require('./routes/order');
// const reviews = require('./routes/reviews');
// const user = require('./routes/user');

// Use routes
app.use('/api/v1', products);   
app.use('/api/v1', category);
app.use('/api/v1', auth);   
app.use('/api/v1', order);
// app.use('/api/v1', reviews);


// const PORT = process.env.PORT || 4001;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

module.exports = app;