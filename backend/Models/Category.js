const mongoose = require('mongoose');


const dotenv = require('dotenv');
const { schema } = require('./Bilan');
dotenv.config();

const Schema = mongoose.Schema;

//define CategorySchema

const ModelElementSchema = new Schema({
  display: {   
    type: Object,
    required: [true, 'display field is required']
  },
  dbName: {  // Replaces IdentifiantElement
    type: String,
  },
  methode: {
    type: Object,
    required: [true, 'Methode field is required']
  },

  headers: {
    type: Object,
    required: [true, 'headers field is required']
  },
  
  steps:{
    type: Array,
    required: [true, 'steps field is required']
  }
  



});

const CategoryElementSchema = new Schema({
    elementType: {  // Replaces TypeLigne
      type: String,
      required: [true, 'elementType field is required']
    },
    identifier: {  // Replaces IdentifiantElement
      type: Number,
      required: [true, 'identifier field is required']
    },
    Structure: {
      type: String,
      required: [true, 'structure field is required']
    },
    name: {  // Replaces NomBase
      type: String,
      default: '',
    },
    categories: {  // Replaces separate Category fields
      type: [String],
    },
    tags: {
      type: String,
      default: '',
    },
    unit: {  // Replaces Unite
      type: String,
      default: '',
      
    },
    description: {
      type: String,
      default: '',
    },
    uncertainty: {  // Replaces Incertitude
      type: String ,
      default: null 
    },
    Incertitude: {  // Replaces Incertitude
      type: String ,
      default: null 
    },
    postType: {  // Replaces Type Poste
      type: String,
      default: null,
    },
    totalPostValue: {  // Replaces TotalPosteNonDecompose
      type: Number,
      required: [true, 'totalPostValue field is required']
    },
    CO2: {  // Replaces CO2f
      type: Number,
      default: null
    },
    CO2f: {  // Replaces CO2f
      type: Number,
      default: null
    },
    CH4: {  // Replaces CH4f
      type: Number,
      default: null
    },
    CH4b: {  // Replaces CH4b - No change needed as requested
      type: Number,
      default: null
    },
    CH4f: {  // Replaces CH4b - No change needed as requested
      type: Number,
      default: null
    },
    N2O: {  // Replaces N2O
      type: Number,
      default: null
    },
    'Total poste non décomposé':{
      type: Number,
      default: null
    },
    'Nom frontière français':{
      type: String,
      default: null
    },
    'Nom attribut français':{
      type: String,
      default: null
    },
    'Sous-localisation géographique français':{
      type: String,
      default: null
    },

    "Emissions évitées":{  // Replaces TotalPosteNonDecompose
      type: Number,
      required: [false, 'totalPostValue field is required']
    },
    // 
  });

const CategoryElementSchema2 = new Schema({
  db_type: {  // Replaces Type Poste
    type: String,
    default: null,
  },
  // agribalyse

  "Identifiant de l'élément":{  // Replaces Type Poste
    type: Number,
    default: null,
  },


  name:{  // Replaces Type Poste
    type: String,
    default: null,
  },

  categories: {  // Replaces separate Category fields
    type: [String],
  },

  "Code de la catégorie": {  // Replaces separate Category fields
    type: [String],
  },
  
  "Total poste non décomposé":{  // Replaces Type Poste
    type: Number,
    default: null,
  },
    

  })


 
  // Define a pre-save middleware to parse and convert the last five fields to floating-point numbers
CategoryElementSchema.pre('save', function(next) {
  const lastFields = ['totalPostValue', 'co2', 'ch4', 'ch4b', 'n2o'];
  for (const field of lastFields) {
      if (typeof this[field] === 'string') {
          const floatValue = parseFloat(this[field]);
          if (!isNaN(floatValue)) {
              this[field] = floatValue;
          }
      }
  }
  next();
});


CategoryElementSchema2.pre('save', function(next) {
  const lastFields = ['totalPostValue', 'co2', 'ch4', 'ch4b', 'n2o'];
  for (const field of lastFields) {
      if (typeof this[field] === 'string') {
          const floatValue = parseFloat(this[field]);
          if (!isNaN(floatValue)) {
              this[field] = floatValue;
          }
      }
  }
  next();
});
 

  
const categoriesConnection = mongoose.createConnection(process.env.CATEGORIES_URL);
const categoriesConnection2 = mongoose.createConnection(process.env.CATEGORIES_URL); 

// Add error handling
categoriesConnection.on('error', console.error.bind(console, 'connection error:'));
categoriesConnection.once('open', function() {
  console.log("Connected to Categories 1 database");
});

categoriesConnection2.on('error', console.error.bind(console, 'connection error:'));
categoriesConnection2.once('open', function() {
  console.log("Connected to Categories 2 database");
});

 
//create models

const ModelDB = categoriesConnection.model('ModelDB', ModelElementSchema, 'ModelDB');

const AchatsDeBiens = categoriesConnection.model('AchatsDeBiens', CategoryElementSchema, 'achatsdebiens');

const AchatsDeServices = categoriesConnection.model('AchatsDeServices', CategoryElementSchema, 'achatsdeservices');

const Combustibles = categoriesConnection.model('Combustibles', CategoryElementSchema, 'combustibles');

const ProcessEtEmissionFugitives = categoriesConnection.model('ProcessEtEmissionFugitives', CategoryElementSchema, 'processetemissionsfugitives');

const Electricite = categoriesConnection.model('Electricite', CategoryElementSchema, 'electricite');

const ReseauxDeChaleurEtFroid = categoriesConnection.model('ReseauxDeChaleurEtFroid', CategoryElementSchema, 'reseauxdechaleuretfroid');

const StatistiquesTerritoriales = categoriesConnection.model('StatistiquesTerritoriales', CategoryElementSchema, 'statistiquesterritoriales');

const TraitementDesDechets = categoriesConnection.model('TraitementDesDechets', CategoryElementSchema, 'traitementdesdechets');

const TransportDeMarchandises = categoriesConnection.model('TransportDeMarchandises', CategoryElementSchema, 'transportdemarchandises');

const TransportDePersonnes = categoriesConnection.model('TransportDePersonnes', CategoryElementSchema, 'transportdepersonnes');

const ElectriciteParPays = categoriesConnection.model('ElectriciteParPays', CategoryElementSchema, 'electriciteparpays');
const UTCF = categoriesConnection.model('UTCF', CategoryElementSchema, 'utcf');

// agribalyse
const Produitsalimentaires = categoriesConnection2.model('Produitsalimentaires', CategoryElementSchema2, 'produitsalimentaires');
const Produitsagricoles = categoriesConnection2.model('Produitsagricoles', CategoryElementSchema2, 'produitsagricoles'); 




module.exports = {
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
    categoriesConnection2, 
};
