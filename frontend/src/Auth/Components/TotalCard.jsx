import { Grid, Paper, Typography } from "@mui/material";

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
          <Typography style={Styles.TotalText}>
            {(
              JSON.parse(localStorage.getItem("ClientBilan")).totalEmissions
            ).toFixed(3)}
          </Typography>
        </Grid>
        <Grid item>
          <Typography style={Styles.UnityText}>kg CO2e</Typography>
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
