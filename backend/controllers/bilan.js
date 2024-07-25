const CarbonFootprint = require("../Models/Bilan");
const {
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
  categoriesConnection,
} = require("../Models/Category");
const { unsubscribe } = require("../routes/categoryRoutes");
const { FixedPosteAttributs } = require("../utils/data");
const { isValidObjectId } = require("mongoose");

const createBilan = async (req, res) => {
  const { clientId } = req.body;
  try {
    let postEmissions = [];
    let i = 0;
    // const FE = await Combustibles.findOne({
    FixedPosteAttributs.map((att) => {
      const newAtt = {
        ...att,
        emissions: 0,
        categoryElements: [],
      };
      postEmissions[i] = newAtt;
      i++;
    });
    const newCarbonFootprint = new CarbonFootprint({
      clientId,
      emissionPosts: postEmissions,
    });
    await newCarbonFootprint.save();
    return res.status(200).json(newCarbonFootprint);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal error" });
  }
};

// update and calculate bilan
const updateAndCalculateBilan = async (req, res) => {
  const { year, clientId, selectedCategoryElements } = req.body;
  console.log("req.body = ", req.body);
  if (!isValidObjectId(clientId)) {
    return res.status(400).json({ msg: "Invalid client ID" });
  }
  
  
    const carbonFootprint = await CarbonFootprint.findOne({ clientId, year });
    if (!carbonFootprint) {
      return res.status(404).json({ msg: "Bilan not found" });
    }
    for (let i = 0; i < selectedCategoryElements.length; i++) {
      const categoryElements = selectedCategoryElements[i];
      if (categoryElements.length > 0) {
        
       


        const { emissions, weightedAverageUncertainty, CO2 ,CH4 , N2O ,CO2f,CH4f,CH4b } =
          await calculateEmissionsPost(
            carbonFootprint.emissionPosts[i].category,
            categoryElements
          );
          
          if(!isNaN(emissions)){
            carbonFootprint.emissionPosts[i].emissions = emissions;
          }
          
          if(!isNaN(weightedAverageUncertainty)){
            carbonFootprint.emissionPosts[i].uncertainty =weightedAverageUncertainty;
          }
           
          if(!isNaN(categoryElements)){
            carbonFootprint.emissionPosts[i].categoryElements = categoryElements;
          }
          if(!isNaN(CO2)){
            carbonFootprint.emissionPosts[i].CO2 = CO2;
          }
          if(!isNaN(CH4)){
            carbonFootprint.emissionPosts[i].CH4 = CH4;
          }
          if(!isNaN(N2O)){
            carbonFootprint.emissionPosts[i].N2O = N2O;
          }
          if(!isNaN(CO2f)){
            carbonFootprint.emissionPosts[i].CO2f = CO2f;
          }
          if(!isNaN(CH4f)){
            carbonFootprint.emissionPosts[i].CH4f = CH4f;
          }
          if(!isNaN(CH4b)){
            carbonFootprint.emissionPosts[i].CH4b = CH4b;
          }
        
        
        
        
       
      }
    }

    const { totalEmissions, totalWeightedAverageUncertainty } =
      await calculateTotalBilan(carbonFootprint.emissionPosts);
    
    carbonFootprint.totalEmissions = totalEmissions;
    carbonFootprint.totalUncertainty = totalWeightedAverageUncertainty;
    await carbonFootprint.save();
    
    return res.status(200).json(carbonFootprint);
  
};

//calculate the emissions for a single post Emission
const calculateEmissionsPost = async (category, categoryElements) => {
  let emissions = 0;
  let totalValueTimesUncertainty = 0;
  let totalValue = 0;
  let CO2 = 0;
  let CH4 = 0;
  let N2O = 0;
  let CO2f= 0;
  let CH4f= 0;
  let CH4b= 0;
  let i = 0;
  
  const Model = categoriesConnection.model(category);
  for (const element of categoryElements) {
    
    const categoryElement = await Model.findById(element.categoryElement);
    // emissions += categoryElement.totalPostValue * element.quantity;
    emissions += categoryElement["Total poste non décomposé"] * element.quantity;
 
    const incertNumber=categoryElement.Incertitude.replace("%","")
    const uncertaintyPercentage =
      categoryElement.Incertitude !== null
        ? parseFloat(incertNumber) / 100
        : 0; 
    const uncertainty =categoryElement["Total poste non décomposé"] * uncertaintyPercentage * element.quantity;
    totalValueTimesUncertainty += uncertainty;
    
    totalValue += categoryElement["Total poste non décomposé"] * element.quantity;
    
    if (categoryElement.structure === "élément décomposé par gaz" || categoryElement.structure === "élément décomposé par poste et par gaz") {
      //console.log("element décomposé par gaz");
      
        if(categoryElement.CO2){
          CO2 += (categoryElement.CO2 * element.quantity);
          
        }

        if(categoryElement.CH4 ){
          CH4 += (categoryElement.CH4 * element.quantity);
    
        }
        
        if(categoryElement.N2O){
          N2O += (categoryElement.N2O * element.quantity);
       
        }
       
        
        if(categoryElement.CO2f ){

      
          CO2f += (categoryElement.CO2f * element.quantity);
          console.log("CO2f", categoryElement.CO2f, element.quantity, CO2f);
        }
        
      if(categoryElement.CH4f){
        CH4f += (categoryElement.CH4f * element.quantity);
       
      }
      
       if(categoryElement.CH4b){
        CH4b += (categoryElement.CH4b * element.quantity);
       }
       
      //if (i == 1) {CO2 = "NC"}
    }
     
    
    i++;
    
  }

  if (totalValueTimesUncertainty !== 0) {
    const weightedAverageUncertainty = totalValueTimesUncertainty / totalValue;
    
    return { emissions, weightedAverageUncertainty, CO2 ,
      CH4 ,
      N2O ,
      CO2f,
      CH4f,
      CH4b};
  }
  //console.log("Co2", CO2);
  return { emissions, weightedAverageUncertainty: 0, CO2, CH4, N2O,CO2f,
    CH4f,
    CH4b };
};

const calculateWeightedAverageUncertainty = (elements) => {
  let totalValueTimesUncertainty = 0;
  let totalValue = 0;

  for (const element of elements) {
    const value = element.value;
    const uncertainty = element.uncertainty * value;
    totalValueTimesUncertainty += uncertainty;
    totalValue += value;
  }

  const weightedAverageUncertainty = totalValueTimesUncertainty / totalValue;
  return weightedAverageUncertainty;
};

// calculate total Bilan emissions
const calculateTotalBilan = async (emissionPosts) => {
  let totalEmissionsAbs = 0;
  let totalEmissions = 0;
  let totalValueTimesUncertainty = 0;
  for (const post of emissionPosts) {
    totalEmissions += post.emissions;
    totalEmissionsAbs += Math.abs(post.emissions);
    const uncertainty = Math.abs(post.emissions) * post.uncertainty;
    totalValueTimesUncertainty += uncertainty;
  }

  if (totalValueTimesUncertainty !== 0) {
    const totalWeightedAverageUncertainty =
      totalValueTimesUncertainty / totalEmissionsAbs;
    return { totalEmissions, totalWeightedAverageUncertainty };
  }
  return { totalEmissions, totalWeightedAverageUncertainty: 0 };
};

// get a single bilan

const getBilan = async (req, res) => {
  const { clientId, year } = req.params;
  if (!isValidObjectId(clientId)) {
    return res.status(400).json({ msg: "Invalid client ID" });
  }
  try {
    const carbonFootprint = await CarbonFootprint.findOne({ clientId, year });
    if (!carbonFootprint) {
      return res.status(404).json({ msg: "Bilan not found" });
    }
    return res.status(200).json(carbonFootprint);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal error" });
  }
};

// get all bilans

const getAllBilans = async (req, res) => {
  try {
    const clientId = req.clientId;
    const carbonFootprints = await CarbonFootprint.find({ clientId: clientId });
    return res.status(200).json({ carbonFootprints, clientId });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal error" });
  }
};

// delete a bilan

const deleteBilan = async (req, res) => {
  const { clientId, year } = req.params;
  if (!isValidObjectId(clientId)) {
    return res.status(400).json({ msg: "Invalid client ID" });
  }
  try {
    const carbonFootprint = await CarbonFootprint.findOneAndDelete({
      clientId,
      year,
    });
    if (!carbonFootprint) {
      return res.status(404).json({ msg: "Bilan not found" });
    }
    return res.status(200).json({ msg: "Bilan deleted" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal error" });
  }
};

module.exports = {
  createBilan,
  updateAndCalculateBilan,
  getBilan,
  getAllBilans,
  deleteBilan,
};
