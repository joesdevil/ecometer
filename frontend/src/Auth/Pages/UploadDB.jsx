import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {  CircularProgress } from "@mui/material";
import {
  Grid,
  Typography,
  Paper,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import AppBarComponent from "../Components/AppBarComponent";
import EmissionsDirectes from "../Components/EmissionsDirectes";
import Alimentaire from "../Components/AGRIBALYSE/Alimentaire";
import Deplacement from "../Components/Deplacement";
import Energie from "../Components/Energie";
import ProduitsVendu from "../Components/ProduitsVendus";
import ProduitsAchetes from "../Components/ProduitsAchetes";
import AutresEmissions from "../Components/AutresEmissions";
import SideBar from "../Components/SideBar";
import CustomStepConnector from "./CustomStepConnector";
import ColorlibStepIcon from "./ColorlibStepIcon";
import Bilan from "../Components/Bilan";
import { toast } from 'react-toastify';



const steps =[
    
  { label: "Display & name", icon: 8, backgroundColor: "#C1CDE0" },
   { label: "Method calculation", icon: 7, backgroundColor: "#C1CDE0" },
   { label: "Steps", icon: 9, backgroundColor: "#C1CDE0" },
    
  ]


const Styles = {
  titreEtape: {
    color: "#003049",
    fontWeight: 700,
    fontSize: "30px",
    fontFamily: "Inter, sans-serif",
    lineHeight: "47px",
  },

  contenuEtape: {
    fontSize: "18px",
    fontWeight: 400,
    lineHeight: "24px",
    textAlign: "left",
    color: "#003049",
  },
  ajouterActiviteButton: {
    width: "150px",
    height: "32px",
    gap: "0px",
    borderRadius: "10px 10px 10px 10px",
    border: "1px solid #003049",
    background: "#FFFFFF",
    color: "#003049",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "16px",
    textAlign: "center",
  },
  suivantButton: {
    color: "#FFFFFF",
    background: "#003049",
    fontFamily: "Inter, sans-serif",
    width: "121px",
    height: "48px",
    padding: "14px 32px",
    gap: "10px",
    borderRadius: "15px",
  },
  backButton: {
    color: "#FFFFFF",
    background: "#003049",
    fontFamily: "Inter, sans-serif",
    width: "121px",
    height: "48px",
    padding: "14px 32px",
    gap: "10px",
    borderRadius: "15px",
  },
  buttonText: {
    fontFamily: "Inter, sans-serif",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "20px",
    textAlign: "center",
    color: "#FFFFFF",
  },
};

 
const id = localStorage.getItem("last_uploaded_db_id")

function Calculateur() {


  const [sheetsInfos, setSheetsInfos] = useState({
    headers: {}, // Placeholder for headers
    steps: [
      {
        label: '',  // Initial default step with an empty label
        list: [],   // Empty list ready for list items to be added
      },
    ],
  });

  const [showBilan, setShowBilan] = useState(false);
  
  useEffect(() => {

    const id = localStorage.getItem("last_uploaded_db_id")
    
    const fetchHeaders = async () => {
      try {
        // Replace with your API endpoint
        const response = await axios.get(`http://localhost:3000/api/ModelDB/model/get_by_id/${id}` );
        console.log("ss",response.data)
        setSheetsInfos(response.data); 
        
      } catch (err) {
        console.log('Failed to fetch headers');
      } finally {
        setLoading(false);
      }
    };

    // Call the function
    fetchHeaders();
     
  }, []);
 
  const [emissionsList, setEmissionsList] = useState([
   
    {
      label: "Model DB",
      dialogueOptions: [{ label: "ModelDB", value: 1 }],
      selectedOptions: [],
    },
 
  ]);

  const token = localStorage.getItem("token");
 
  const finishModel = async ()=>{

    console.log("sheetingos",sheetsInfos)
   

    

  

    const headers = {
      Authorization: `Bearer ${token}`,
    };
 
    
     
    
    const url = `http://localhost:3000/api/ModelDB/model/update/${id}`;
     
    try {
      const response = await axios.put(url, sheetsInfos, { headers: headers });
      
      console.log("response", response);
    } catch (error) {
      console.error("Error:", error);
    }
    

  }
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const navigate = useNavigate();
 
  function allArraysEmpty(arrays) {
    return arrays.every(array => array.length === 0);
}

 
  const selectedDB= localStorage.getItem("db_type") 
  const handleReset = async () => {
    console.log("ss")
  }
  
  const [loading, setLoading] = useState(false);

 

  const handleDbNameChange = (e) => {
    setSheetsInfos({
      ...sheetsInfos,
      dbName: e.target.value
    });
  };

  const handleCheckboxChange = (e, sheetName) => {
    const { name, checked } = e.target;
  
    setSheetsInfos(prevState => {
      const selectedHeaders = { ...prevState.selectedHeaders };
      const display = { ...prevState.display }; // Copy current display
  
      if (!selectedHeaders[sheetName]) {
        selectedHeaders[sheetName] = [];
      }
  
      if (checked) {
        if (!selectedHeaders[sheetName].includes(name)) {
          selectedHeaders[sheetName].push(name);
        }
        // Update display for the checked header
        display[sheetName] = display[sheetName] || {};
        display[sheetName][name] = true; // Assuming you want to set it to true
      } else {
        selectedHeaders[sheetName] = selectedHeaders[sheetName].filter(header => header !== name);
        // Remove from display when unchecked
        if (display[sheetName]) {
          delete display[sheetName][name];
        }
      }
      console.log("jk",sheetsInfos)
      return { ...prevState, selectedHeaders, display };
    });
  };
  
  

  
  const handleButtonClick = () => {
    const id= localStorage.getItem("last_uploaded_db_id");
    
    
  };

  const [activeSheet, setActiveSheet] = useState(null);
  const [expressions, setExpressions] = useState({});
 
  const handleItemClick = (header) => {
    setExpressions((prevExpressions) => ({
      ...prevExpressions,
      [activeSheet]: [...(prevExpressions[activeSheet] || []), header],
    }));
    setSheetsInfos({
      ...sheetsInfos,
      "methode": expressions
    });
  };

  const handleOperation = (op) => {
    setExpressions((prevExpressions) => ({
      ...prevExpressions,
      [activeSheet]: [...(prevExpressions[activeSheet] || []), op],
    }));

    setSheetsInfos({
      ...sheetsInfos,
      "methode": expressions
    });

  };

  const handleParenthesis = (parenthesis) => {
    setExpressions((prevExpressions) => ({
      ...prevExpressions,
      [activeSheet]: [...(prevExpressions[activeSheet] || []), parenthesis],
    }));

   
    setSheetsInfos({
      ...sheetsInfos,
      "methode": expressions
    });
  };

  const handleButtonClick1 = (event, header) => {
    event.preventDefault(); // Prevents the default form submission behavior
    handleItemClick(header); // Calls your custom function
  };

  const handleSheetSelect = (sheetName) => {
    setActiveSheet(sheetName);
  };

  const handleDelete = () => {
    setExpressions((prevExpressions) => {
      const currentExpression = prevExpressions[activeSheet] || [];
      if (currentExpression.length === 0) return prevExpressions; // No elements to delete

      // Remove the last element
      const updatedExpression = currentExpression.slice(0, -1);


      setSheetsInfos({
        ...sheetsInfos,
        "methode": updatedExpression
      });

      return {
        ...prevExpressions,
        [activeSheet]: updatedExpression,
      };
    });
  };
  
  const [sheetSteps, setSheetSteps] = useState({});

  // Function to add a new step with a label and an empty list for a given sheetName
  const handleAddStep = () => {
  console.log("Current sheetsInfos:", sheetsInfos); // Log current state for debugging

  setSheetsInfos((prevState) => ({
    ...prevState,
    steps: [
      ...(prevState.steps || []), // Ensure steps array exists and spread its current value
      {
        label: '', // Add a new step with empty label
        list: [],  // Add a new step with an empty list
      },
    ],
  }));

  console.log("Updated sheetsInfos:", sheetsInfos); // Log the updated state for debugging
};

  
  
  // Function to add a new object to the list in a specific step
  const handleAddListItem = (stepIndex) => {
    setSheetsInfos((prevState) => {
      const updatedSteps = [...prevState.steps]; // Copy steps
  
      // Ensure list is initialized
      if (!updatedSteps[stepIndex].list) {
        updatedSteps[stepIndex].list = [];
      }
  
      // Add a new item to the list
      updatedSteps[stepIndex].list.push({
        label: '', // Empty label for the new item
        ind: updatedSteps[stepIndex].list.length, // Index for the new item
        dialogueOptions: [{ label: '', value: '' }], // Initialize dialogueOptions
        selectedOptions: [], // Empty selected options
      });
  
      // Return updated state
      return {
        ...prevState,
        steps: updatedSteps,
      };
    });
  };
  
 
  // Function to handle changes to the step label
  const handleStepLabelChange = (stepIndex, value) => {
    setSheetsInfos((prevState) => ({
      ...prevState,
      steps: (prevState.steps || []).map((step, index) => {
        if (index === stepIndex) {
          return { ...step, label: value };
        }
        return step;
      }),
    }));
  };

  // Function to handle changes to the list item's label
  const handleListItemLabelChange = (stepIndex, itemIndex, value) => {
    setSheetsInfos((prevState) => ({
      ...prevState,
      steps: (prevState.steps || []).map((step, sIdx) => {
        if (sIdx === stepIndex) {
          return {
            ...step,
            list: step.list.map((item, iIdx) => {
              if (iIdx === itemIndex) {
                return { ...item, label: value };
              }
              return item;
            }),
          };
        }
        return step;
      }),
    }));
  };
  // Function to handle changes to the selected options
  const handleSelectedOptionsChange = (stepIndex, itemIndex, value) => {
    setSheetsInfos((prevState) => ({
      ...prevState,
      steps: (prevState.steps || []).map((step, sIdx) => {
        if (sIdx === stepIndex) {
          return {
            ...step,
            list: step.list.map((item, iIdx) => {
              if (iIdx === itemIndex) {
                return {
                  ...item,
                  dialogueOptions: [{ label: value, value: value }],
                };
              }
              return item;
            }),
          };
        }
        return step;
      }),
    }));
  };
  return (
    <Grid container>
      <Grid
        item
        md={2.1}
        sx={{ minHeight: "100vh", display: { xs: "none", md: "block" } }}
      >
        <SideBar />
      </Grid>
      <Grid item md={9.9} xs={12}>
        <Grid container height={"auto"}>
          <Grid
            item
            height={"64px"}
            xs={12}
            sx={{ fontFamily: "Inter, sans-serif" }}
          >
            <AppBarComponent title="Upload Data base" />
          </Grid>
          {showBilan && (
            <Grid
              item
              height={"auto"}
              xs={12}
              sx={{
                background: "#F2F4F8",
                minHeight: "calc(100vh - 64px)",
                fontFamily: "Inter, sans-serif",
              }}
            >
            <Grid container justifyContent={"center"} marginTop={"70px"}>
                <Grid item xs={12} md={9.77}>
                  <Paper
                    elevation={3}
                    sx={{ minHeight: "fit-content", borderRadius: "15px" }}
                  >
                    <Grid
                      container
                      rowSpacing={0}
                      justifyContent="center"
                      sx={{ minHeight: "100%", p: 2 }}
                    >
                      <Grid item xs={12} md={10}>
                        <Typography
                          variant="h5"
                          align="center"
                          gutterBottom
                          style={Styles.titreEtape}
                        >
                          {steps[activeStep].label}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={10} sx={{ marginTop: "30px" }}>
                        <Stepper
                          activeStep={activeStep}
                          alternativeLabel
                          connector={<CustomStepConnector />}
                        >
                          {steps.map((step, index) => (
                            <Step key={index}>
                              <StepLabel
                                StepIconComponent={ColorlibStepIcon}
                                sx={{ color: "#C92C39" }}
                                icon={step.icon}
                              ></StepLabel>
                            </Step>
                          ))}
                        </Stepper>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={10}
                        sx={{
                          marginTop: "30px",
                          maxHeight: "330px",
                          overflowY: "auto",
                          "&::-webkit-scrollbar": {
                            width: "7px",
                            height: "93px",
                            borderRadius: "4px",
                            backgroundColor: "#C1C1C1",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            background: "#C1C1C1",
                            borderRadius: "4px",
                          },
                          "&::-moz-scrollbar": {
                            width: "7px",
                            height: "93px",
                            borderRadius: "4px",
                            backgroundColor: "#C1C1C1",
                          },
                          "&::-moz-scrollbar-thumb": {
                            background: "#C1C1C1",
                            borderRadius: "4px",
                          },
                          scrollbarWidth: "thin",
                        }}
                      >
                         
                         {activeStep === 0 && (
                            <div>
                              <input
                                className="text-[2.6vh] border font-sans outline-none focus:border-none focus:outline-none"
                                type="text"
                                name="dbName"
                                
                                placeholder="name db"
                                value={sheetsInfos.dbName}
                                onChange={handleDbNameChange}
                                required
                              />

{sheetsInfos && sheetsInfos.headers && Object.keys(sheetsInfos.headers).length > 0 && (
  <div>
    <h1>Sheet Headers</h1>
    {Object.entries(sheetsInfos.headers).map(([sheetName, headers]) => (
      <div key={sheetName}>
        <h2>{sheetName}</h2>
        {headers && headers.length > 0 ? (
          <form>
            {headers.map((header, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  id={`${sheetName}-${index}`}
                  name={header}
                  onChange={(e) => handleCheckboxChange(e, sheetName)}
                />
                <label htmlFor={`${sheetName}-${index}`}>{header}</label>
              </div>
            ))}
          </form>
        ) : (
          <p>No headers available for this sheet</p>
        )}
      </div>
    ))}
  </div>
)}

                            </div>
                          )}

{activeStep === 1 && (
    <>
    {Object.keys(sheetsInfos.headers).length > 0 && (
      <>
        <h1>Sheet Headers</h1>
        {Object.entries(sheetsInfos.headers).map(([sheetName, headers]) => (
          <div key={sheetName}>
            <h2 style={{fontSize:20+"px"}}>
              <button onClick={() => handleSheetSelect(sheetName)}>
                {sheetName}
              </button>
            </h2>
            {sheetName === activeSheet && headers && headers.length > 0 ? (
              <>
                <form>
                <button
                      className="border ml-2 mb-1"
                      style={{ minWidth: '50px', padding: 5 }}
                      key={"quantity"} // Use header if it's unique
                      onClick={(event) => handleButtonClick1(event, "quantity")}
                    >
                     quantity
                    </button>
                  {headers.map((header) => (
                    <button
                      className="border ml-2 mb-1"
                      style={{ minWidth: '50px', padding: 5 }}
                      key={header} // Use header if it's unique
                      onClick={(event) => handleButtonClick1(event, header)}
                    >
                      {header}
                    </button>
                  ))}
                </form>
                <div className="mt-3">
                  <button
                    className="border ml-2"
                    style={{ minWidth: '50px', padding: 5 }}
                    onClick={() => handleOperation('+')}
                  >
                    +
                  </button>
                  <button
                    className="border ml-2"
                    style={{ minWidth: '50px', padding: 5 }}
                    onClick={() => handleOperation('-')}
                  >
                    -
                  </button>
                  <button
                    className="border ml-2"
                    style={{ minWidth: '50px', padding: 5 }}
                    onClick={() => handleOperation('*')}
                  >
                    *
                  </button>
                  <button
                    className="border ml-2"
                    style={{ minWidth: '50px', padding: 5 }}
                    onClick={() => handleOperation('/')}
                  >
                    /
                  </button>
                  <button
                    className="border ml-2"
                    style={{ minWidth: '50px', padding: 5 }}
                    onClick={() => handleParenthesis('(')}
                  >
                    (
                  </button>
                  <button
                    className="border ml-2"
                    style={{ minWidth: '50px', padding: 5 }}
                    onClick={() => handleParenthesis(')')}
                  >
                    )
                  </button>
                  <button
                    className="border ml-2"
                    style={{ minWidth: '50px',minHeight:20, padding: 5 }}
                    onClick={() => handleParenthesis('')}
                  >
                    entrer
                  </button>
                  <button
                    className="border ml-2 "
                    style={{ minWidth: '50px', padding: 5,background:"#f00" }}
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
                <div className="border mt-4 mb-4">
                  <h3 >Expression for {sheetName}:</h3>
                  <p>{(expressions[sheetName] || []).join(' ')}</p>
                </div>
              </>
            ) : sheetName === activeSheet ? (
              <p>No headers available for this sheet</p>
            ) : null}
          </div>
        ))}
      </>
    )}
  </>
)}

{activeStep === 2 && (
                      <div>
                      {Object.keys(sheetsInfos.headers).length > 0 && (
                        <div>
                          <div>
                            <h2>Steps</h2>
                    
                            {sheetsInfos.steps?.map((step, stepIndex) => {
                              console.log("atn", sheetsInfos.steps);
                              return (
                                <div key={stepIndex}>
                                  <h3>Step {stepIndex + 1}</h3>
                    
                                  {/* Step Label Input */}
                                  <input
                                    className="text-[2.6vh] border font-sans outline-none focus:border-none focus:outline-none"
                                    type="text"
                                    name="stepLabel"
                                    placeholder="Step Label"
                                    value={step.label}
                                    onChange={(e) => handleStepLabelChange(stepIndex, e.target.value)}
                                    required
                                  />
                    
                                  {/* Render list items for this step */}
                                  {step.list && step.list.length > 0 ? (
                                    step.list.map((listItem, itemIndex) => {
                                      console.log("listItem", listItem);
                                      return (
                                        <div key={itemIndex}>
                                          <h4>List Item {itemIndex + 1}</h4>
                    
                                          {/* Input for List Item Label */}
                                          <input
                                            className="text-[2.6vh] border font-sans outline-none focus:border-none focus:outline-none"
                                            type="text"
                                            name="listItemLabel"
                                            placeholder="List Item Label"
                                            value={listItem.label}
                                            onChange={(e) =>
                                              handleListItemLabelChange(stepIndex, itemIndex, e.target.value)
                                            }
                                            required
                                          />
                    
                                          {/* Display dialogue options */}
                                          <p>Dialogue Option:</p>
                                          <select
                                            value={listItem.dialogueOptions?.[0]?.value ?? ""}
                                            onChange={(e) =>
                                              handleSelectedOptionsChange(stepIndex, itemIndex, e.target.value)
                                            }
                                          >
                                            <option value="">Select an option</option>
                                            {Object.entries(sheetsInfos.headers).map(([sheetName1]) => (
                                              <option key={sheetName1} value={sheetName1}>
                                                {sheetName1}
                                              </option>
                                            ))}
                                          </select>
                    
                                          {/* Render selected options */}
                                          <div>
                                            <h4>Selected Options:</h4>
                                            {listItem.selectedOptions?.length > 0 ? (
                                              listItem.selectedOptions.map((opt, idx) => <p key={idx}>{opt}</p>)
                                            ) : (
                                              <p>No options selected yet</p>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <p>No list items yet</p>
                                  )}
                    
                                  {/* Button to add a new list item within this step */}
                                  <button type="button" onClick={() => handleAddListItem(stepIndex)}>
                                    Add List Item
                                  </button>
                                </div>
                              );
                            })}
                    
                            {/* Button to add a new step */}
                            <button type="button" onClick={handleAddStep}>
                              Add Step
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                     
                          )}

                          
                        
                     
                       </Grid>

                      <Grid item xs={12} md={10} sx={{ marginTop: "30px" }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            pt: 2,
                          }}
                        >
                          <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            style={Styles.backButton}
                          >
                            <Typography style={Styles.buttonText}>
                              Retour
                            </Typography>
                          </Button>
                          
              {loading && <CircularProgress />}
             

                        <Button
                            onClick={
                              activeStep === steps.length - 1
                                ? finishModel
                                : handleNext
                            }
                            style={Styles.suivantButton}
                          >
                            <Typography style={Styles.buttonText}>
                              {activeStep === steps.length - 1
                                ? "finir"
                                : "Suivant"}
                            </Typography>
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          )}
          {!showBilan && (
            <Grid
              item
              height={"auto"}
              xs={12}
              sx={{
                background: "#F2F4F8",
                minHeight: "calc(100vh - 64px)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              <Grid container justifyContent={"center"} marginTop={"70px"}>
                <Grid item xs={12} md={9.77}>
                  <Bilan   onButtonClick={handleButtonClick} showBilan={showBilan} setShowBilan={setShowBilan} showUpload={true}/>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Calculateur;
