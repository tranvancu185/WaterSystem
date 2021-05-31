const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/IOT', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        console.log('Connect to DB succesfully !');
    } catch (error) {
        console.log('Connect false !');
    }
}

module.exports = { connect };