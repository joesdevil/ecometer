const Client = require("../Models/Client");
const Admin = require("../Models/Admin");
const VerificationToken = require("../Models/verificationToken");
const ResetToken = require("../Models/resetToken");
const crypto = require("crypto");
const { createRandomBytes } = require("../utils/helper");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");
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
    password,
    numberOfEmployees,
    industry,
    address,
    numberOfLocations,
    structure,
    profilePicture,
  } = req.body;

  console.log("sending body req")
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
      html: emailVerificationTemplate(OTP),
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
    console.error("Error creating client:", error);
    res.status(400).json({ error: error.message });
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
      isAdmin: isAdmin
    });
  } catch (error) {
    console.error("Error s:", error);

    console.log(error.contains("MongoNetworkError"))

    return res.status(500).json({ error: "Internal error" });
  }
};

const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const clientId = req.clientId;

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

  const verificationToken = await VerificationToken.findOne({
    owner: clientId,
  });
  if (!verificationToken) {
    return res.status(404).json({ msg: "Token not found" });
  }

  const isMatched = await verificationToken.compareToken(otp);
  if (!isMatched) {
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

    client.name = name;
    client.email = email;
    client.numberOfEmployees = numberOfEmployees;
    client.industry = industry;
    client.address = address;
    client.numberOfLocations = numberOfLocations;
    client.structure = structure;

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

module.exports = {
  registerClient,
  loginClient,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getClientProfile,
  updateClientProfile,
  deleteClient,
  updateClientPassword,
  getAllClients,
};
