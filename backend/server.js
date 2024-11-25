const app = require('./app')
const dotenv = require('dotenv');
const connectDatabase = require('./config/database')

dotenv.config({path: './config/.env'})


//connection for database

connectDatabase();

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// app.listen(process.env.PORT, () => {
//     console.log(`Server started on Port: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
// })