const express = require("express");
const { getCategoryElements, uploadExcelToMongo } = require("../controllers/category");
const mongoose = require("mongoose");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post("/nextCategories", getCategoryElements);
router.post("/uploadExcelToMongo",upload.single('excelfile'), uploadExcelToMongo);

module.exports = router;
