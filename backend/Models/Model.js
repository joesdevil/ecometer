const mongoose = require('mongoose');


const dotenv = require('dotenv');
const { schema } = require('./Bilan');
dotenv.config();

const Schema = mongoose.Schema;

//define ModelSchema



 

 
  // Define a pre-save middleware to parse and convert the last five fields to floating-point numbers
ModelElementSchema.pre('save', function(next) {
  const lastFields = ['totalPostValue', 'co2', 'ch4', 'ch4b', 'n2o'];
  for (const field of lastFields) {
      if (typeof this[field] === 'string') {
          const floatValue = parseFloat(this[field]);
          if (!isNaN(floatValue)) {
              this[field] = floatValue;
          }
      }
  }
  next();
});


 
 

  
const modelsConnection = mongoose.createConnection(process.env.MODELS_URL);
 
// Add error handling
modelsConnection.on('error', console.error.bind(console, 'connection error:'));
modelsConnection.once('open', function() {
  console.log("Connected to models database");
});

 
 
//create models

const AchatsDeBiens = modelsConnection.model('AchatsDeBiens', ModelElementSchema, 'achatsdebiens');

 


module.exports = {
   
    AchatsDeBiens, 

    modelsConnection, 
};
