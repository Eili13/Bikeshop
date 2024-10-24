const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.json());


//import

const products = require('./routes/product');
const category = require('./routes/category');


app.use('/api/v1', products);   
app.use('/api/v1', category);

module.exports = app