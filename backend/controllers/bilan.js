const {CarbonFootprint} = require("../Models/Bilan");
const {
  AchatsDeBiens,
  AchatsDeServices,
  Combustibles,
  ProcessEtEmissionsFugitives,
  Electricite,
  ElectriciteParPays,
  ReseauxDeChaleurEtFroid,
  StatistiquesTerritoriales,
  TraitementDesDechets,
  TransportDeMarchandises,
  TransportDePersonnes,
  UTCF,
  ProduitsAgricoles,
  ProduitsAlimentaires,
  categoriesConnection,
  categoriesConnection2,
  ModelDB, 
} = require("../Models/Category");
const { unsubscribe } = require("../routes/categoryRoutes");
const { FixedPosteAttributs } = require("../utils/data");
const { isValidObjectId, Model } = require("mongoose");



function capitalizeAndRemoveSpaces(str) {
  return str
      .split(' ')  // Split the string into words by space
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())  // Capitalize each word
      .join('')  // Join the words back together without spaces
      .replace(/\s+/g, '');  // Ensure no spaces are left
}


let dataToPush=[]

const createBilan = async (req, res) => {
  let scope1=0,scope2=0,scope3=0;

 
  const modelattrs = await ModelDB.find({});
  modelattrs.map((item) => {
    console.log("steps mapped=> ",item)

      console.log("object keys",item.steps)

      let y = 1

      item.steps.map((li,x)=>{
         console.log(" item.steps==>", li.list)
     
        
         li.list.map(async(step,z)=>{

          const CategoryCurrent=step.dialogueOptions[0].value
          let word=CategoryCurrent
          console.log("word-->",word)
          word = word.replace(/É/g, "E");
          word = word.replace(/é/g, "e");
          word=capitalizeAndRemoveSpaces(word)
          
          console.log("word-->",word)
          if(CategoryCurrent=="UTCF"){
            word=CategoryCurrent
            
          }
          console.log("word-->",word)
          let valval;
          try {
            valval = await categoriesConnection.model(word).aggregate([{ $sample: { size: 1 } }]);
          
            
          } catch (error) {
            valval = await categoriesConnection2.model(word).aggregate([{ $sample: { size: 1 } }]);
          
          }
          
          let scopeVal= valval[0].scope

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
              scope: scopeVal,
              scope1:scope1,
              scope2:scope2,
              scope3:scope3
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
      console.log("data to push map-->>")
      const newAtt = {
        ...att,
        emissions: 0,
        categoryElements: [],
      };
      console.log("****newAtt",newAtt)
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
  console.log("----start : updateAndCalculateBilan")
    
  if (req.params.db_type) {
    db_type = req.params.db_type;
  }
  console.log("bb",db_type)
  const { year, clientId, selectedCategoryElements } = req.body;
  console.log("req.clientId---> = ", clientId);
  console.log("year = ", year);
  if (!isValidObjectId(clientId)) {
    return res.status(400).json({ msg: "Invalid client ID" });
  }
  
  
    const carbonFootprint = await CarbonFootprint.findOne({ clientId, year });
    // console.log("carbonFootprint",carbonFootprint)
    if (!carbonFootprint) {
      return res.status(404).json({ msg: "Bilan not found" });
    }
    for (let i = 0; i < selectedCategoryElements.length; i++) {
      console.log("check selectedCategoryElements",selectedCategoryElements)
      carbonFootprint.emissionPosts = dataToPush;
       
      const categoryElements = selectedCategoryElements;
      console.log("i->",i)
      console.log("carbonFootprint->",carbonFootprint)
       
        
        if (carbonFootprint.emissionPosts && i >= 0 && i < carbonFootprint.emissionPosts.length) {
          console.log("Valid index:", carbonFootprint.emissionPosts[i]);
      } else {
          console.log(`Index ${i} is out of bounds or emissionPosts is empty.`);
      }

      console.log(carbonFootprint.emissionPosts[i].category,categoryElements)
      
      if(true) {
        console.log("carbonFootprint.emissionPosts------",carbonFootprint.emissionPosts)
        const { emissions, weightedAverageUncertainty,scope1,scope2,scope3, CO2 ,CH4 , N2O ,CO2f,CH4f,CH4b } =await calculateEmissionsPost(carbonFootprint.emissionPosts[i].category,categoryElements);
        
        
        carbonFootprint.scope1 +=scope1;
        carbonFootprint.scope2 +=scope2;
        carbonFootprint.scope3 +=scope3;

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
        
        
        }else{
          console.log("..")
        }
        
       
      

    }

    console.log("carbonFootprint.emissionPosts++++",carbonFootprint.emissionPosts)

    const { totalEmissions, totalWeightedAverageUncertainty } =await calculateTotalBilan(carbonFootprint.emissionPosts);


    console.log("emissions",emissions)
    console.log("totalEmissions",totalEmissions)

    
    carbonFootprint.totalEmissions += totalEmissions;
    carbonFootprint.totalUncertainty += totalWeightedAverageUncertainty;
    await carbonFootprint.save();
    console.log("---end updateAndCalculateBilan")
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
 

const calculateEmissionsPost = async (category, categoryElements) => {
  
  let scope1=0,scope2=0,scope3=0;
  let emissions = 0;
  let totalValueTimesUncertainty = 0;
  let totalValue = 0;
  let i = 0; 
  let Model;
  let scope=1;
  console.log("start---- calculateEmissionsPost")

 
  console.log("---- calculateEmissionsPost")
   
  for (const [index,element] of categoryElements.entries()) {
    category=element.sheetName
    if(element.sheetName!="UTCF"){
      category=capitalizeAndRemoveSpaces(element.sheetName);
      category = category.replace(/É/g, "E");
      category = category.replace(/é/g, "e");
    }

    try {
      Model = categoriesConnection.model(category)
    } catch (error) {
      Model = categoriesConnection2.model(category)
    }
   
    console.log("element---- ",element)
    const categoryElement = await Model.findById(element.categoryElement);
    console.log("categoryElement---- ",categoryElement)
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
    let lastvalue=0
    let typeNamefrontiere=""
   
    
    try {
      typeNamefrontiere=categoryElement["Nom frontière français"]
      scope=categoryElement["scope"]
      
    } catch (error) {
      try {
        typeNamefrontiere=categoryElement["Nom attribut français"]
        scope=categoryElement["scope"]
      } catch (error) {
        typeNamefrontiere=""
      }
      
     
    }
   
  
    let elemquantity=0;
      let uncertainty=0;
      let thisyear=new Date()
      thisyear=thisyear.getFullYear()
     
      const modeldb=await ModelDB.findOne({dbName:db_type})
 
      const equation=modeldb.methode[element.sheetName.replace(/É/g, "E")]
      console.log("modeldb.methode",modeldb.methode)
      console.log("element.sheetName",element.sheetName)
      const cleanedEquation = equation.filter(item => item !== '');

      
      const expression = cleanedEquation.map(item => {
        console.log("item",item)
        console.log("categoryElement is : ",categoryElement)
        
      console.log("categoryElement[item]",categoryElement[item])
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
        console.log("scope",scope)
        switch (scope) {
          case 1:
            console.log("1111111111 scope")
            scope1 += result
            break;
    
          case 2:
            console.log("2222222222 scope")
            scope2 += result
            break;
    
          case 3:
            console.log("3333333333 scope")
            scope3 += result
            break;
        
          default:
            break;
        }
        console.log("scope1-->",scope1)
        console.log("scope2 ->",scope2)
        console.log("scope3-->",scope3)
        emissions+=result
        totalValue+=result
      } else{
        console.error('Error evaluating expression:', error);
      }
    
    i++;
   
  }
   

  console.log("end---- calculateEmissionsPost")
  if (totalValueTimesUncertainty !== 0) {
    const weightedAverageUncertainty = totalValueTimesUncertainty / totalValue;
    
    return { emissions, weightedAverageUncertainty,
      scope1,scope2,scope3,
       CO2 ,
      CH4 ,
      N2O ,
      CO2f,
      CH4f,
      CH4b};
  } 
  return { emissions, weightedAverageUncertainty: 0,scope1,scope2,scope3, CO2, CH4, N2O,CO2f,
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
    console.log("scope-->",element.scope)
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
  console.log("reooo")
  const { clientId, year } = req.params;
  console.log("Client ID:", clientId);
  if (!isValidObjectId(clientId)) {
    return res.status(400).json({ msg: "Invalid client ID" });
  }

  try {
    console.log("Querying with:", { clientId, year });
    const carbonFootprint = await CarbonFootprint.findOne({ clientId, year });
    if (!carbonFootprint) {
      console.log("Bilan not found");
      return res.status(404).json({ msg: "Bilan not found" });
    }
    return res.status(200).json(carbonFootprint);
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ error: "Internal error" });
  }
  
};

// get all bilans

const getAllBilans = async (req, res) => {
  try {
    const clientId = req.clientId;
    const carbonFootprints =await CarbonFootprint.find({})
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