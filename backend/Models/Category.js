const mongoose = require('mongoose');


const dotenv = require('dotenv');
const { schema } = require('./Bilan');
dotenv.config();

const Schema = mongoose.Schema;

//define CategorySchema

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
    // 
  });

const schemacategory2 = new Schema({
    db_type: {  // Replaces Type Poste
      type: String,
      default: null,
    },
    // agribalyse
    
CodeAGB:{  // Replaces Type Poste
  type: Number,
  default: null,
},
CodeCIQUAL:{  // Replaces Type Poste
  type: Number,
  default: null,
},
"Groupe d'aliment":{  // Replaces Type Poste
  type: String,
  default: null,
},
"Sous-groupe d'aliment":{  // Replaces Type Poste
  type: String,
  default: null,
},

"Nom du Produit en Francais":{  // Replaces Type Poste
  type: String,
  default: null,
},
"Nom du Produit Equivalent en Algerie ":{  // Replaces Type Poste
  type: String,
  default: null,
},

"code saison (0 : hors saison ; 1 : de saison ; 2 : mix de consommation FR)":{  // Replaces Type Poste
  type: Number,
  default: null,
},

"code avion (1 : par avion)":{  // Replaces Type Poste
  type: Number,
  default: null,
},

Livraison:{  // Replaces Type Poste
  type: String,
  default: null,
},

"Materiau d'emballage":{  // Replaces Type Poste
  type: String,
  default: null,
},
Preparation:{  // Replaces Type Poste
  type: String,
  default: null,
},

"DQR - Note de qualité de la donnée (1 excellente ; 5 très faible)" :{  // Replaces Type Poste
  type: Number,
  default: null,
},

"kg CO2 eq/kg":{  // Replaces Type Poste
  type: Number,
  default: null,
},
categories: {  // Replaces separate Category fields
  type: [String],
},



  })


  const schemacategory3 = new Schema({
    db_type: {  // Replaces Type Poste
      type: String,
      default: null,
    },
    // agribalyse
 
"Nom du Produit en Francais":{  // Replaces Type Poste
  type: String,
  default: null,
},
"kg CO2 eq/kg":{  // Replaces Type Poste
  type: String,
  default: null,
},

"Catégorie":{  // Replaces Type Poste
  type: String,
  default: null,
},
 
   
categories: {  // Replaces separate Category fields
  type: [String],
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


schemacategory2.pre('save', function(next) {
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

schemacategory3.pre('save', function(next) {
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
const categoriesConnection3 = mongoose.createConnection(process.env.CATEGORIES_URL);

// Add error handling
categoriesConnection.on('error', console.error.bind(console, 'connection error:'));
categoriesConnection.once('open', function() {
  console.log("Connected to Categories 1 database");
});

categoriesConnection2.on('error', console.error.bind(console, 'connection error:'));
categoriesConnection2.once('open', function() {
  console.log("Connected to Categories 2 database");
});

categoriesConnection3.on('error', console.error.bind(console, 'connection error:'));
categoriesConnection3.once('open', function() {
  console.log("Connected to Categories 3 database");
});
//create models

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
const Produitsalimentaires = categoriesConnection2.model('Produitsalimentaires', schemacategory2, 'produitsalimentaires');
const Produitsagricoles = categoriesConnection3.model('Produitsagricoles', schemacategory3, 'produitsagricoles');
const Produitsagricoles1 = categoriesConnection3.model('Produitsagricoles1', schemacategory3, 'produitsagricoles1');




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
    Produitsagricoles1,

    categoriesConnection,
    categoriesConnection2,
    categoriesConnection3
};
