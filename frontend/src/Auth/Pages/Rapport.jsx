import { useState, useEffect } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import AppBarComponent from "../Components/AppBarComponent";
import SideBar from "../Components/SideBar";
import BilanDetails from "../Components/BilanDetails";

const Rapport = () => {
  const [showFirstMain, setShowFirstMain] = useState(true);
  const [total, setTotal] = useState(0);
  const [year, setYear] = useState(2024);
  const [scope1, setScope1] = useState(0);
  const [scope2, setScope2] = useState(0);
  const [scope3, setScope3] = useState(0);
  const Data = JSON.parse(localStorage.getItem("ClientBilan"));
  const calculateScopeEmissions = () => {
    console.log("emissionPosts", Data.emissionPosts);
  
    let scope1Total = 0;
    let scope2Total = 0;
    let scope3Total = 0;
  
    Data.emissionPosts.forEach((element) => {
      if (
        element.index === 1.1 ||
        element.index === 1.2 ||
        element.index === 1.3 ||
        element.index === 1.4 ||
        element.index === 1.5
      ) {
        console.log("element.emissions", element.emissions);
        scope1Total += element.emissions;
      } else if (element.index === 2.1 || element.index === 2.2) {
        scope2Total += element.emissions;
      } else {
        scope3Total += element.emissions;
      }
    });
  
    // Set the states all at once after calculating the totals
    setScope1(scope1Total);
    setScope2(scope2Total);
    setScope3(scope3Total);
    setTotal(scope1Total + scope2Total + scope3Total);
    setYear(Data.year);
  };
  
  useEffect(() => {
    calculateScopeEmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

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
                      {/* Titre Rapport annuel d'émissions 2024 */}
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
                              {(total).toFixed(3)}
                              <span className="text-black text-[5vh]">
                                {" "}
                                kg CO2e
                              </span>
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
                                    {item === 1
                                      ? (scope1 ).toFixed(3)
                                      : item === 2
                                      ? (scope2 ).toFixed(3)
                                      : (scope3 ).toFixed(3)}
                                    <span className="text-black text-[5vh]">
                                      {" "}
                                      KG CO2e
                                    </span>
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
