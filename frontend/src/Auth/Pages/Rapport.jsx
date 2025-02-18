import { useState, useEffect } from "react"; 
import { Box, Grid, Typography, Paper, Select, MenuItem } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import AppBarComponent from "../Components/AppBarComponent";
import SideBar from "../Components/SideBar";
import BilanDetails from "../Components/BilanDetails";
import axios from "axios";

const Rapport = () => {
  const [showFirstMain, setShowFirstMain] = useState(true);
  const [total, setTotal] = useState(0);
  const [year, setYear] = useState(2025);
  const [scope1, setScope1] = useState(0);
  const [scope2, setScope2] = useState(0);
  const [scope3, setScope3] = useState(0);
  const [clients, setClients] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");

  const Styles = {
    commencerButton: {
      fontFamily: "Inter , sans-serif",
      height: "56px",
      backgroundColor: "#003049",
      borderRadius: "15px 15px 15px 15px",
    },
    bodyText: {
      fontFamily: "Inter, sans-serif",
      fontSize: "18px",
      fontWeight: 400,
      lineHeight: "28px",
      textAlign: "left",
      color: "#000000",
    },
    TitreText: {
      fontFamily: "Eudoxus, sans-serif",
      fontWeight: "700",
      fontSize: "30px",
      lineHeight: "30px",
    },
  };

  let Data = {
    year: 2025,
    scope1: 0,
    scope2: 0,
    scope3: 0,
  };

  useEffect(() => {
    const clientId = localStorage.getItem("clientId");
     
    if (clientId) {
      axios.get(`http://localhost:3000/api/clients/profile`, {
        headers: {
          'clientId': clientId,
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          console.log("isAdmin9-->",response.data.isAdmin)
          setIsAdmin(response.data.isAdmin);
        })
        .catch(error => {
          console.error("There was an error fetching the client data!", error);
        });
    }
  }, [localStorage.getItem("clientId")]);

  const token = localStorage.getItem("token");

  const calculateScopeEmissions = async () => {
    let filteredObjects;
    
    try {
      const response = await axios.get("http://localhost:3000/api/bilans/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.setItem("ClientBilan", JSON.stringify(response.data.carbonFootprints[0]));

      if(isAdmin){
        console.log("filteredObjects 0",isAdmin)
        filteredObjects = response.data.carbonFootprints.filter(
          (obj) => obj.clientId === selectedClient 
        );
      }else{
        console.log("filteredObjects 1",isAdmin)
        filteredObjects = response.data.carbonFootprints.filter(
          (obj) => obj.clientId === localStorage.getItem("clientId") 
        );
      }
      
      if (filteredObjects[0]) {
        Data = filteredObjects[0];
      }

      setScope1(Data.scope1);
      setScope2(Data.scope2);
      setScope3(Data.scope3);
      setTotal(Data.scope1 + Data.scope2 + Data.scope3);
      setYear(Data.year);
    } catch (error) {
      console.error("Error fetching client bilans:", error);
      throw error;
    }
  };

  useEffect(() => {
    if(isAdmin){
      const token = localStorage.getItem("token");

      axios
        .get(`http://localhost:3000/api/clients/getAll`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setClients(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the clients!", error);
        });
    }
  }, [isAdmin]);

  useEffect(() => {
    calculateScopeEmissions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClient]);

  const units = {
    kg: 1, // Base unit
    tonne: 1000,
  };

  const isTonne = total >= 1_000_000; // Use tonne if total is 1,000,000 or more
  const unit = isTonne ? "tonne" : "kg";
  const displayValue = isTonne ? (total / 1000).toFixed(3) : total.toFixed(3);

  const unitFactor = units[unit] || 1; // Default to 1 if the unit is not found
  const convertedTotal = (total / unitFactor).toFixed(3);

  return (
    <Grid container>
      {/* Sidebar */}
      <Grid
        item
        md={2.1}
        sx={{ minHeight: "100vh", display: { xs: "none", md: "block" } }}
      >
        <SideBar />
      </Grid>

      {/* Main Content */}
      <Grid item md={9.9} xs={12}>
        <Grid container height={"auto"}>
          {/* Header */}
          <Grid
            item
            height={"11vh"}
            xs={12}
            sx={{ fontFamily: "Inter, sans-serif" }}
          >
            <AppBarComponent
              title={showFirstMain ? "Rapport" : "Rapport Detaillé"}
            />
          </Grid>

          {/* Main Content Body */}
          {showFirstMain && (
            <Grid
              item
              xs={12}
              sx={{
                background: "#F2F4F8",
                fontFamily: "Inter, sans-serif",
              }}
            >
              <Grid container justifyContent={"center"} marginTop={"4vh"}>
                <Grid item md={10}>
                  <Paper
                    sx={{
                      padding: "60px",
                      marginTop: "20px",
                      marginBottom: "20px",
                      borderRadius: "15px",
                    }}
                  >
                    <Grid container spacing={2}>
                      {/* Titre Rapport annuel d'émissions 2025 */}
                      <Grid item xs={12} md={9}>
                        <Typography
                          sx={{
                            textAlign: { md: "start", xs: "center" },
                            marginBottom: "20px",
                            fontSize: "4.5vh",
                            fontWeight: 600,
                          }}
                        >
                          Rapport annuel d&apos;émissions {year}
                        </Typography>
                      </Grid>

                      {isAdmin && (
                        <Grid item md={12} xs={12}>
                        <Grid container spacing={2}>
                          <Grid item md={4.2} xs={12}>
                            <Typography style={Styles.bodyText}>Client</Typography>
                            <Select
                              fullWidth
                              sx={{
                                borderRadius: "15px",
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#EEF5FC !important",
                                  borderRadius: "15px",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#EEF5FC !important",
                                  borderRadius: "15px",
                                },
                                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#EEF5FC !important",
                                  borderRadius: "15px",
                                },
                              }}
                              value={selectedClient}
                              onChange={(e) => setSelectedClient(e.target.value)}
                            >
                              <MenuItem disabled value="">
                                Selectionner Client
                              </MenuItem>
                              {clients.map((client) => (
                                <MenuItem key={client._id} value={client._id}>
                                  {client.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </Grid>
                        </Grid>
                      </Grid>
                      )}

                      {/* Bouton Voir plus de détails */}
                      <Grid
                        item
                        md={3}
                        xs={12}
                        sx={{
                          textAlign: { md: "end", xs: "center" },
                          marginBottom: { xs: "20px" },
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#F77F00",
                            cursor: "pointer",
                          }}
                          onClick={() => setShowFirstMain(false)}
                        >
                          Voir plus de détails
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} justifyContent="center">
                      {/* Premier Grid Item */}
                      <Grid item md={6} xs={12}>
                        <Paper
                          elevation={0}
                          sx={{
                            padding: "36px",
                            paddingTop: "20px",
                            paddingBottom: "20px",
                            borderRadius: "15px",
                            background: "#FFD5D5",
                          }}
                        >
                          <Typography
                            variant="h5"
                            sx={{
                              textAlign: { xs: "center", md: "start" },
                              color: "#D62828",
                              fontWeight: 600,
                            }}
                          >
                            ÉMISSIONS TOTALES
                          </Typography>
                          <Grid container alignItems="center">
                            <Typography
                              variant="h3"
                              sx={{
                                textAlign: { xs: "center", md: "start" },
                                marginRight: { md: "25px" },
                              }}
                            >
                              {convertedTotal}
                              <span style={{ fontSize: 17 + "px" }} className="text-black text-[5vh]"> {unit} CO₂e</span>
                            </Typography>
                          </Grid>
                        </Paper>
                      </Grid>

                      {/* Deuxième Grid Item */}
                      <Grid item md={6} xs={12}>
                        <Typography
                          sx={{
                            textAlign: "left",
                            fontSize: "2.7vh",
                            fontWeight: 600,
                          }}
                        >
                          Votre emissions ont été ventilées par scopes et
                          catégories conformément au GHG Corporate Standard. Les
                          résultats sont également ventilés par trimestre pour
                          comprendre l’évolution de votre empreinte carbone au
                          cours de l’année {year}.
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid
                      md={12}
                      xs={12}
                      sx={{
                        marginTop: "3%",
                        fontWeight: 600,
                        fontSize: "3.5vh",
                      }}
                    >
                      Ventilation des émissions par scopes
                    </Grid>
                    {/* Nouveau Grid Item pour contenir quatre sous-items */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={5} sx={{ marginTop: "2%" }}>
                        <Box
                          sx={{ display: "flex", flexDirection: "column" }}
                          md={12}
                          xs={12}
                        >
                          {[1, 2, 3].map((item) => (
                            <Grid
                              key={item}
                              sx={{ marginBottom: "3vh" }}
                              item
                              xs={12}
                              md={12}
                            >
                              <Paper
                                elevation={0}
                                sx={{
                                  padding: "4%",
                                  paddingTop: "4%",
                                  paddingBottom: "4%",
                                  borderRadius: "15px",
                                  background: "#FFD5D5",
                                  height: "10%",
                                }}
                              >
                                <Typography
                                  variant="h5"
                                  sx={{
                                    textAlign: { xs: "center", md: "start" },
                                    color: "#D62828",
                                    fontWeight: 500,
                                  }}
                                >
                                  SCOPE {item}
                                </Typography>
                                <Grid
                                  container
                                  alignItems="center"
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Typography
                                    variant="h4"
                                    sx={{
                                      fontWeight: 450,
                                      textAlign: { xs: "center", md: "start" },
                                      marginRight: { md: "25px" },
                                    }}
                                  >
                                    {(() => {
                                      // Determine the value based on the item
                                      const value = item === 1 ? scope1 : item === 2 ? scope2 : scope3;
                                      
                                      // Check if the value should be in tonnes
                                      const isTonne = value >= 1_000_000; // 1,000,000 KG = 1 Tonne
                                      const displayValue = isTonne ? (value / 1000).toFixed(3) : value.toFixed(3);
                                      const unit = isTonne ? "Tonne" : "KG";

                                      return (
                                        <>
                                          {displayValue}
                                          <span style={{ fontSize: 17 + "px" }} className="text-black text-[5vh]"> {unit} CO₂e</span>
                                        </>
                                      );
                                    })()}
                                  </Typography>
                                </Grid>
                              </Paper>
                            </Grid>
                          ))}
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={7} sx={{ marginTop: "5%" }}>
                        <Typography
                          variant="body2"
                          sx={{
                            textAlign: "center",
                            fontSize: "3.3vh",
                            fontWeight: 600,
                            marginBottom: "2%",
                          }}
                        >
                          Diagramme Circulaire
                        </Typography>
                        <PieChart
                          series={[
                            {
                              data: [
                                {
                                  id: 0,
                                  value: scope1,
                                  color: "#D62828",
                                  label: "SCOPE 1",
                                },
                                {
                                  id: 1,
                                  value: scope2,
                                  color: "#F77F00",
                                  label: "SCOPE 2",
                                },
                                {
                                  id: 2,
                                  value: scope3,
                                  color: "#FCBF49",
                                  label: "SCOPE 3",
                                },
                              ],
                            },
                          ]}
                          width={400}
                          height={200}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          )}

          {/* Main Content Body */}
          {!showFirstMain && <BilanDetails />}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Rapport;
