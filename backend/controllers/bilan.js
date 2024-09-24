const {CarbonFootprint} = require("../Models/Bilan");
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
  Produitsagricoles,
  Produitsalimentaires,
  categoriesConnection,
  categoriesConnection2,
  ModelDB, 
} = require("../Models/Category");
const { unsubscribe } = require("../routes/categoryRoutes");
const { FixedPosteAttributs } = require("../utils/data");
const { isValidObjectId, Model } = require("mongoose");




let dataToPush=[]

const createBilan = async (req, res) => {


 
  const modelattrs = await ModelDB.find({});
  modelattrs.map((item) => {
    console.log("steps mapped=> ",item)

    
      console.log("object keys",item.steps)
     
      let y = 1

      item.steps.map((li,x)=>{
         console.log(" item.steps==>", li.list)
     
        
         li.list.map((step,z)=>{

          const CategoryCurrent=step.dialogueOptions[0].value

            if(y !=0){
              y=y+1
            }
            // console.log("y>",y)
            // console.log("x>z>",(x+1)+"."+(z+1+y))
            // const indexCurrent=((y+1)+(2*x))+"."+(z+1)
            const indexCurrent=(x+1)+"."+(z+1+y)
            const PostNameCurrent=step.label
            const Scope= "1"
            dataToPush.push({
              index:indexCurrent,
              category:CategoryCurrent,
              postName:PostNameCurrent,
              Scope: "1",
            })
            console.log("dataToPush=>>",dataToPush)
          })
        

      })

    

  })
  




  const { clientId } = req.body;
  try {
    let postEmissions = [];
    let i = 0;
   
    dataToPush.map((att) => {
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
    })  
    await newCarbonFootprint.save();
    return res.status(200).json(newCarbonFootprint);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal error" });
  }
};

let db_type="ademe"
// update and calculate bilan
const updateAndCalculateBilan = async (req, res) => {
    
  if (req.params.db_type) {
    db_type = req.params.db_type;
  }
  console.log("bb",db_type)
  const { year, clientId, selectedCategoryElements } = req.body;
  console.log("req.body = ", req.body);
  console.log("db_type = ", db_type);
  if (!isValidObjectId(clientId)) {
    return res.status(400).json({ msg: "Invalid client ID" });
  }
  
    console.log("db_type",db_type)
  
    const carbonFootprint = await CarbonFootprint.findOne({ clientId, year });
    // console.log("carbonFootprint",carbonFootprint)
    if (!carbonFootprint) {screenXz
      return res.status(404).json({ msg: "Bilan not found" });
    }
    for (let i = 0; i < selectedCategoryElements.length; i++) {
      console.log("check",selectedCategoryElements)

      const categoryElements = selectedCategoryElements;
       
        console.log("carbonFootprint.emissionPosts[i]",carbonFootprint.emissionPosts[i])
      try {
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
        
        
        } catch (error) {
          console.log("..")
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
  let uncertaintyPercentage =0;
  let emissions = 0;
//calculate the emissions for a single post Emission



const calculateEmissionsPost = async (category, categoryElements) => {
  // console.log("enter function category",category)
  // console.log("enter function categoryElements",categoryElements)
  let emissions = 0;
  let totalValueTimesUncertainty = 0;
  let totalValue = 0;
  
  let i = 0; 
  let Model;
  console.log("db_type b",db_type)

  try {
    Model = categoriesConnection.model(category)
  } catch (error) {
    Model = categoriesConnection2.model(category)
  }
   
  for (const [index,element] of categoryElements.entries()) {
   
     
      // console.log("element.categoryElement",element.categoryElement)

    const categoryElement = await Model.findById(element.categoryElement);
    try {
      const incertNumber=categoryElement.Incertitude.replace("%","")
       uncertaintyPercentage =
        categoryElement.Incertitude !== null
          ? parseFloat(incertNumber) / 100
          : 0; 
    } catch (error) {
       uncertaintyPercentage =0;
      const incertNumber=0
    }
    // console.log("e categoryElement",categoryElement)
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
    
    
     
     
    // if(typeNamefrontiere!="ratio de charge"){
       
    //     for(var ii = 1; ii <categoryElements.length; ii++){
          
    //     try {

           
    //       const categoryElementcurrent = await Model.findById(categoryElements[index-ii].categoryElement);
          
          
    //       if(categoryElementcurrent["Nom frontière français"] == "ratio de charge" || categoryElementcurrent["Nom attribut français"] == "ratio de charge"){

    //         lastvalue= categoryElements[index-ii].quantity * categoryElementcurrent["Total poste non décomposé"] 
    //         console.log("calced")
    //         break;
    //        } 
          
          
          
    //     } catch (error) {
    //       console.log("..")
    //       lastvalue=0
    //     }
    //   }
         
    // }
    
    
   
    
    let elemquantity=0;
      let uncertainty=0;
      let thisyear=new Date()
      thisyear=thisyear.getFullYear()
     
      // if(db_type=="ADEM"){
      //   console.log("categoryElement ADEM",categoryElement)
    
      // switch (typeNamefrontiere) {
      //   case "taux de fuite annuel":
      //     if(!element.quantity){
      //       element.quantity=thisyear
      //     }
      //     elemquantity=(thisyear-element.quantity)
      //     elemquantity==0?elemquantity=1:elemquantity=elemquantity; 
      //     uncertainty =(categoryElement["Total poste non décomposé"] * uncertaintyPercentage  );
      //     emissions += (categoryElement["Total poste non décomposé"]*elemquantity)/100;
      //     totalValue +=(categoryElement["Total poste non décomposé"]* elemquantity )/100;
      //     totalValueTimesUncertainty += uncertainty; 
      //     break;

      //   case "taux de fuite en fin de vie":
      //     if(!element.quantity){
      //       element.quantity=thisyear
      //     }
      //     elemquantity=(thisyear-element.quantity)
      //     elemquantity==0?elemquantity=1:elemquantity=elemquantity; 
      //     uncertainty =(categoryElement["Total poste non décomposé"] * uncertaintyPercentage  );
      //     emissions += (categoryElement["Total poste non décomposé"] *elemquantity)/100;
      //     totalValue += (categoryElement["Total poste non décomposé"]* elemquantity )/100;
      //     totalValueTimesUncertainty += uncertainty;
      //     break;
          
      //   default:
      //     if(element.type=="evité"){
      //       if(!element.quantity){
      //         element.quantity=0
      //       }
      //       let emsevt=0
      //       if(categoryElement["Emissions évitées"]){
      //         emsevt=categoryElement["Emissions évitées"]
      //       }
    
      //       uncertainty =emsevt * uncertaintyPercentage * element.quantity;
      //       emissions += emsevt* element.quantity;
      //       totalValueTimesUncertainty += uncertainty;
      //       totalValue += emsevt * element.quantity;

      //     }else{
      //       if(!element.quantity){
      //         element.quantity=0
      //       }
    
      //       uncertainty =categoryElement["Total poste non décomposé"] * uncertaintyPercentage * element.quantity;
      //       emissions += categoryElement["Total poste non décomposé"] * element.quantity;
      //       totalValueTimesUncertainty += uncertainty;
      //       totalValue += categoryElement["Total poste non décomposé"] * element.quantity;
      //     }
          
      //     break;
      // }
    // }

    
  
      
      console.log("element",element)
      // emissions += (categoryElement["Total poste non décomposé"]*element.quantity)/100;
      // totalValue +=(categoryElement["Total poste non décomposé"]* element.quantity )/100;
     
    
      const modeldb=await ModelDB.findOne({dbName:db_type})
 
      const equation=modeldb.methode[element.sheetName]
      const cleanedEquation = equation.filter(item => item !== '');

      const expression = cleanedEquation.map(item => {
        if (item === 'quantity') {
          return element.quantity; // Replace 'quantity' with element.quantity
        } else if (categoryElement[item] !== undefined) {
          return categoryElement[item]; // Replace other variables with values from categoryElement
        }
        return item; // Keep operators as is (*, +, etc.)
      }).join(' ');
      
      if (true) {

        const result = eval(expression); // Be cautious with eval()
        console.log('Result:', result); // Should print: 50 (5 * 10)
        emissions+=result
        totalValue+=result
      } else{
        console.error('Error evaluating expression:', error);
      }
    
      // if (categoryElement.Structure == "élément décomposé par gaz" || categoryElement.Structure == "élément décomposé par poste et par gaz") {
      //   //console.log("element décomposé par gaz");
        
      //     if(categoryElement.CO2){
      //       CO2 += (categoryElement.CO2 * element.quantity);
            
      //     }

      //     if(categoryElement.CH4 ){
      //       CH4 += (categoryElement.CH4 * element.quantity);
      
      //     }
          
      //     if(categoryElement.N2O){
      //       N2O += (categoryElement.N2O * element.quantity);
        
      //     }
        
          
      //     if(categoryElement.CO2f ){

        
      //       CO2f += (categoryElement.CO2f * element.quantity);
            
      //     }
      //   if(categoryElement.CH4f){
      //     CH4f += (categoryElement.CH4f * element.quantity);
        
      //   }
        
      //   if(categoryElement.CH4b){
      //     CH4b += (categoryElement.CH4b * element.quantity);
      //   }
        
      //   //if (i == 1) {CO2 = "NC"}
      // }
     
  // }else if(db_type=="AGRIBALYSE"){
  //   Model = categoriesConnection2.model(category)

  //   const categoryElement = await Model.findById(element.categoryElement);
  
  //     emissions += (categoryElement["Total poste non décomposé"]*element.quantity)/100;
  //     totalValue +=(categoryElement["Total poste non décomposé"]* element.quantity )/100;
  //     console.log("emissions",emissions)
    
  
  //   console.log("categoryElement agri",categoryElement)
  //       console.log("element.quantity",element.quantity)
        
        
  // }
    
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
    const carbonFootprint = await CarbonFootprint.findOne({ clientId, year })
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
    const carbonFootprints =await CarbonFootprint.find({ clientId: clientId })
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
    })  
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
