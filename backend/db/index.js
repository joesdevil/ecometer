const mongoose = require('mongoose');

const dbConfig = require('../config/database');
const url = dbConfig.development.connectionString;

const connectToDb = async () => {
    try{
    await mongoose.connect(url);
    console.log('Database connected');
 
}catch(error){
    console.error('Error connecting to MongoDb');
}
};

module.exports = connectToDb;