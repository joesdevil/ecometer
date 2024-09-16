import { useState,useEffect } from "react";
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
import AppBarComponent from ".././Components/AppBarComponent";
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

function Calculateur() {



 

  const [dbs_type1,setDbs_type1]=useState([])
  const [dbs_type1List,setDbs_type1List]=useState([])
  const [steps,setSteps]=useState([])
  useEffect(() => {
    // Define the async function to fetch data
    const fetchHeaders = async () => {
      try {
        // Replace with your API endpoint
        const name=localStorage.getItem("db_type")
        const response = await axios.get(`http://localhost:3000/api/ModelDB/model/get_by_name/${name}` );
        console.log("sleected000",Object.values(response.data.steps)[0])
        const transformedDbType = Object.values(response.data.steps)[0].map((hmm) => ({
          label: hmm.label,
        }));
  
       
        console.log("transformedDbType",Object.values(response.data.steps))
        setDbs_type1(Object.values(response.data.steps)); 
        setSteps(transformedDbType); 
        
      } catch (err) {
        console.log('Failed to fetch headers');
      } finally {
        setLoading(false);
      }
    };

    // Call the function
    fetchHeaders();
     
  }, []);


  const [showBilan, setShowBilan] = useState(false);
  const [emissionsListAgribalyse,setEmissionsListAgribalyse]=useState([
    {
      label: "émissions de produits alimentaire",
      dialogueOptions: [{ label: "Produits alimentaires", value: 1 }],
      selectedOptions: [],
    },
    {
      label: "émissions de produits agricoles",
      dialogueOptions: [{ label: "Produits Agricoles", value: 1 }],
      selectedOptions: [],
    },
  ])
  const [emissionsList, setEmissionsList] = useState([
   
    {
      label: "émissions directes des sources fixes de combustion",
      dialogueOptions: [{ label: "Combustibles", value: 1 }],
      selectedOptions: [],
    },
    {
      label: "émissions directes des sources mobiles de combustion",
      dialogueOptions: [{ label: "Combustibles", value: 1 }],
      selectedOptions: [],
    },
    {
      label: "émissions directes des procédés hors énergie",
      dialogueOptions: [{ label: "Process et émissions fugitives", value: 1 }],
      selectedOptions: [],
    },
    {
      label: "émissions directes fugitives",
      dialogueOptions: [{ label: "Process et émissions fugitives", value: 1 }],
      selectedOptions: [],
    },
    {
      label: "émission issues de la biomasse (sols et forêts)",
      dialogueOptions: [{ label: "UTCF", value: 1 }],
      selectedOptions: [],
    },
  ]);
  const [energieList, setEnergieList] = useState([
    {
      label: "Émissions indirectes liées à la consommation d'électricité",
      dialogueOptions: [{ label: "Electricité", value: 1 }],
      selectedOptions: [],
    },
    {
      label:
        "Émissions indirectes liées à la consommation d'énergie autre que l'électricité",
      dialogueOptions: [{ label: "Réseau de chaleur et de froid", value: 1 }],
      selectedOptions: [],
    },
  ]);
  const [deplacementList, setDeplacementList] = useState([
    {
      label: "Transport de marchandise amont",
      dialogueOptions: [{ label: "Transport de marchandises", value: 1 }],
      selectedOptions: [],
    },
    {
      label: "Transport de marchandise aval",
      dialogueOptions: [{ label: "Transport de marchandises", value: 1 }],
      selectedOptions: [],
    },
    {
      label: "Déplacements domicile-travail",
      dialogueOptions: [{ label: "Transport de personnes", value: 1 }],
      selectedOptions: [],
    },
    {
      label: "Déplacements des visiteurs et des clients",
      dialogueOptions: [{ label: "Transport de personnes", value: 1 }],
      selectedOptions: [],
    },
    {
      label: "Déplacements professionnels",
      dialogueOptions: [{ label: "Transport de personnes", value: 1 }],
      selectedOptions: [],
    },
  ]);

  const [produitsAchetesList, setProduitsAchetesList] = useState([
    {
      label: "Achats de biens",
      dialogueOptions: [{ label: "Achats de biens", value: 1 }],
    },
    {
      label: "Immobilisation de biens",
      dialogueOptions: [{ label: "Achats de biens", value: 1 }],
    },
    {
      label: "Gestion des déchets",
      dialogueOptions: [{ label: "Traitement des déchets", value: 1 }],
    },
    {
      label: "Actifs en leasing amont",
      dialogueOptions: [{ label: "None", value: 1 }],
    },
    {
      label: "Achat de services",
      dialogueOptions: [{ label: "Achat de service", value: 1 }],
    },
  ]);

  const [produitsVendusList, setProduitsVendusList] = useState([
    {
      label: "Utilisation des produits vendus",
      dialogueOptions: [{ label: "None", value: 1 }],
    },
    {
      label: "Actifs en leasing aval",
      dialogueOptions: [{ label: "None", value: 1 }],
    },
    {
      label: "Fin de vie des produits vendus",
      dialogueOptions: [{ label: "None", value: 1 }],
    },
    {
      label: "Investissements",
      dialogueOptions: [{ label: "None", value: 1 }],
    },
  ]);
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const navigate = useNavigate();
  const handleReset = async () => {
    setLoading(true)
    const bilan = JSON.parse(localStorage.getItem("Bilan"));
    console.log("handleReset bilan",bilan)
    const token = localStorage.getItem("token");
    
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      
      
      const url = `http://localhost:3000/api/bilans/calculateBilan/${selectedDB}`;
      
      const url1 = "http://localhost:3000/api/bilans/create-bilan";
      const response1 = await axios.post(url1, bilan, { headers: headers });
      const response = await axios.post(url, bilan, { headers: headers });
      localStorage.setItem("ClientBilan", JSON.stringify(response.data));
      setLoading(false)
      if(allArraysEmpty(bilan.selectedCategoryElements)){
        toast.error("not selected category elements!")
      }else{
        toast.success("calculated successfully")
        navigate("/rapport");
      }
       
    
  };
  function allArraysEmpty(arrays) {
    return arrays.every(array => array.length === 0);
}

   
  const selectedDB= localStorage.getItem("db_type")
  console.log("selectedDB",selectedDB)
  
  const [loading, setLoading] = useState(false);

   
 
  useEffect(() => {
    console.log("activeStep",activeStep)
    

    // Check if dbs_type1 has data and activeStep is valid
    if (dbs_type1[0] && dbs_type1[0][activeStep]) {
      console.log("2nd step calc ",dbs_type1[0][activeStep]["list"])
      setDbs_type1(dbs_type1[0][activeStep]); // Update the state
    }
  }, [activeStep, dbs_type1, setDbs_type1List]); // Only re-run when activeStep changes



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
            <AppBarComponent title="Calculateur" />
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
                                icon={99}
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
                         
                        {/* {activeStep === 0 && selectedDB=="ademe" && (
                          <EmissionsDirectes
                            emissionsList={emissionsList}
                            setEmissionsList={setEmissionsList}
                          />
                        )} */}

                        {/* {activeStep === 0 && selectedDB=="Agribalyse" && (
                          <Alimentaire
                            emissionsList={emissionsListAgribalyse}
                            setEmissionsList={setEmissionsListAgribalyse}
                          />
                        )} */}


            
                  


{dbs_type1.list.map((step, index) => {
 
        // Check if the current step is the active one
        if (index === activeStep) {
          return (
            <div key={index}>
              <EmissionsDirectes
                emissionsList={dbs_type1List}
                setEmissionsList={setDbs_type1List}
                step={activeStep}
                sheetNamem={step.dialogueOptions[0].value}
              />
            </div>
          );
        }
        return null; // Return null if the condition isn't met
      })}


                                        
{/* 
                      {activeStep === 0 && selectedDB=="ademe" && (
                          <EmissionsDirectes
                            emissionsList={emissionsList}
                            setEmissionsList={setEmissionsList}
                          />
                        )}
                        {activeStep === 1 && selectedDB=="ademe" && (
                          <Energie
                            energieList={energieList}
                            setEnergieList={setEnergieList}
                          />
                        )}
                        {activeStep === 2  && selectedDB=="ademe" && (
                          <Deplacement
                            deplacementList={deplacementList}
                            setDeplacementList={setDeplacementList}
                          />
                        )}
                        {activeStep === 3 && selectedDB=="ademe" && (
                          <ProduitsAchetes
                            produitsAchetesList={produitsAchetesList}
                            setProduitsAchetesList={setProduitsAchetesList}
                          />
                        )}
                        {activeStep === 4 && selectedDB=="ademe" && (
                          <ProduitsVendu
                            produitsVendusList={produitsVendusList}
                            setProduitsVendusList={setProduitsVendusList}
                          />
                        )}
                        {activeStep === 5 && selectedDB=="ademe" && <AutresEmissions />} */}
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
                                ? handleReset
                                : handleNext
                            }
                            style={Styles.suivantButton}
                          >
                            <Typography style={Styles.buttonText}>
                              {activeStep === steps.length - 1
                                ? "Calculer Bilan"
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
                  <Bilan showBilan={showBilan} setShowBilan={setShowBilan} />
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
