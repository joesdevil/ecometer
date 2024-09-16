import React, { useState, useEffect } from "react";
import { Paper, Grid, Typography, Stack } from "@mui/material";
import Drop from "./Drop";

const textTitre = {
  fontFamily: "Eudoxus , sans-serif",
  fontWeight: "700",
  fontSize: "20px",
  lineHeight: "24px",
};

const textValue = {
  fontFamily: "Eudoxus , sans-serif",
  fontWeight: "700",
  fontSize: "20px",
};
const subTextStyle = {
  fontFamily: "Inter , sans-serif",
  fontWeight: "400",
  fontSize: "16px",
};
const EnergieCard = () => {
  const [isDropVisible, setIsDropVisible] = useState(false);
  const [post1, setPost1] = useState({});
  const [post2, setPost2] = useState({});
  const [energieList, setEnergieList] = useState([
    {
      label: "Émissions indirectes liées à la consommation d'électricité",
      dialogueOptions: [{ label: "Electricité", value: 1 }],
      selectedOptions: [],
    },
    {
      label:
        "Émissions indirectes liées à la consommation d'énergie autre que l'électricité",
      dialogueOptions: [{ label: "Réseau de chaleur et de froid", value: 2 }],
      selectedOptions: [],
    },
  ]);

  const toggleDrop = () => {
    setIsDropVisible(!isDropVisible);
    console.log(isDropVisible);
  };
  const Data = JSON.parse(localStorage.getItem("ClientBilan"));
  const calculateScopeEmissions = () => {
    Data.emissionPosts.map((element) => {
      switch (element.index) {
        case 2.1:
          setPost1({
            total: element.emissions,
            co2a: element.emissions - element.CO2 - element.CH4 - element.N2O,
            cob: element.CO2,
            ch4: element.CH4,
            n2o: element.N2O,
          });
          break;
        case 2.2:
          setPost2({
            total: element.emissions,
            co2a: element.emissions - element.CO2 - element.CH4 - element.N2O,
            cob: element.CO2,
            ch4: element.CH4,
            n2o: element.N2O,
          });

          break;

        default:
          break;
      }
    });
  };

  useEffect(() => {
    calculateScopeEmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Paper
      elevation={3}
      sx={{
        paddingTop: "25px",
        paddingBottom: "25px",
        paddingLeft: "30px",
        paddingRight: "30px",
        borderRadius: "15px",
        background: "#D9D9D9",
      }}
    >
      <Grid container justifyContent="space-between">
        <Grid item md={6} xs={12}>
          <Grid container>
            <Grid item md={1} xs={2}>
              <div className="bg-[#003049] h-[5vh] w-[5vh] flex justify-center items-center rounded-full">
                <img
                  src="Battery.svg"
                  alt="SVG Image"
                  className="pl-[0.3vh] h-[3vh]"
                ></img>
              </div>
            </Grid>
            <Grid item md={11} xs={10}>
              <Typography style={textTitre}>
                &nbsp;&nbsp;Total Emissions indirectes
                &nbsp;&nbsp;&nbsp;(Énergie)
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={6} xs={12}>
          <Grid container direction={"row-reverse"}>
            <Grid item md={1} xs={2}>
              <Drop onClick={toggleDrop} />
            </Grid>

            <Grid item md={11} xs={10}>
              <Grid justifyContent={"start"} alignContent={"start"}>
                <Typography
                  style={textValue}
                  sx={{
                    textAlign: "right",
                    marginRight: { md: "20px", xs: "10px" },
                  }}
                >
                  {((post1.total + post2.total) ).toFixed(3)} kg CO2e
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid>
        {isDropVisible && (
          <Stack direction="column" spacing={1} marginTop={{ md: "25px" }}>
            {energieList.map((item, index) => (
              <React.Fragment key={index}>
                <Typography style={subTextStyle}>{item.label}</Typography>
                <Grid container>
                  <Grid item md={1.8}>
                    <Grid container spacing={1}>
                      <Grid item md={12}>
                        <Typography
                          sx={{
                            fontFamily: "Inter ,sans-serif",
                            fontWeight: "400",
                            fontSize: "14px",
                          }}
                        >
                          {" "}
                          CHO2
                        </Typography>
                      </Grid>
                      <Grid item md={12}>
                        <Typography
                          sx={{
                            fontFamily: "Inter ,sans-serif",
                            fontWeight: "700",
                            fontSize: "16px",
                          }}
                        >
                          {item.dialogueOptions[0].value === 1
                            ? (post1.co2a / 1000).toFixed(2)
                            : item.dialogueOptions[0].value === 2
                            ? (post2.co2a / 1000).toFixed(2)
                            : ""}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={1.8}>
                    <Grid container spacing={1}>
                      <Grid item md={12}>
                        <Typography
                          sx={{
                            fontFamily: "Inter ,sans-serif",
                            fontWeight: "400",
                            fontSize: "14px",
                          }}
                        >
                          {" "}
                          CH4
                        </Typography>
                      </Grid>
                      <Grid item md={12}>
                        <Typography
                          sx={{
                            fontFamily: "Inter ,sans-serif",
                            fontWeight: "700",
                            fontSize: "16px",
                          }}
                        >
                          {item.dialogueOptions[0].value === 1
                            ? (post1.ch4 / 1000).toFixed(2)
                            : item.dialogueOptions[0].value === 2
                            ? (post2.ch4 / 1000).toFixed(2)
                            : ""}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={1.8}>
                    <Grid container spacing={1}>
                      <Grid item md={12}>
                        <Typography
                          sx={{
                            fontFamily: "Inter ,sans-serif",
                            fontWeight: "400",
                            fontSize: "14px",
                          }}
                        >
                          {" "}
                          N2O
                        </Typography>
                      </Grid>
                      <Grid item md={12}>
                        <Typography
                          sx={{
                            fontFamily: "Inter ,sans-serif",
                            fontWeight: "700",
                            fontSize: "16px",
                          }}
                        >
                          {item.dialogueOptions[0].value === 1
                            ? (post1.n2o / 1000).toFixed(2)
                            : item.dialogueOptions[0].value === 2
                            ? (post2.n2o / 1000).toFixed(2)
                            : ""}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={1.8}>
                    <Grid container spacing={1}>
                      <Grid item md={12}>
                        <Typography
                          sx={{
                            fontFamily: "Inter ,sans-serif",
                            fontWeight: "400",
                            fontSize: "14px",
                          }}
                        >
                          {" "}
                          CO2b
                        </Typography>
                      </Grid>
                      <Grid item md={12}>
                        <Typography
                          sx={{
                            fontFamily: "Inter ,sans-serif",
                            fontWeight: "700",
                            fontSize: "16px",
                          }}
                        >
                          {item.dialogueOptions[0].value === 1
                            ? (post1.cob / 1000).toFixed(2)
                            : item.dialogueOptions[0].value === 2
                            ? (post2.cob / 1000).toFixed(2)
                            : ""}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </React.Fragment>
            ))}
          </Stack>
        )}
      </Grid>
    </Paper>
  );
};

export default EnergieCard;
