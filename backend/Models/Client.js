const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const dotenv = require('dotenv');

dotenv.config();

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
    validate: [
      {
        validator: async function(value) {
          // If the document is being newly created, perform the uniqueness check
          if (!this.isNew) {
            return true; // Skip uniqueness check for updates
          }
          
          // Perform uniqueness check for new documents
          const existingClient = await this.constructor.findOne({ name: value });
          return !existingClient;
        },
        message: props => `The name "${props.value}" is already in use.`
      }
    ]
    
  },
  numberOfEmployees: {
    type: Number,
    required: [true, 'Number of employees is required'],
    min: [1, 'Number of employees must be at least 1'],
    max: [10000, 'Number of employees cannot exceed 10,000'] // Adjust max value as needed
  },
  profilePicture: {
    public_id:{
      type: String,
    },
    url:{
      type: String,
    },
  },  
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    trim: true,
    minlength: [3, 'Industry must be at least 3 character long'],
    maxlength: [50, 'Industry cannot exceed 50 characters']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    minlength: [3, 'Address must be at least 3 character long'],
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [
      {
        validator: function(value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: props => `${props.value} is not a valid email address!`
      },
      {
        validator: async function(value) {
          // If the document is being newly created, perform the uniqueness check
          if (!this.isNew) {
            return true; // Skip uniqueness check for updates
          }
          
          // Perform uniqueness check for new documents
          const existingClient = await this.constructor.findOne({ email: value });
          return !existingClient;
        },
        message: props => `The name "${props.value}" is already in use.`
      }
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    validate: {
      validator: function(value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(value);
      },
      message: props => `Password must contain at least one uppercase letter, one lowercase letter, and one digit!`
    }
  },
  number: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [
      {
        validator: function(value) {
          return /^(\+213|0)(5|6|7)[0-9]{8}$/.test(value);
        },
        message: props => `${props.value} is not a valid phone number`
      },
      {
        validator: async function(value) {
          // If the document is being newly created, perform the uniqueness check
          if (!this.isNew) {
            return true; // Skip uniqueness check for updates
          }
          
          // Perform uniqueness check for new documents
          const existingClient = await this.constructor.findOne({ number: value });
          return !existingClient;
        },
        message: props => `The phone number "${props.value}" is already in use.`
      }
    ]
  },
  purpose: {
    type: String,
    required: false,
  },

  message: {
    type: String,
    required: false,
    unique: false,
    trim: true,
    minlength: [10, 'Message must be at least 10 characters long'],
    maxlength: [1000, 'message cannot exceed 1000 characters'],
    
    
  },
  structure: {
    type: String,
    required: [true, 'Structure is required'],
    trim: true,
    minlength: [3, 'Structure must be at least 3 character long'],
    maxlength: [50, 'Structure cannot exceed 50 characters']
  },
  conf1:{
    type: Boolean,
    default: false,
    required: true,
  },
  conf2:{
    type: Boolean,
    default: false,
    required: true,
  },
  isAdmin:{
    type: Boolean,
    default: false
  },
  verified:{
    type: Boolean,
    default: false,
    required: true,
  }
});






ClientSchema.pre('save', async function(next) {
  // Check if the password field is modified or is new
  if (!this.isModified('password')) {
    return next();
  }
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the generated salt
    const hash = await bcrypt.hash(this.password, salt);
    // Replace the plaintext password with the hashed password
    this.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

ClientSchema.pre('save', function(next) {
  if (!this.profilePicture) {
    this.profilePicture = null; // Set to null if profile picture is not provided
  }
  next();
});


// Compare the plaintext password with the hashed password stored in the database
ClientSchema.methods.comparePassword = async function(plaintext) {
  try {
    return await bcrypt.compare(plaintext, this.password);
  } catch (error) {
    throw new Error(error);
  }
};
// create database connection

const usersConnection = mongoose.createConnection(process.env.USERS_URL);
// Add error handling
usersConnection.on('error', console.error.bind(console, 'connection error:'));
usersConnection.once('open', function() {
  console.log("Connected to users database");
});

const Client = usersConnection.model('Client', ClientSchema,'clients'); 


module.exports = Client ;



// Create an admin user if it doesn't exist
const createAdminUser = async () => {
  try {
    const adminEmail = 'admin@gmail.com'; // Replace with the desired admin email
    const adminUser = await Client.findOne({ email: adminEmail });

    if (!adminUser) {
      const newAdmin = new Client({
        name: 'Admin',
        numberOfEmployees: 1,
        profilePicture: null,
        industry: 'Admin',
        address: 'Admin Address',
        email: adminEmail,
        password: 'AdminCalec1234', // Replace with a secure password
        number: '+213600000000', // Replace with a valid phone number
        purpose: 'Admin',
        message: 'Admin user',
        structure: 'Admin',
        conf1: true,
        conf2: true,
        isAdmin: true,
        verified: true
      });

      await newAdmin.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Call the function to create the admin user
createAdminUser();







