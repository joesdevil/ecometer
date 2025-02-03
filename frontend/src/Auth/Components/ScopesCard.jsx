import { Grid, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
const Styles = {
  ScopeText: {
    fontFamily: "Inter , sans-serif",
    fontSize: "3.5vh",
    color: "#FFFFFF",
  },
  EmissionsText: {
    
    fontFamily: "Inter , sans-serif",
    fontWeight: "700",
    fontSize: "18px",
    textAlign: "center",
    color: "#FFFFFF",
  },
  UnityText: {
    fontFamily: "Eudoxus , sans-serif",
    fontWeight: "500",
    fontSize: "3.5vh",
    color: "#FFFFFF",
  },
};

const ScopesCard = () => {
  const [scope1, setScope1] = useState(0);
  const [scope2, setScope2] = useState(0);
  const [scope3, setScope3] = useState(0);
  const [total, setTotal] = useState(0);

  const calculateScopeEmissions = async() => {
    // Parse data from localStorage
    let Data = JSON.parse(localStorage.getItem("ClientBilan"));
    const token = localStorage.getItem("token")
    try {
      const response = await axios.get("http://localhost:3000/api/bilans/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.setItem("ClientBilan", JSON.stringify(response.data.carbonFootprints[0]))
      
        console.log("response.data.carbonFootprints",response.data.carbonFootprints)
      const filteredObjects = response.data.carbonFootprints.filter(obj => obj.clientId === localStorage.getItem("clientId"));
      console.log("filteredObjects-***",filteredObjects)
      if(filteredObjects[0]){

        Data= filteredObjects[0]
      }
      // localStorage.setItem("clientId",response.data.clientId)
      
    } catch (error) {
      console.error("Error fetching client bilans:", error);
      throw error;
  };


    if (Data) {
      console.log("Data.scope2:", Data.scope2);

      // Update state using previous values
      setScope1((prev) => prev + Data.scope1);
      setScope2((prev) => prev + Data.scope2);
      setScope3((prev) => prev + Data.scope3);
      setTotal((prev) => prev + Data.totalEmissions);
    } else {
      console.warn("No ClientBilan data found in localStorage.");
    }
  };

  // Trigger calculation on component mount
  useEffect(() => {
    calculateScopeEmissions();
  }, []); // Empty dependency array ensures this runs once on mount

  const formatEmission = (value) => {
    // Dynamically decide unit and value
    if (value >= 1_000_000) {
      return { displayValue: (value / 1000).toFixed(3), unit: "tonne" };
    }
    return { displayValue: value.toFixed(3), unit: "kg" };
  };

  return (
    <Paper elevation={0}>
      <Grid container>
        <Grid item md={4} xs={12}>
          <Paper
            sx={{
              backgroundColor: "#D62828",
              textAlign: { md: "center" },
              borderRadius: { md: "2vh 0px 0px 2vh " },
            }}
          >
            <Typography style={Styles.ScopeText}>Scope 1</Typography>
            <Typography style={Styles.EmissionsText}  >
              {formatEmission(scope1).displayValue}
            </Typography>
            <Typography style={Styles.UnityText}>
              {formatEmission(scope1).unit} CO2
            </Typography>
          </Paper>
        </Grid>

        <Grid item md={4} xs={12}>
          <Paper
            sx={{
              backgroundColor: "#F77F00",
              textAlign: { md: "center" },
              borderRadius: { md: "0px 0px 0px 0px" },
            }}
          >
            <Typography style={Styles.ScopeText}>Scope 2</Typography>
            <Typography style={Styles.EmissionsText}>
              {formatEmission(scope2).displayValue}
            </Typography>
            <Typography style={Styles.UnityText}>
              {formatEmission(scope2).unit} CO2
            </Typography>
          </Paper>
        </Grid>

        <Grid item md={4} xs={12}>
          <Paper
            sx={{
              backgroundColor: "#FCBF49",
              textAlign: { md: "center" },
              borderRadius: { md: "0px 2vh 2vh 0px" },
            }}
          >
            <Typography style={Styles.ScopeText}>Scope 3</Typography>
            <Typography style={Styles.EmissionsText}>
              {formatEmission(scope3).displayValue}
            </Typography>
            <Typography style={Styles.UnityText}>
              {formatEmission(scope3).unit} CO2
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ScopesCard;
