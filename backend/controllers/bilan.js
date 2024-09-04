const {CarbonFootprintAdeme,CarbonFootprintAgribalyse} = require("../Models/Bilan");
const {
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
  Produitsagricoles1,
  Produitsagricoles,
  Produitsalimentaires,
  categoriesConnection,
  categoriesConnection2, 
} = require("../Models/Category");
const { unsubscribe } = require("../routes/categoryRoutes");
const { FixedPosteAttributs } = require("../utils/data");
const { isValidObjectId } = require("mongoose");

const createBilan = async (req, res) => {
  const { clientId } = req.body;
  try {
    let postEmissions = [];
    let i = 0;
   
    FixedPosteAttributs.map((att) => {
      const newAtt = {
        ...att,
        emissions: 0,
        categoryElements: [],
      };
      postEmissions[i] = newAtt;
      i++;
    });
    const newCarbonFootprint = db_type=="Ademe"? new CarbonFootprintAdeme({
      clientId,
      emissionPosts: postEmissions,
    }) :  new CarbonFootprintAgribalyse({
      clientId,
      emissionPosts: postEmissions,
    }) ;
    await newCarbonFootprint.save();
    return res.status(200).json(newCarbonFootprint);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal error" });
  }
};

let db_type="ADEME"
// update and calculate bilan
const updateAndCalculateBilan = async (req, res) => {
   
  if (req.params.db_type) {
    db_type = req.params.db_type;
  }
  console.log("db_type",db_type)
  const { year, clientId, selectedCategoryElements } = req.body;
  console.log("req.body = ", req.body);
  console.log("db_type = ", db_type);
  if (!isValidObjectId(clientId)) {
    return res.status(400).json({ msg: "Invalid client ID" });
  }
  
    console.log("db_type",db_type)
  
    const carbonFootprint = db_type=="Ademe"?await CarbonFootprintAdeme.findOne({ clientId, year }): await CarbonFootprintAgribalyse.findOne({ clientId, year }) ;
    console.log("carbonFootprint",carbonFootprint)
    if (!carbonFootprint) {
      return res.status(404).json({ msg: "Bilan not found" });
    }
    for (let i = 0; i < selectedCategoryElements.length; i++) {
      const categoryElements = selectedCategoryElements[i];
      if (categoryElements.length > 0) {
        
       
        console.log("carbonFootprint",carbonFootprint)

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

let CO2 = 0;
  let CH4 = 0;
  let N2O = 0;
  let CO2f= 0;
  let CH4f= 0;
  let CH4b= 0;

//calculate the emissions for a single post Emission
const calculateEmissionsPost = async (category, categoryElements) => {
  let emissions = 0;
  let totalValueTimesUncertainty = 0;
  let totalValue = 0;
  
  let i = 0; 
  let Model;
  console.log("db_type",db_type)

  db_type=="ADEME"?Model = categoriesConnection.model(category): Model = categoriesConnection2.model(category);
  
  for (const [index,element] of categoryElements.entries()) {
     
      console.log("element.categoryElement",element.categoryElement)
    const categoryElement = await Model.findById(element.categoryElement);
    // emissions += categoryElement.totalPostValue * element.quantity;
    let lastvalue=0
    let typeNamefrontiere=""
    
    // if(categoryElement["categories"][0]=="Process et émissions fugitives"){
    try {
      typeNamefrontiere=categoryElement["Nom frontière français"]
      
    } catch (error) {
      try {
        typeNamefrontiere=categoryElement["Nom attribut français"]
      } catch (error) {
        typeNamefrontiere=""
      }
      
     
    }
    
    
     
     
    if(typeNamefrontiere!="ratio de charge"){
       
        for(var ii = 1; ii <categoryElements.length; ii++){
          
        try {

           
          const categoryElementcurrent = await Model.findById(categoryElements[index-ii].categoryElement);
          
          
          if(categoryElementcurrent["Nom frontière français"] == "ratio de charge" || categoryElementcurrent["Nom attribut français"] == "ratio de charge"){

            lastvalue= categoryElements[index-ii].quantity * categoryElementcurrent["Total poste non décomposé"] 
            console.log("calced")
            break;
           } 
          
          
          
        } catch (error) {
          console.log("..")
          lastvalue=0
        }
      }
         
    }
    
    try {
      const incertNumber=categoryElement.Incertitude.replace("%","")
      const uncertaintyPercentage =
        categoryElement.Incertitude !== null
          ? parseFloat(incertNumber) / 100
          : 0; 
    } catch (error) {
      const uncertaintyPercentage =0;
      const incertNumber=0
    }
   
    
    let elemquantity=0;
      let uncertainty=0;
      let thisyear=new Date()
      thisyear=thisyear.getFullYear()
     
      if(db_type=="ADEME"){
        console.log("categoryElement ADEME",categoryElement)
    
      switch (typeNamefrontiere) {
        case "taux de fuite annuel":
          if(!element.quantity){
            element.quantity=thisyear
          }
          elemquantity=(thisyear-element.quantity)
          elemquantity==0?elemquantity=1:elemquantity=elemquantity; 
          uncertainty =(categoryElement["Total poste non décomposé"] * uncertaintyPercentage  );
          emissions += (categoryElement["Total poste non décomposé"]*elemquantity)/100;
          totalValue +=(categoryElement["Total poste non décomposé"]* elemquantity )/100;
          totalValueTimesUncertainty += uncertainty; 
          break;

        case "taux de fuite en fin de vie":
          if(!element.quantity){
            element.quantity=thisyear
          }
          elemquantity=(thisyear-element.quantity)
          elemquantity==0?elemquantity=1:elemquantity=elemquantity; 
          uncertainty =(categoryElement["Total poste non décomposé"] * uncertaintyPercentage  );
          emissions += (categoryElement["Total poste non décomposé"] *elemquantity)/100;
          totalValue += (categoryElement["Total poste non décomposé"]* elemquantity )/100;
          totalValueTimesUncertainty += uncertainty;
          break;
          
        default:
          if(element.type=="evité"){
            if(!element.quantity){
              element.quantity=0
            }
    
            uncertainty =categoryElement["Emissions évitées"] * uncertaintyPercentage * element.quantity;
            emissions += categoryElement["Emissions évitées"] * element.quantity;
            totalValueTimesUncertainty += uncertainty;
            totalValue += categoryElement["Emissions évitées"] * element.quantity;

          }else{
            if(!element.quantity){
              element.quantity=0
            }
    
            uncertainty =categoryElement["Total poste non décomposé"] * uncertaintyPercentage * element.quantity;
            emissions += categoryElement["Total poste non décomposé"] * element.quantity;
            totalValueTimesUncertainty += uncertainty;
            totalValue += categoryElement["Total poste non décomposé"] * element.quantity;
          }
          
          break;
      }
    // }

    
    
    
    
 
    
      if (categoryElement.Structure == "élément décomposé par gaz" || categoryElement.Structure == "élément décomposé par poste et par gaz") {
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
            
          }
        if(categoryElement.CH4f){
          CH4f += (categoryElement.CH4f * element.quantity);
        
        }
        
        if(categoryElement.CH4b){
          CH4b += (categoryElement.CH4b * element.quantity);
        }
        
        //if (i == 1) {CO2 = "NC"}
      }
     
  }else if(db_type=="AGRIBALYSE"){
    const categoryElement = await Model.findById(element.categoryElement);
    try {
      emissions += (categoryElement["kg CO2 eq/kg"]*element.quantity)/100;
      totalValue +=(categoryElement["kg CO2 eq/kg"]* element.quantity )/100;
      console.log("emissions",emissions)
    } catch (error) {
      console.log('category',category)
     Model = categoriesConnection2.model(category);
     emissions += (categoryElement["kg CO2 eq/kg"]*element.quantity)/100;
     totalValue +=(categoryElement["kg CO2 eq/kg"]* element.quantity )/100;
     console.log("emissions",emissions)
    }
  
    console.log("categoryElement agri",categoryElement)
        console.log("element.quantity",element.quantity)
        
        
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
    console.log("selected",selectedCategoryElements)
    const carbonFootprint = db_type=="ADEME"?await CarbonFootprintAdeme.findOne({ clientId, year }):await CarbonFootprintAgribalyse.findOne({ clientId, year });
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
    const carbonFootprints =  db_type=="ADEME"? await CarbonFootprintAdeme.find({ clientId: clientId }):await CarbonFootprintAgribalyse.findOne({ clientId, year });
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
    const carbonFootprint =db_type=="ADEME"?  await CarbonFootprintAdeme.findOneAndDelete({
      clientId,
      year,
    }) :await CarbonFootprintAgribalyse.findOneAndDelete({ clientId, year });
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
