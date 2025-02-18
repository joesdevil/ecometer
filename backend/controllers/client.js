const Client = require("../Models/Client");
const ClientQuestion = require("../Models/ClientQuestion");

const Admin = require("../Models/Admin");
const VerificationToken = require("../Models/verificationToken");
const ResetToken = require("../Models/resetToken");
const crypto = require("crypto");
const { createRandomBytes } = require("../utils/helper");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");
const xlsx = require('xlsx');
const fs = require("fs");
const PDFDocument = require('pdfkit');
const {
  generateOTP,
  mailTransport,
  emailVerificationTemplate,
  emailVerifiedTemplate,
  passwordResetTemplate,
  passwordResetSuccessTemplate,
} = require("../utils/mail");
const dotenv = require("dotenv");
dotenv.config();
const { isValidObjectId } = require("mongoose");

// register a client (create a new client)
const registerClient = async (req, res) => {
   
  const {
    name,
    email,
    
    numberOfEmployees,
    industry,
    address,
    numberOfLocations,
    structure,
    number,
    purpose,
    message,
    conf1,
    conf2,
    profilePicture,
  } = req.body;

  function formatName(name) {
    const noSpaces = name.replace(/\s+/g, ''); // Remove all whitespace
    return noSpaces.charAt(0).toUpperCase() + noSpaces.slice(1).toLowerCase();
} 
 
  

  function generateFourDigitNumber() {
    return Math.floor(1000 + Math.random() * 9000);
}

const password = formatName(name) + generateFourDigitNumber();

  try {
    // Create a new client using Model.create()
    const profilePicture = req.body.profilePicture; // Should be a base64 string or a valid URL
    const uploadedResponse = await cloudinary.uploader.upload(profilePicture, {
      upload_preset: "ecometer",
      folder: `profile_pictures/${name}`,
    });

    console.log(uploadedResponse);

    const newClient = new Client({
      name,
      email,
      password,
      numberOfEmployees,
      industry,
      address,
      numberOfLocations,
      structure,
      number,
      purpose,
      message,
      conf1,
      conf2,
      profilePicture: {
        public_id: uploadedResponse.public_id,
        url: uploadedResponse.secure_url,
      },
    });


    // Save the client to the database
    await newClient.save();
    console.log(newClient._id);
    // Generate a verification token
    const OTP = generateOTP();
    const newVerificationToken = new VerificationToken({
      owner: newClient._id,
      token: OTP,
    });
    console.log(newVerificationToken.owner);

    // Save the verification token to the database
    await newVerificationToken.save();

    console.log("sending email to ",newClient.email)

    console.log("process.env.GMAIL_ADRESS ",process.env.GMAIL_PASS)
    console.log("process.env.GMAIL_PASS ",newClient.GMAIL_PASS)
    // Send verification email
    mailTransport().sendMail({
      from: process.env.EMAIL_USER,
      to: newClient.email,
      subject: "Verify your email account",
      html: emailVerificationTemplate(OTP,newClient._id),
    });
    const token = jwt.sign(
      { clientId: newClient._id, username: newClient.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    // Return the newly created client in the response
    res.status(201).json({
      msg: "Client created successfully",
      data: newClient,
      token: token,
    });
  } catch (error) {
    // If an error occurs during validation or database operation, handle it
    console.error("-->Error creating client:", error);
    res.status(400).json({ error: error });
  }
};

// login the client
const loginClient = async (req, res) => {
  const { email, password } = req.body;
  try {
    let isAdmin = false; // Initialize isAdmin flag

    if (!email.trim() || !password.trim()) {
      return res.status(400).json({ msg: "Email and password are required" });
    }
    console.log(email);
 
    const client = await Client.findOne({ email });
    if (client) {
      // If the user exists in the Client collection, check password
      const isMatched = await client.comparePassword(password);
      if (!isMatched) {
        return res.status(401).json({ msg: "Invalid Credentials" });
      }
    } else {
      // If the user does not exist in the Client collection,
      // check if the user exists in the Admin collection
      const admin = await Admin.findOne({Email: email});
      const admins = await Admin.find();
      console.log(admins);
      if (!admin) {
        return res.status(404).json({ msg: "User not found" });
      }
    
      if ( admin && admin.Password !== password ) {
        return res.status(401).json({ msg: "Invalid Credentials" });
      }
      // If the password matches for admin, set isAdmin flag to true
      isAdmin = true;
    }

    // If the user exists and the password matches or the user is an admin
    const token = jwt.sign(
      { clientId: client ? client._id : null, username: client ? client.name : null },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.status(200).json({
      msg: "Login successful",
      token: token,
      clientId: client ? client._id : null,
      isAdmin: isAdmin
    });
  } catch (error) {
    console.error("Error s:", error);

    console.log(error.contains("MongoNetworkError"))

    return res.status(500).json({ error: "Internal error" });
  }
};


const reverifyClient = async(req,res)=>{
  
  try {
    const clientId = req.body.clientId;
  
  const client = await Client.findById(clientId);
  console.log("client",client)
  // await Client.updateOne({ _id: client._id }, { verified: true });

  // Generate a verification token
  const OTP = generateOTP();
  console.log("OTP",OTP)

  const newVerificationToken = new VerificationToken({
    owner: client._id,
    token: OTP,
  }); 

  // Save the verification token to the database
  await newVerificationToken.save(); 
  mailTransport().sendMail({
    from: process.env.EMAIL_USER,
    to: client.email,
    subject: "Verify your email account",
    html: emailVerificationTemplate(OTP,clientId),
  });

  
  return res.status(200).json({ msg: "otp message sent!" });
    
  } catch (error) {
    return res.status(400).json({ msg: "error has occured!" });
  }
}


const verifyEmail = async (req, res) => {
 
  const otp = req.body.otp; 
  const clientId = req.clientId || req.body.cId;
   

//Sifeddinesalem4145
  //otp should be a string
  if (!clientId || !otp.trim()) {
    return res.status(400).json({ msg: "Client ID and OTP are missing" });
  }

  if (!isValidObjectId(clientId))
    return res.status(400).json({ msg: "Invalid client ID" });

  const client = await Client.findById(clientId);
  if (!client) {
    return res.status(404).json({ msg: "Client not found" });
  }

  if (client.verified) {
    return res.status(400).json({ msg: "Email already verified" });
  }

  const verificationTokens = await VerificationToken.find({ owner: clientId });

  if (!verificationTokens.length) {
    return res.status(404).json({ msg: "Token not found" });
  }

  // Check if the OTP matches any of the tokens
  const matchedToken = await Promise.all(
      verificationTokens.map(async (token) => {
        const isMatched = await token.compareToken(otp);
        return isMatched ? token : null;
      })
  );
  // Filter out null values
  const verificationToken = matchedToken.find((token) => token !== null);

  if (!verificationToken) {
    return res.status(400).json({ msg: "Invalid OTP" });
  }

  client.verified = true;

  try {
    await Client.updateOne({ _id: client._id }, { verified: true });

    await VerificationToken.findByIdAndDelete(verificationToken._id);

    mailTransport().sendMail({
      from: process.env.EMAIL_USER,
      to: client.email,
      subject: "Verification completed successfully",
      html: emailVerifiedTemplate(),
    });

    return res.status(200).json({ msg: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email.trim()) {
    return res.status(400).json({ msg: "Email is required" });
  }

  const client = await Client.findOne({ email: email });
  if (!client) {
    return res.status(404).json({ msg: "User not found" });
  }

  // look if the user has already sent a reset password request
  const token = await ResetToken.findOne({ owner: client._id });
  if (token) {
    return res.status(400).json({
      msg: "A Password reset email has already been sent. Please check ur email ",
    });
  }

  const newToken = await createRandomBytes();
  console.log(newToken);
  const resetToken = new ResetToken({
    owner: client._id,
    token: newToken,
  });

  await resetToken.save();

  // Send reset password email
  mailTransport().sendMail({
    from: process.env.EMAIL_USER,
    to: client.email,
    subject: "Password Reset link",
    html: passwordResetTemplate(client.name, process.env.PWD_RESET_LINK),
  });
  console.log(email);
  res.status(200).json({ msg: "reset Email sent successfully" });
};

const resetPassword = async (req, res) => {
  const { clientId, newPassword } = req.body;

  try {
    if (!clientId || !newPassword.trim()) {
      return res
        .status(400)
        .json({ msg: "Client ID and new Password are missing" });
    }

    if (!isValidObjectId(clientId))
      return res.status(400).json({ msg: "Invalid client ID" });

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ msg: "User not found" });
    }

    const token = await ResetToken.findOne({ owner: client._id });

    if (!token) {
      return res.status(404).json({ msg: "Token not found" });
    }

    client.password = newPassword;
    await client.save();

    await ResetToken.findByIdAndDelete(token._id);

    // Send reset password email
    mailTransport().sendMail({
      // from: '"Ecometer" <ecometer.team@gmail.com>',
      from: process.env.EMAIL_USER,
      to: client.email,
      subject: "Password Reset successful",
      html: passwordResetSuccessTemplate(client.name),
    });

    return res.status(200).json({ msg: "Password reset successfully" });
  } catch (e) {
    return res.status(500).json({ msg: e.message });
  }
};



// upload quest*ion for client 
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
  },
});



const upload = multer({ storage: storage });
const path = require('path');
const pdf = require('pdfkit');


const getQstsforClient = async (req, res) => {
  const clientId = req.params.clientId;
  const data = await ClientQuestion.findOne({ "asnwered": false, "clientId": clientId })
   
    
    res.json(data);
 
}

const getQstsforClients = async (req, res) => {
  const clientId = req.clientId;

  console.log("lii->", clientId);

  if (!isValidObjectId(clientId)) {
    return res.status(400).json({ msg: "Invalid client ID" });
  }

  try {
    const clientQst = await ClientQuestion.findOne({ "asnwered": false, "clientId": clientId });

    if (!clientQst) {
      return res.status(200).json({ data: null });
    }
    console.log("clientQst",clientQst)

    return res.status(200).json(clientQst);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal error" });
  }
}

const updateQstsforClients = async (req,res) =>{


   
  const clientId = req.body.clientId;
  const data = req.body.data;
  const answered = req.body.answered;


  if (!isValidObjectId(clientId)) {
    return res.status(400).json({ msg: "Invalid client ID" });
  }

  try {
    const clientQuestion = await ClientQuestion.findOne({"asnwered":false,"clientId":clientId});

    clientQuestion.data = data;
    clientQuestion.asnwered=answered;

    await clientQuestion.save();
    if (!clientQuestion) {
      return res.status(404).json({ msg: "Client questions saved" });
    }

    return res.status(200).json(clientQuestion);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal error" });
  }
}
// Define the upload route
// router.post("/api/clients/uploadQstsforClients", upload.single("file"), 
const uploadQstsforClients = async (req, res) => {
  if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
  } 
  const clientId= req.body.clientId;

  const filePath = path.join(__dirname, "../uploads", req.file.filename);

  try {
    const clientId = req.body.clientId;
    if (!clientId) {
      return res.status(400).json({ error: "clientId is required" });
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    let extractedData = {};

    workbook.SheetNames.forEach((sheet) => {
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet], {
        header: 1, // Read as an array of rows instead of key-value pairs
        defval: "", // Ensures missing values are empty
      });
    
      if (sheetData.length < 2) return; // Skip empty sheets or sheets with only headers
    
      extractedData[sheet] = {};
    
      // Start from index 1 to skip headers
      for (let i = 1; i < sheetData.length; i++) {
        const row = sheetData[i];
        if (row.length < 1 || !row[0]) continue; // Skip empty rows
    
        const question = row[0];
        extractedData[sheet][question] = ""; // Default empty answer
      }
    });
    

    fs.unlinkSync(filePath); // Delete file after processing

    // Save to MongoDB
    const newEntry = new ClientQuestion({
      clientId:  clientId,
      answered: false,
      data: extractedData,
    });

    await newEntry.save();
    res.json({ message: "File uploaded and data saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// get a clients profile
const getClientProfile = async (req, res) => {
  const clientId = req.clientId;

  if (!isValidObjectId(clientId)) {
    return res.status(400).json({ msg: "Invalid client ID" });
  }

  try {
    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({ msg: "Client not found" });
    }

    return res.status(200).json(client);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal error" });
  }
};

 

// update a clients profile
const updateClientProfile = async (req, res) => {
  const {
    name,
    email,
    numberOfEmployees,
    industry,
    address,
    numberOfLocations,
    structure,
    number,
    purpose,
    message,
    conf1,
    conf2,
  } = req.body;
  const clientId = req.clientId; // Added this line

  if (!isValidObjectId(clientId)) {
    return res.status(400).json({ msg: "Invalid client ID" });
  }

  try {
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ msg: "Client not found" });
    }


    function formatNumber(number) {
      const numberStr = number.toString(); // Convert the number to a string
      if (numberStr.startsWith("213")) {
          return "+" + numberStr;
      } else {
          return "0" + numberStr;
      }
  }

    number=formatNumber(number);

    client.name = name;
    client.email = email;
    client.numberOfEmployees = numberOfEmployees;
    client.industry = industry;
    client.address = address;
    client.numberOfLocations = numberOfLocations;
    client.structure = structure;
    client.number = number;
    client.message = message;
    client.purpose = purpose;
    client.conf1 = conf1;
    client.conf2 = conf2;
    client.isAdmin = false;

    await client.save();
    return res.status(200).json(client);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal error" });
  }
};

// update client password
const updateClientPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const clientId = req.clientId; // Added this line

  if (!isValidObjectId(clientId)) {
    return res.status(400).json({ msg: "Invalid client ID" });
  }
  try {
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ msg: "Client not found" });
    }
    const isMatched = await client.comparePassword(oldPassword);
    if (!isMatched) {
      return res.status(400).json({ msg: "Invalid password" });
    }
    client.password = newPassword;
    await client.save();
    return res.status(200).json(client);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal error" });
  }
};

// delete a client

const deleteClient = async (req, res) => {
  const clientId = req.clientId; // Added this line

  if (!isValidObjectId(clientId)) {
    return res.status(400).json({ msg: "Invalid client ID" });
  }

  try {
    const client = await Client.findByIdAndDelete(clientId);
    if (!client) {
      return res.status(404).json({ msg: "Client not found" });
    }
    return res.status(200).json({ msg: "Client deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal error" });
  }
};

// get all clients

const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    return res.status(200).json(clients);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal error" });
  }
};

const generatePDF = async (req, res) => {
  const clientId = req.params.clientId;

  console.log("-->",clientId)
  if (!isValidObjectId(clientId)) {
    return res.status(400).json({ msg: "Invalid client ID" });
  }
 
    const client = await Client.findById(clientId);
    
    if (!client) {
      return res.status(404).json({ msg: "Client not found" });
    }

    const data = await ClientQuestion.findOne({ "asnwered": false, "clientId": clientId })
    
    if (!data) {
    
      return res.status(404).json({ msg: "Client questions not found" });
    }

    const doc = new PDFDocument();

    // Set response headers to trigger download
    res.setHeader("Content-Disposition", 'attachment; filename="questions.pdf"');
    res.setHeader("Content-Type", "application/pdf");

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add content to the PDF
    doc.fontSize(20).text(`Client: ${client.name}`, { align: 'center' });
    doc.moveDown();

    // Iterate through the questions and answers
    for (const [sheet, questions] of Object.entries(data.data)) {
      doc.fontSize(14).text(`${sheet}`, { continued: true });
      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      for (const [qst, ans] of Object.entries(data.data[sheet])) {
        doc.moveDown(1.5); // Add padding top of 10
      doc.fontSize(14).text(` ${qst} :`, { continued: true });
      doc.fontSize(14).text(` ${ans}`, { align: 'right' });
      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      }

      doc.moveDown();
    }

    // Finalize the document
    doc.end();
  
};

module.exports = {
  registerClient,
  loginClient,
  verifyEmail,
  forgotPassword,
  resetPassword,
  uploadQstsforClients,
  getClientProfile,
  getQstsforClients,
  getQstsforClient,
  updateClientProfile,
  deleteClient,
  updateClientPassword,
  updateQstsforClients,
  getAllClients,
  reverifyClient,
  generatePDF
};
