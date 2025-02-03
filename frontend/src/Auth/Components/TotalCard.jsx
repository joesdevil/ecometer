import { Grid, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

const Styles = {
  EmissionsText: {
    fontFamily: "Eudoxus , sans-serif",
    fontWeight: "700",
    fontSize: "3.5vh",
    marginBottom: "1%",
  },
  TotalText: {
    fontFamily: "Eudoxus , sans-serif",
    fontWeight: "500",
    fontSize: "48px",
    lineHeight: "58px",
    marginBottom: "10px",
  },
  IncertitudeText: {
    fontFamily: "Inter , sans-serif",
    fontWeight: "400",
    fontSize: "16px",
    lineHeight: "24px",
  },
  UnityText: {
    fontFamily: "Eudoxus , sans-serif",
    fontWeight: "500",
    fontSize: "4vh",
    lineHeight: "58px",
  },
};

const TotalCard = () => {
  const [scope1, setScope1] = useState(0);
  const [scope2, setScope2] = useState(0);
  const [scope3, setScope3] = useState(0);
  const [total, setTotal] = useState(0);
  const [unit, setUnit] = useState("kg"); // Default unit is kilograms

  const calculateScopeEmissions = async () => {
    const token = localStorage.getItem("token");
     // Parse data from localStorage
     let Data = JSON.parse(localStorage.getItem("ClientBilan"));
    
    try {
      const response = await axios.get("http://localhost:3000/api/bilans/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.setItem("ClientBilan", JSON.stringify(response.data.carbonFootprints[0]))
      
        console.log("response.data.carbonFootprints",response.data.carbonFootprints)
      const filteredObjects = response.data.carbonFootprints.filter(obj => obj.clientId === localStorage.getItem("clientId"));
      console.log("filteredObjects",filteredObjects)
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

      // Update state using parsed values
      setScope1(Data.scope1 || 0);
      setScope2(Data.scope2 || 0);
      setScope3(Data.scope3 || 0);

      const totalEmissions = Data.scope1 + Data.scope2 + Data.scope3;
      setTotal(totalEmissions);

      // Adjust unit dynamically
      if (totalEmissions >= 1_000_000) {
        setUnit("tonne");
        setTotal(totalEmissions / 1_000); // Convert to tonnes
      } else {
        setUnit("kg");
      }
    } else {
      console.warn("No ClientBilan data found in localStorage.");
    }
  };

  // Trigger calculation on component mount
  useEffect(() => {
    calculateScopeEmissions();
  }, []);

  return (
    <Paper
      elevation={3}
      sx={{
        paddingTop: "10px",
        paddingBottom: "28px",
        paddingLeft: "40px",
        paddingRight: "40px",
        borderRadius: "15px",
        background: "#D9D9D9",
      }}
    >
      <Typography style={Styles.EmissionsText}>Emissions Totales</Typography>
      <Grid container justifyContent="space-between">
        <Grid item>
          <Typography style={Styles.TotalText}>{total.toFixed(3)}</Typography>
        </Grid>
        <Grid item>
          <Typography style={Styles.UnityText}>
            {unit} CO₂
          </Typography>
        </Grid>
      </Grid>
      <Typography style={Styles.IncertitudeText}>
        Avec un taux d&apos;incertitudede{" "}
        <span style={{ fontWeight: "700" }}>
          {(
            JSON.parse(localStorage.getItem("ClientBilan")).totalUncertainty *
            100
          ).toFixed(2)}
          %
        </span>
      </Typography>
    </Paper>
  );
};

export default TotalCard;
