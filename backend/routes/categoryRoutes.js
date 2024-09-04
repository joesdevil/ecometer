const express = require("express");
const { getCategoryElements, uploadExcelToMongo } = require("../controllers/category");
const mongoose = require("mongoose");
const multer = require('multer'); 
const path = require('path');

const router = express.Router();

// Configure Multer to preserve original file names
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');  // Save files to the 'uploads' directory
    },
    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, extension);
      cb(null, `${baseName}${extension}`);  // Preserve original filename and extension
    }
  });
  
const upload = multer({ storage: storage });

router.post("/nextCategories", getCategoryElements);
router.post("/uploadExcelToMongo",upload.single('excelfile'), uploadExcelToMongo);

module.exports = router;
