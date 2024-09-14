const express = require("express");
const mongoose = require("mongoose");
const xlsx = require('xlsx');

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
  Produitsalimentaires,
  Produitsagricoles,
  ModelDB,
  categoriesConnection,
  categoriesConnection2 
  // agribalyse 
 
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

  
  // agribalyse
  "Produits alimentaires", 
  "Produits agricoles"
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
    case "ModelDB":
      console.log("model db")
      Model = categoriesConnection.model("ModelDB");
      break;
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
    case "Electricité":
      Model = categoriesConnection.model("ElectriciteParPays");
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
    // agribalyse
    case "Produitsalimentaires":
      console.log("salk")
      Model = categoriesConnection2.model("Produitsalimentaires");
      break; 
      
    case "Produitsagricoles":
      console.log("sal")
      Model = categoriesConnection2.model("Produitsagricoles");
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


  console.log("userSelectedCategories",userSelectedCategories)

  console.log("matchingDocuments",matchingDocuments.length)
  // Extract next level categories from matching documents
 
    matchingDocuments.forEach((doc) => {  

  console.log("doc",doc)
  console.log("doc categories",doc["categories"])

      const nextCategoryIndex = doc.categories.indexOf(userSelectedCategories[userSelectedCategories.length-1]) + 1;
      console.log("nextCategoryIndex",nextCategoryIndex)
      if (doc.categories[nextCategoryIndex]) {
        
        nextLevelCategories.add(doc.categories[nextCategoryIndex]);
      }
    });
    
  
  
  nextLevelCategories = Array.from(nextLevelCategories);
  return { nextLevelCategories, matchingDocuments, existingCategory };
}


const getModelDb = async (req, res) => {
  try {
    // Extract the `id` from the route parameters
    const { id } = req.params;

    // Use the `id` to query your database or perform other actions
    // For example, let's assume you have a ModelDB and you want to find a document by `id`
    const model = await ModelDB.findById(id); // Replace ModelDB with your actual model

    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }

    // Send the retrieved model as a JSON response
    res.json(model);
  } catch (error) {
    // Handle errors
    console.error('Error fetching model:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getModelDbByName = async (req, res) => {
  try {
    // Extract the `id` from the route parameters
    const { name } = req.params;

    // Use the `id` to query your database or perform other actions
    // For example, let's assume you have a ModelDB and you want to find a document by `id`
    const model = await ModelDB.findOne({dbName:name}); // Replace ModelDB with your actual model

    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }

    // Send the retrieved model as a JSON response
    res.json(model);
  } catch (error) {
    // Handle errors
    console.error('Error fetching model:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const updateModelDb = async (req, res) => {
  const { id } = req.params;
  console.log("id",id)
  try {
    // Update the document in the database
    const result = await ModelDB.updateOne({ _id: id }, req.body);

    // Check if any document was modified
    if (result.nModified === 0) {
      return res.status(404).json({ message: 'Document not found or no changes were made.' });
    }

    // Respond with success
    res.status(200).json({ message: 'Document updated successfully.' });
  } catch (error) {
    // Handle errors
    console.error('Error updating document:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getModelsDb = async(req,res)=>{
  try {
     

  
 
    const models = await ModelDB.find({})
    // Send a success response to the client
    res.status(201).json({ message: "Document saved successfully", data: models });
  } catch (error) {
    console.error("Error saving to database:", error);

    // Send an error response to the client
    res.status(500).json({ message: "Error saving document", error: error.message });
  }

}


const createModelDb = async (req, res) => {
  try {
     

    // Create a new document based on the request body
    const modelToSave = new ModelDB(req.body); // You don't need to wrap `req` in the object

    // Save the document to the database
    await modelToSave.save();

    // Send a success response to the client
    res.status(201).json({ message: "Document saved successfully", data: modelToSave });
  } catch (error) {
    console.error("Error saving to database:", error);

    // Send an error response to the client
    res.status(500).json({ message: "Error saving document", error: error.message });
  }
};


const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const { read } = require("fs");

const app = express(); 

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Save to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Preserve the original file name and ensure the extension is included
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    cb(null, `${baseName}${extension}`);  // Set the file name to the original name with the correct extension
  }
});

const upload = multer({ storage: storage });

// Define the upload route
async function uploadExcelToMongo(req, res){


  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = path.join(__dirname, '../uploads', req.file.filename);

  try {
    // Read the Excel file
    const workbook = xlsx.readFile(filePath);

    // Initialize an object to store headers for each sheet
    const allHeaders = {};

    // Iterate over each sheet and extract headers
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];

      // Extract headers (first row) using sheet_to_json with options
      const headers = xlsx.utils.sheet_to_json(worksheet, { header: 1 })[0];

      // Check if all headers contain "Unnamed"
      const allUnnamed = headers.every(header => typeof header === 'string' && header.startsWith('Unnamed'));

      // Only add the sheet if not all headers are "Unnamed"
      if (!allUnnamed) {
        allHeaders[sheetName] = headers;
      }
    });


     

      // Create a new document based on the request body
      const modelToSave = new ModelDB({
        methode:{},
        display:{},
        dbName:req.file.filename.replace(".xlsx",""),
        headers:allHeaders,
        steps:{}

      }); // You don't need to wrap `req` in the object
  
      // Save the document to the database
      const savedModel = await modelToSave.save();

    // Retrieve the ID of the saved document
    const id = savedModel._id;

  
      console.log("modelToSave._id ",id.toString()  )
  


 
    // Send all headers as the response
    


   
  

  const fileExtension = path.extname(req.file.originalname).toLowerCase(); 

  const mongoUri = 'mongodb://localhost:27017/';

  console.log("fileExtension",fileExtension)

  if(fileExtension==".pdf"){
    console.log("fileExtension",fileExtension)

    res.json({ message: 'Notice File uploaded successfully', type: "notice" });
  }else{
    exec(`python upload_to_mongo.py "${filePath}" "${mongoUri}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      return res.status(500).send('Error processing file.');
    }
    if (stderr) {
      console.error(`Script stderr: ${stderr}`);
      return res.status(500).send('Error processing file.');
    }
  
    res.json({ message: 'File uploaded successfully', id: id.toString() });
    
  });
}

  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ message: 'Error processing file', error: error.message });
  }
  // Call the Python script
  
  
};


module.exports = { getCategoryElements,uploadExcelToMongo,createModelDb ,getModelDb,updateModelDb,getModelsDb,getModelDbByName};
