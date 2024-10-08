const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
// Get the current date
const currentDate = new Date();
// Get the current year
const currentYear = currentDate.getFullYear();

const usedElements = new mongoose.Schema({
  quantity: {
    type: Number,
    default: 0,
  },
  categoryElement: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "category",
  },
});
// Define schema for emission posts
const emissionPostSchema = new mongoose.Schema({
  index: Number,
  category: String,
  postName: String,
  scope: String,
  uncertainty: { type: Number, default: 0 },
  emissions: { type: Number, default: 0 }, // Default value is 0 for emissions
  // other gasses (CH4, N2O, CO2) default is "NC/0" (non calculé)
  // CO2: { type: Number, default: 0 },
  // CH4: { type: Number, default: 0 },
  // N2O: { type: Number, default: 0 },
  // CO2f: { type: Number, default: 0 },
  // CH4b: { type: Number, default: 0 },
  // CH4f: { type: Number, default: 0 },
  categoryElements: {
    type: [usedElements],
    default: [], // default value is an empty array , the model depends on the category
  },
});
 
// Define schema for carbon footprint document
const carbonFootprintSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  emissionPosts: [emissionPostSchema],
  totalUncertainty: { type: Number, default: 0 },
  year: { type: Number, default: currentYear },
  totalEmissions: { type: Number, default: 0 },  
  createdAt: { type: Date, default: Date.now },  
});

 

const bilansConnection = mongoose.createConnection(process.env.BILANS_URL);
// Add error handling
bilansConnection.on("error", console.error.bind(console, "connection error:"));
bilansConnection.once("open", function () {
  console.log("Connected to Bilans database");
});

// Create model for carbon footprint
const CarbonFootprint = bilansConnection.model(
  "CarbonFootprint",
  carbonFootprintSchema,
  "carbonFootprints"
); 

 

module.exports = {
  CarbonFootprint
};
