const express = require("express");
const mongoose = require("mongoose");
const {
  AchatsDeBiens,
  AchatsDeServices,
  Combustibles,
  ProcessEtEmissionFugitives,
  Electricite,
  ElectriciteParPays,
  ReseauxDeChaleurEtFroid,
  StatistiquesTerritoriales,
  TraitementDesDechets,
  TransportDeMarchandises,
  TransportDePersonnes,
  UTCF,
  Produitsagricoles1,
  Produitsagricoles,
  Produitsalimentaires,
  categoriesConnection,
  categoriesConnection2
} = require("../Models/Category");
const Client = require("../Models/Client");
const validCategories = require("../utils/data").validCategories;

const { isValidObjectId } = require("mongoose");

// get all clients

const getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json({ clients });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};




// Function to get emission factors for a given category
const getEmissionFactors = async (req, res) => {
  try {
    const selectedCategorie = req.query.selectedCategorie;
    console.log("s: " + selectedCategorie);
    // If SelectedCategories isn't valid return 400 bad request
    if (!validCategories.includes(selectedCategorie)) {
      // return res.status(400).json({ error: "Invalid category" });
      return res.status(400).json({ error: (selectedCategorie + " is an invalid category") });
    }
    const factors = await categoriesConnection.model(selectedCategorie).find();
    console.log("factors",factors)
    res.json({ factors });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add a new emission factor
const addEmissionFactor = async (req, res) => {
  try {
    const { selectedCategorie, factor } = req.body;
    // If SelectedCategories isn't valid return 400 bad request
    if (!validCategories.includes(selectedCategorie)) {
      return res.status(400).json({ error: "Invalid category" });
    }
    const Model = await getmodel(selectedCategorie);
    const newFactor = new Model(factor);
    const result = await newFactor.save();
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
// Function to delete a factor
const deleteEmissionFactor = async (req, res) => {
  const { selectedCategorie, factorId } = req.body;
  try {
    // Check if the category is valid
    if (!isValidObjectId(factorId)) {
      return res.status(400).json({ msg: "Invalid factor ID" });
    }
    // If SelectedCategories isn't valid return 400 bad request
    if (!validCategories.includes(selectedCategorie)) {
      return res.status(400).json({ error: "Invalid category" });
    }
    const Model = await getmodel(selectedCategorie);
    const result = await Model.findByIdAndDelete(factorId);
    if (!result) {
      return res.status(404).json({ error: "Factor not found" });
    }
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
// Function to modify a factor
const modifyEmissionFactor = async (req, res) => {
  const { selectedCategorie, factorId, factor } = req.body;
  try {
    // Check if the category is valid
    if (!isValidObjectId(factorId)) {
      return res.status(400).json({ msg: "Invalid factor ID" });
    }
    // If SelectedCategories isn't valid return 400 bad request
    if (!validCategories.includes(selectedCategorie)) {
      return res.status(400).json({ error: "Invalid category" });
    }
    const Model = await getmodel(selectedCategorie);
    const result = await Model.findByIdAndUpdate(factorId, factor, {
      new: true,
    });
    if (!result) {
      return res.status(404).json({ error: "Factor not found" });
    }
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
// Function to get the model for a given category
async function getmodel(mainCategory) {
  const Model = categoriesConnection.model(mainCategory);
  return Model;
}

module.exports = {
  getEmissionFactors,
  addEmissionFactor,
  deleteEmissionFactor,
  modifyEmissionFactor,
  getClients,
};
