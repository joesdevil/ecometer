const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const dotenv = require('dotenv');

dotenv.config();

 

const ClientQstSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client",required: [true, 'Client is required'] },

   

  asnwered: {
    type: Boolean,
    default:false
    
  },

  data: {
    type: Object,
    required: [true, 'data is required'],
    
  },
})


 

 
const usersConnection = mongoose.createConnection(process.env.USERS_URL);
// Add error handling
usersConnection.on('error', console.error.bind(console, 'connection error:'));
usersConnection.once('open', function() {
  console.log("Connected to users database");
});
 
const ClientQuestion = usersConnection.model('ClientQuestion',ClientQstSchema, 'ClientQuestions')


module.exports = ClientQuestion;
 