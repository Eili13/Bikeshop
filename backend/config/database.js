const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true, // Remove this line
    }).then(con => {
        console.log(`MongoDB Database connected with HOST: ${con.connection.host}`)
    }).catch(err => {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    });
}

module.exports = connectDatabase;