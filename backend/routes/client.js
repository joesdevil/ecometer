const express = require("express");
const multer = require('multer'); 
const path = require('path');
const {
  registerClient,
  loginClient,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getClientProfile,
  getQstsforClients,
  getQstsforClient,
  uploadQstsforClients,
  updateClientProfile,
  deleteClient,
  updateClientPassword,
  updateQstsforClients,
  getAllClients,
  generatePDF,
  reverifyClient
} = require("../controllers/client");
const { verifyClientToken } = require("../middleware/auth");
const xlsx = require('xlsx');
const VerificationToken = require("../Models/verificationToken");

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

// POST Routes

router.post("/register", registerClient);
router.post("/login", loginClient);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);
router.post("/reverifyClient",reverifyClient)

router.post("/uploadQstsforClients",upload.single('file'), uploadQstsforClients);

router.put("/updateQstsforClients", updateQstsforClients);
// GET Routes
router.get("/getQstsforClients",verifyClientToken, getQstsforClients);
router.get("/getQstsforClient/:clientId", verifyClientToken, getQstsforClient);
router.get("/generatePDF/:clientId",verifyClientToken,generatePDF)

router.get("/profile",verifyClientToken, getClientProfile);

router.get("/getAll",verifyClientToken, getAllClients);

// UPDATE Routes

router.put("/update-profile/",verifyClientToken, updateClientProfile);
router.put("/update-password/",verifyClientToken, updateClientPassword);

// DELETE Routes
 

router.delete("/delete/:clientId",verifyClientToken, deleteClient);

module.exports = router;
