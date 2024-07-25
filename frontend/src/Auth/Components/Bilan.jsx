import { useState } from "react";
import { Grid, Typography, Paper, Button, Select, CircularProgress } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios"; // Import axios

// Définir un nouveau thème personnalisé
const newTheme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          color: "#EEF5FC", // Couleur du texte
          border: "0px", // Suppression de la bordure
          borderRadius: "15px", // Rayon de la bordure
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#EEF5FC", // Couleur de l'arrière-plan
        },
        notchedOutline: {
          borderColor: "#FFF", // Couleur de la bordure par défaut
          borderRadius: "15px", // Rayon de la bordure
        },
        // Override hover and focus styles to prevent border color change
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#FFF", // Keep border color same as default
        },
        "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#FFF", // Keep border color same as default
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          color: "#4D4D4D", // Couleur du texte
          fontFamily: "Inter", // Police de caractères
          fontWeight: 400, // Poids de la police
          lineHeight: "24px", // Hauteur de ligne
          borderRadius: "15px", // Rayon de la bordure
          "&:hover": {
            borderColor: "#FFF", // Couleur de la bordure au survol
          },
        },
        icon: {
          color: "#000", // Couleur de l'icône
        },
      },
    },
  },
});

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
 



function Bilan({ showBilan, setShowBilan }) { 
  
  const data = {
    year: 2024,
    clientId: "66661fd621a877d16ef65508", //localStorage.getItem("clientId"),
    selectedCategoryElements: [
      [],
      [],
      [],
      [],
      [],
      [],
      [], //7
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [], //15
      [],
      [],
      [],
      [],
      [],
      [], //21
      [], //22
    ],
  };
  const handleClick = () => {
    localStorage.removeItem("Bilan");
    localStorage.setItem("Bilan", JSON.stringify(data));
    setShowBilan(!showBilan); // Inversion de l'état de showBilan
    // if (localStorage.getItem("'isConnected'")) {
    //   localStorage.setItem("Bilan", data);
    // }
  };
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('excelfile', file);
    console.log("uploading file")
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:3000/api/categories/uploadExcelToMongo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded successfully:', response.data);
      setLoading(false)
    } catch (error) {
      console.error("Error uploading file:", error);
      setLoading(false);
    }
  };
  const pays = [{ id: 1, name: "Algerie" }];
  const wilayas = ["Alger", "Oran", "Tizi Ouzou"];
  const [selectedPays, setSelectedPays] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <ThemeProvider theme={newTheme}>
        <Paper
          elevation={3}
          sx={{
            minHeight: "fit-content",
            borderRadius: "15px",
            paddingTop: "40px",
            paddingBottom: "40px",
            paddingLeft: "55px",
            paddingRight: "55px",
          }}
        >
          <Grid container spacing={2.5}>
            <Grid item md={12} marginBottom={"40px"} xs={12}>
              <Typography
                style={Styles.TitreText}
                textAlign={{ xs: "center", md: "start" }}
              >
                Bilan Carbone
              </Typography>
            </Grid>
            <Grid item md={12} xs={12}>
              <Grid container direction={"row"} spacing={2}>
                <Grid item md={4.2} xs={12}>
                  <Typography style={Styles.bodyText}>Année</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                    <DatePicker
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          sx: {
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
                              borderColor: "#EEF5FCD !important",
                              borderRadius: "15px",
                            },
                          },
                        },
                      }}
                      placeholder="A"
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item md={4.2} xs={12}>
                  <Typography style={Styles.bodyText}>Pays</Typography>
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
                        borderColor: "#EEF5FCD !important",
                        borderRadius: "15px",
                      },
                    }}
                    value={selectedPays}
                    onChange={(e) => setSelectedPays(e.target.value)}
                  >
                    <option disabled selected>
                      Selectionner un pays
                    </option>
                    {pays.map((pays) => (
                      <option key={pays.id} value={pays.id}>
                        {pays.name}
                      </option>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </Grid>

            <Grid item md={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item md={4.2} xs={12}>
                  <Typography style={Styles.bodyText}>wilaya</Typography>
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
                        borderColor: "#EEF5FCD !important",
                        borderRadius: "15px",
                      },
                    }}
                    value={selectedWilaya}
                    onChange={(e) => setSelectedWilaya(e.target.value)}
                  >
                    <option disabled selected>
                      Selectionner une wilaya
                    </option>
                    {wilayas.map((wilayas) => (
                      <option key={wilayas} value={wilayas}>
                        {wilayas}
                      </option>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </Grid>



            <Grid item md={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item md={4.2} xs={12}>
                  <Typography style={Styles.bodyText}>Excel db file</Typography>
                  <input onChange={handleFileUpload} fullWidth type="file" name="excelfile" id="excelfile"  sx={{
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
                        borderColor: "#EEF5FCD !important",
                        borderRadius: "15px",
                      },
                    }}/>
                   {loading && <CircularProgress />}
                    
                    
                
                </Grid>
              </Grid>
            </Grid>
            
            
            <Grid item md={12} xs={12}>
              <Grid container direction="row-reverse">
                <Grid item md={"2.36"} xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    style={Styles.commencerButton}
                    onClick={handleClick}
                  >
                    Commencer
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </ThemeProvider>
    </div>
  );
}

export default Bilan;



