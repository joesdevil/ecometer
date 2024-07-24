const express = require("express");
const mongoose = require("mongoose");
const {
  AchatsDeBiens,
  AchatsDeServices,
  Combustibles,
  ProcessEtEmissionFugitives,
  Electricite,
  ReseauxDeChaleurEtFroid,
  StatistiquesTerritoriales,
  TraitementDesDechets,
  TransportDeMarchandises,
  TransportDePersonnes,
  UTCF,
  categoriesConnection,
} = require("../Models/Category");

// maincategories should be as the first category for each activity by default
const mainCategories = [
  "Combustibles",
  "Achats de biens",
  "Achats de services",
  "Electricité",
  "Process et émissions fugitives",
  "Réseaux de chaleur / froid",
  "Statistiques territoriales",
  "Traitement des déchets",
  "Transport de marchandises",
  "Transport de personnes",
  "UTCF",
];

// Function to get the next level categories and matching documents

const getCategoryElements = async (req, res) => {
  // Define API endpoint to handle user-selected categories
  try {
    console.log("request send");
    const userSelectedCategories = req.body.userSelectedCategories;
    console.log(userSelectedCategories);
    // If userSelectedCategories is empty, return the default categories
    if (
      !userSelectedCategories ||
      userSelectedCategories.length === 0 ||
      userSelectedCategories[0] === ""
    ) {
      return res.status(400).json({ msg: "enter Categories please" });
    }
    
    // Query MongoDB to get the next level categories
    const { nextLevelCategories, matchingDocuments, existingCategory } =
    await getNextLevelCategories(userSelectedCategories);

    // if selectedcategories are not valid return 404 invalid categories
    if (existingCategory === false) {
      return res.status(404).json({ msg: " Invalid Categories " });
    }
    console.log(matchingDocuments.length);
    res.json({
      nextCategories: nextLevelCategories,
      matchingDocuments: matchingDocuments,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to get the next level categories
async function getNextLevelCategories(userSelectedCategories) {
  let nextLevelCategories = new Set();
  let existingCategory = true;
  const mainCategory = userSelectedCategories[0].replace(/\s+/g, "");
  let Model;
  console.log("mainCategory",mainCategory)
  switch (mainCategory) {
    case "Combustibles":
      Model = categoriesConnection.model("Combustibles");
      break;
    case "Achatsdebiens":
      Model = categoriesConnection.model("AchatsDeBiens");
      break;
    case "Achatsdeservices":
      Model = categoriesConnection.model("AchatsDeServices");
      break;
    case "Electricité":
      Model = categoriesConnection.model("Electricite");
      break;
    case "Processetémissionsfugitives":
      Model = categoriesConnection.model("ProcessEtEmissionFugitives");
      break;
    case "Réseauxdechaleur/froid":
      Model = categoriesConnection.model("ReseauxDeChaleurEtFroid");
      break;
    case "Statistiquesterritoriales":
      Model = categoriesConnection.model("StatistiquesTerritoriales");
      break;
    case "Traitementdesdéchets":
      Model = categoriesConnection.model("TraitementDesDechets");
      break;
    case "Transportdemarchandises":
      Model = categoriesConnection.model("TransportDeMarchandises");
      break;
    case "Transportdepersonnes":
      Model = categoriesConnection.model("TransportDePersonnes");
      break;
    case "UTCF":
      Model = categoriesConnection.model("UTCF");
      break;
    default:
      existingCategory = false;
      return {
        nextLevelCategories: [],
        matchingDocuments: [],
        existingCategory,
      };
  }

  // Query MongoDB using Mongoose to find next level categories
  const matchingDocuments = await Model.find({
    categories: { $all: userSelectedCategories },
  });

  console.log("matchingDocuments",matchingDocuments)
  // Extract next level categories from matching documents
  matchingDocuments.forEach((doc) => {
     console.log("userSelectedCategories",userSelectedCategories)
     console.log("userSelectedCategories[userSelectedCategories.length-1]",userSelectedCategories[userSelectedCategories.length-1])
    const nextCategoryIndex = doc.categories.indexOf(userSelectedCategories[userSelectedCategories.length-1]) + 1;
    console.log("nextCategoryIndex",nextCategoryIndex)
    if (doc.categories[nextCategoryIndex]) {
      
      nextLevelCategories.add(doc.categories[nextCategoryIndex]);
    }
  });
  nextLevelCategories = Array.from(nextLevelCategories);
  return { nextLevelCategories, matchingDocuments, existingCategory };
}

module.exports = { getCategoryElements };
