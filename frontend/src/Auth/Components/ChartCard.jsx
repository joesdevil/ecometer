import { Grid, Paper, Typography, Box, LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
const ChartCard = () => {
  const [total, setTotal] = useState(0);
  const [scope1, setScope1] = useState(0);
  const [scope2, setScope2] = useState(0);
  const [scope3, setScope3] = useState(0);

  // Normalize values to tonnes for consistency
  const normalizeToTonnes = (value, unit) => {
    if (unit === "KG") return value / 1000; // Convert kilograms to tonnes
    if (unit === "TONNE") return value; // Already in tonnes
    return value; // Default assumption
  };

  useEffect(() => {
    const calculateScopeEmissions = async() => {
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
        setScope1(normalizeToTonnes(Data.scope1, "TONNE"));
        setScope2(normalizeToTonnes(Data.scope2, "KG"));
        setScope3(normalizeToTonnes(Data.scope3, "TONNE"));
        setTotal(
          normalizeToTonnes(Data.scope1, "TONNE") +
            normalizeToTonnes(Data.scope2, "KG") +
            normalizeToTonnes(Data.scope3, "TONNE")
        );
      } else {
        console.warn("ClientBilan data is missing or incomplete in localStorage.");
      }
    };

    calculateScopeEmissions();
  }, []);

  const getPercentage = (scope) => (total > 0 ? ((scope / total) * 100).toFixed(2) : 0);

  return (
    <Paper
      elevation={3}
      sx={{
        padding: "20px",
        borderRadius: "15px",
        background: "#D9D9D9",
      }}
    >
      <Typography
        sx={{
          fontFamily: "Inter , sans-serif",
          fontWeight: "700",
          fontSize: "16px",
          textAlign: "center",
          marginBottom: "10px",
        }}
      >
        Emissions par scope (Tonnes CO₂e)
      </Typography>

      {[
        { scope: scope1, color: "#D62828", label: "Scope 1" },
        { scope: scope2, color: "#F77F00", label: "Scope 2" },
        { scope: scope3, color: "#FCBF49", label: "Scope 3" },
      ].map((item, index) => (
        <Box key={index} sx={{ marginBottom: "20px" }}>
          <Typography
            sx={{
              fontFamily: "Inter , sans-serif",
              fontWeight: "500",
              fontSize: "14px",
              marginBottom: "5px",
            }}
          >
            {item.label}: {getPercentage(item.scope)}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={getPercentage(item.scope)}
            sx={{
              height: 10,
              borderRadius: "5px",
              "& .MuiLinearProgress-bar": {
                backgroundColor: item.color,
              },
            }}
          />
        </Box>
      ))}
    </Paper>
  );
};

export default ChartCard;
