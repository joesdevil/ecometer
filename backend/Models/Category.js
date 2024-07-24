const mongoose = require('mongoose');


const dotenv = require('dotenv');
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
    structure: {
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
    postType: {  // Replaces Type Poste
      type: String,
      default: null,
    },
    totalPostValue: {  // Replaces TotalPosteNonDecompose
      type: Number,
      required: [true, 'totalPostValue field is required']
    },
    co2: {  // Replaces CO2f
      type: Number,
      default: null
    },
    ch4: {  // Replaces CH4f
      type: Number,
      default: null
    },
    ch4b: {  // Replaces CH4b - No change needed as requested
      type: Number,
      default: null
    },
    n2o: {  // Replaces N2O
      type: Number,
      default: null
    },
  });

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

  
const categoriesConnection = mongoose.createConnection(process.env.CATEGORIES_URL);

// Add error handling
categoriesConnection.on('error', console.error.bind(console, 'connection error:'));
categoriesConnection.once('open', function() {
  console.log("Connected to Categories database");
});

//create models

const AchatsDeBiens = categoriesConnection.model('AchatsDeBiens', CategoryElementSchema, 'achatsdebiens');

const AchatsDeServices = categoriesConnection.model('AchatsDeServices', CategoryElementSchema, 'achatsdeservices');

const Combustibles = categoriesConnection.model('Combustibles', CategoryElementSchema, 'combustibles');

const ProcessEtEmissionFugitives = categoriesConnection.model('ProcessEtEmissionFugitives', CategoryElementSchema, 'processemissionsfugitives');

const Electricite = categoriesConnection.model('Electricite', CategoryElementSchema, 'electricite');

const ReseauxDeChaleurEtFroid = categoriesConnection.model('ReseauxDeChaleurEtFroid', CategoryElementSchema, 'reseauxchaleuretfroid');

const StatistiquesTerritoriales = categoriesConnection.model('StatistiquesTerritoriales', CategoryElementSchema, 'statistiquesterritoriales');

const TraitementDesDechets = categoriesConnection.model('TraitementDesDechets', CategoryElementSchema, 'traitementdesdechets');

const TransportDeMarchandises = categoriesConnection.model('TransportDeMarchandises', CategoryElementSchema, 'transportdemarchandises');

const TransportDePersonnes = categoriesConnection.model('TransportDePersonnes', CategoryElementSchema, 'transportdepersonnes');

const UTCF = categoriesConnection.model('UTCF', CategoryElementSchema, 'utcf');


module.exports = {
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
    categoriesConnection
};
