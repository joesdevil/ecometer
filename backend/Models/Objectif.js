const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Schema = mongoose.Schema;

//define ObjectifSchema

const ObjectifSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: "Client",
    required: [true, "clientId field is required"],
  },
  year: {
    type: Number,
    required: [true, "year field is required"],
  },
  objectif: {
    type: Number,
    required: [true, "objectif field is required"],
  },
  objectifType: {
    type: String, // can be: 'reduction', 'compensation', 'neutral'
    required: [true, "objectifType field is required"],
  },
  objectifDescription: {
    type: String,
    default: "",
  },
});

//create model
console.log("mongo db url",process.env.USERS_URL)
 
const usersConnection = mongoose.createConnection(process.env.USERS_URL);

usersConnection.on("error", console.error.bind(console, "connection error:"));

usersConnection.once("open", function () {
  console.log("Connected to users database");
});

const Objectif = usersConnection.model("Objectif", ObjectifSchema, "objectifs");

module.exports = Objectif;
