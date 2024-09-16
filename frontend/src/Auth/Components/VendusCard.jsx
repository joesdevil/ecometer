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
const VendusCard = () => {
  const [isDropVisible, setIsDropVisible] = useState(false);
  const [post1, setPost1] = useState({});
  const [post2, setPost2] = useState({});
  const [post3, setPost3] = useState({});
  const [post4, setPost4] = useState({});
  const [produitsVendusList, setProduitsVendusList] = useState([
    {
      label: "Utilisation des produits vendus",
      dialogueOptions: [{ label: "None", value: 1 }],
    },
    {
      label: "Actifs en leasing aval",
      dialogueOptions: [{ label: "None", value: 2 }],
    },
    {
      label: "Fin de vie des produits vendus",
      dialogueOptions: [{ label: "None", value: 3 }],
    },
    {
      label: "Investissements",
      dialogueOptions: [{ label: "None", value: 4 }],
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
        case 5.1:
          setPost1({
            total: element.emissions,
            co2a: element.emissions - element.CO2 - element.CH4 - element.N2O,
            cob: element.CO2,
            ch4: element.CH4,
            n2o: element.N2O,
          });
          break;
        case 5.2:
          setPost2({
            total: element.emissions,
            co2a: element.emissions - element.CO2 - element.CH4 - element.N2O,
            cob: element.CO2,
            ch4: element.CH4,
            n2o: element.N2O,
          });

          break;
        case 5.3:
          setPost3({
            total: element.emissions,
            co2a: element.emissions - element.CO2 - element.CH4 - element.N2O,
            cob: element.CO2,
            ch4: element.CH4,
            n2o: element.N2O,
          });
          break;
        case 5.4:
          setPost4({
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
                  src="Cart.svg"
                  alt="SVG Image"
                  className=" h-[2.6vh] pr-[0.3vh]"
                ></img>
              </div>
            </Grid>
            <Grid item md={11} xs={10}>
              <Typography style={textTitre}>
                &nbsp;&nbsp; Total Emissions indirectes
                &nbsp;&nbsp;&nbsp;&nbsp;(Produits Vendus)
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
                  {(
                    (post1.total + post2.total + post3.total + post4.total) 
                  ).toFixed(3)}{" "}
                  kg CO2e
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid>
        {isDropVisible && (
          <Stack direction="column" spacing={1} marginTop={{ md: "25px" }}>
            {produitsVendusList.map((item, index) => (
              <React.Fragment key={index}>
                <Typography style={subTextStyle}>{item.label}</Typography>
                <Grid container>
                  <Grid item md={1.8} xs={12}>
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
                          CO2a
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
                            : item.dialogueOptions[0].value === 3
                            ? (post3.co2a / 1000).toFixed(2)
                            : item.dialogueOptions[0].value === 4
                            ? (post4.co2a / 1000).toFixed(2)
                            : ""}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={1.8} xs={12}>
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
                            : item.dialogueOptions[0].value === 3
                            ? (post3.ch4 / 1000).toFixed(2)
                            : item.dialogueOptions[0].value === 4
                            ? (post4.ch4 / 1000).toFixed(2)
                            : ""}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={1.8} xs={12}>
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
                            : item.dialogueOptions[0].value === 3
                            ? (post3.n2o / 1000).toFixed(2)
                            : item.dialogueOptions[0].value === 4
                            ? (post4.n2o / 1000).toFixed(2)
                            : ""}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={1.8} xs={12}>
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
                            : item.dialogueOptions[0].value === 3
                            ? (post3.cob / 1000).toFixed(2)
                            : item.dialogueOptions[0].value === 4
                            ? (post4.cob / 1000).toFixed(2)
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

export default VendusCard;
