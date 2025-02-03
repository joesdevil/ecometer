import SideBar from "../Components/SideBar";
import AppBarComponent from "../Components/AppBarComponent";


import { Box, Grid, Paper, Typography } from "@mui/material";

const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px', 
    borderRadius: '10px', 
};

const formGroupStyle = {
    marginBottom: '15px'
};

const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold'
};

const inputStyle = {
    width: '100%',
    padding: '8px',
    boxSizing: 'border-box',
    borderRadius: '5px',
    border: '1px solid #ccc'
};

const buttonStyle = {
    padding: '10px 20px', 
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
};

const QuestionsClients = ({ showFirstMain }) => {
  

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
        <AppBarComponent
              title={showFirstMain ? "Questionnaires": "Questionnaires"}
            />
          <Grid container height={"auto"}>

        <div style={containerStyle}>
            
            <h1>Carbon Footprint Questionnaire</h1>
            <form>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>1. How many people live in your household?</label>
                    <input type="number" name="householdSize" style={inputStyle} />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>2. What is the average monthly electricity consumption of your household (in kWh)?</label>
                    <input type="number" name="electricityConsumption" style={inputStyle} />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>3. How many kilometers do you drive per week?</label>
                    <input type="number" name="weeklyKilometersDriven" style={inputStyle} />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>4. What type of vehicle do you drive?</label>
                    <select name="vehicleType" style={inputStyle}>
                        <option value="petrol">Petrol</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">Electric</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>5. How often do you use public transportation per week?</label>
                    <input type="number" name="publicTransportUsage" style={inputStyle} />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>6. How many flights do you take per year?</label>
                    <input type="number" name="annualFlights" style={inputStyle} />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>7. How much meat do you consume per week (in kg)?</label>
                    <input type="number" name="weeklyMeatConsumption" style={inputStyle} />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>8. How much dairy do you consume per week (in kg)?</label>
                    <input type="number" name="weeklyDairyConsumption" style={inputStyle} />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>9. How much waste does your household produce per week (in kg)?</label>
                    <input type="number" name="weeklyWasteProduction" style={inputStyle} />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>10. Do you recycle? If yes, what percentage of your waste is recycled?</label>
                    <input type="number" name="recyclingPercentage" style={inputStyle} />
                </div>
                <button type="submit" style={buttonStyle}>Submit</button>
            </form>
        </div>
        </Grid>
        </Grid>
        </Grid>

    );
};

export default QuestionsClients;