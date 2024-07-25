import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import Deplacement from "../Components/Deplacement";
import Energie from "../Components/Energie";
import ProduitsVendu from "../Components/ProduitsVendus";
import ProduitsAchetes from "../Components/ProduitsAchetes";
import AutresEmissions from "../Components/AutresEmissions";
import SideBar from "../Components/SideBar";
import CustomStepConnector from "./CustomStepConnector";
import ColorlibStepIcon from "./ColorlibStepIcon";
import Bilan from "../Components/Bilan";

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
  const [showBilan, setShowBilan] = useState(false);
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
    const bilan = JSON.parse(localStorage.getItem("Bilan"));
    console.log("handleReset bilan",bilan)
    const token = localStorage.getItem("token");
    
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      
      console.log("headers",headers)
      const url = "http://localhost:3000/api/bilans/calculateBilan";
      const url1 = "http://localhost:3000/api/bilans/create-bilan";
      const response1 = await axios.post(url1, bilan, { headers: headers });
      const response = await axios.post(url, bilan, { headers: headers });
      localStorage.setItem("ClientBilan", JSON.stringify(response.data));
   
    navigate("/rapport");
  };

  const steps = [
    { label: "Emissions directes", icon: 1, backgroundColor: "#F0F2F7" },
    { label: "Energie", icon: 2, backgroundColor: "#E0E5EC" },
    { label: "Déplacement", icon: 3, backgroundColor: "#D1D9E4" },
    { label: "Produits Achetés", icon: 4, backgroundColor: "#C1CDE0" },
    { label: "Produits Vendus", icon: 5, backgroundColor: "#C1CDE0" },
    {
      label: "Autres émissions indirectes",
      icon: 6,
      backgroundColor: "#B2C8DC",
    },
  ];

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
                          <EmissionsDirectes
                            emissionsList={emissionsList}
                            setEmissionsList={setEmissionsList}
                          />
                        )}
                        {activeStep === 1 && (
                          <Energie
                            energieList={energieList}
                            setEnergieList={setEnergieList}
                          />
                        )}
                        {activeStep === 2 && (
                          <Deplacement
                            deplacementList={deplacementList}
                            setDeplacementList={setDeplacementList}
                          />
                        )}
                        {activeStep === 3 && (
                          <ProduitsAchetes
                            produitsAchetesList={produitsAchetesList}
                            setProduitsAchetesList={setProduitsAchetesList}
                          />
                        )}
                        {activeStep === 4 && (
                          <ProduitsVendu
                            produitsVendusList={produitsVendusList}
                            setProduitsVendusList={setProduitsVendusList}
                          />
                        )}
                        {activeStep === 5 && <AutresEmissions />}
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
