import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  Dialog,
  DialogContent,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from "@mui/material";
import CroixIcon from "./CroixIcon";
import axios from "axios";
import { toast } from 'react-toastify';
import {  CircularProgress } from "@mui/material";

const Styles = {
  contenuEtape: {
    fontSize: "18px",
    fontWeight: 400,
    lineHeight: "24px",
    textAlign: "left",
    color: "#003049",
  },
  ajouterActiviteButton: {
    width: "150px",
    height: "32px",
    gap: "0px",
    borderRadius: "10px 10px 10px 10px",
    border: "1px solid #003049",
    background: "#FFFFFF",
    color: "#003049",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "16px",
    textAlign: "center",
  },
  customSelect: {
    fontFamily: "Inter, sans-serif",
    height: "45px",
    width: "100%",
    padding: "10px",
    borderRadius: "15px",
    border: "0px solid #003049",
    backgroundColor: "#EEF5FC",
    outline: "none",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23003049'><path d='M7 10l5 5 5-5z'/></svg>`
    )}")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px top 50%",
    backgroundSize: "12px",
    cursor: "pointer",
    color: "#4D4D4D",
  },
  customTitle: {
    fontFamily: "Inter, sans-serif",
    fontSize: "18px",
    fontWeight: 400,
    lineHeight: "24px",
    textAlign: "left",
    color: "#212121",
  },
  rechercheButton: {
    fontFamily: "Inter, sans-serif",
    width: "100%",
    height: "48px",
    padding: "14px 32px 14px 32px",
    gap: "10px",
    borderRadius: "15px 15px 15px 15px",
    background: "linear-gradient(117.07deg, #003049 0%, #2094F3 301.94%)",
    color: "white",
  },
  annulerButton: {
    fontFamily: "Inter, sans-serif",
    border: "1px solid #D62828",
    borderRadius: "15px",
    backgroundColor: "#FFFFFF",
    color: "#D62828",
    height: "48px",
  },
  validerButton: {
    fontFamily: "Inter, sans-serif",
    background: "#003049",
    borderRadius: "15px",
    height: "48px",
  },
  Button_Link_Medium: {
    fontFamily: "Inter, sans-serif",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "20px",
    textAlign: "center",
  },
  rechercherText: {
    fontFamily: "Inter, sans-serif",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "20px",
    textAlign: "center",
    textTransform: "none",
  },
  annulerText: {
    fontFamily: "Inter, sans-serif",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "20px",
    textAlign: "center",
    color: "#D62828",
    textTransform: "none",
  },
  validerText: {
    fontFamily: "Inter, sans-serif",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "20px",
    textAlign: "center",
    textTransform: "none",
  },
  ajouterText: {
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "16px",
    textAlign: "center",
    color: "#003049",
    textTransform: "none",
  },
};

function Energie() {
  const [energieList, setEnergieList] = useState([
    {
      label: "Émissions indirectes liées à la consommation d'électricité",
      ind: 5,
      dialogOptions: [{ label: "Electricité", value: "Electricité" }],
      selectedOptions: [],
    },
    {
      label:
        "Émissions indirectes liées à la consommation d'énergie autre que l'électricité",
      ind: 6,
      dialogOptions: [
        {
          label: "Réseaux de chaleur / froid",
          value: "Réseaux de chaleur / froid",
        },
      ],
      selectedOptions: [],
    },
     
  ]);
  const [selectedEmissionIndex, setSelectedEmissionIndex] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [err, setError] = useState(null);
  const [data, setData] = useState("");
  const [category1, setCategory1] = useState("");
  const [category2, setCategory2] = useState("");
  const [category3, setCategory3] = useState("");
  const [nextLevelCategories, setnextLevelCategories] = useState([]);
  const [nextLevelCategories2, setnextLevelCategories2] = useState([]);
  const [fe, setFe] = useState();
  const handleCategory2 = async (event) => {
    try {
      setCategory1(event.target.value);
      setLoading(true)
      const url = "http://localhost:3000/api/categories/nextCategories";
      const { data: res } = await axios.post(url, {
        userSelectedCategories: [event.target.value],
      });
      setLoading(false)
      setnextLevelCategories(res.nextCategories);
      setFe(res.matchingDocuments); 
      setData([category1]);
    } catch (error) {
      setLoading(false)
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
      console.log(err);
    }
  };
  const handleCategory3 = async (event) => {
    try {
      setLoading(true)
      setCategory2(event.target.value);
      const url = "http://localhost:3000/api/categories/nextCategories";
      const { data: res } = await axios.post(url, {
        userSelectedCategories: [category1, event.target.value],
      });
      setLoading(false)
      setnextLevelCategories2(res.nextCategories);
      setData([category1, category2]);
      
    } catch (error) {
      setLoading(false)
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
      console.log(err);
    }
  };
  const handleFe = async (event) => {
    try {
      setLoading(true)
      setCategory3(event.target.value);
      const url = "http://localhost:3000/api/categories/nextCategories";
      const { data: res } = await axios.post(url, {
        userSelectedCategories: [category1, category2, event.target.value],
      });
      setLoading(false)
      setFe(res.matchingDocuments); 
      setData([category1, category2, category3]); 
    } catch (error) {
      setLoading(false)
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
      console.log(err);
    }
  };
  const handleClickOpen = (index, ind) => {
    setSelectedEmissionIndex(index);
    setOpenDialog(true);
    setIndice(ind);
  };
  const handleClose = () => {
    setOpenDialog(false);
  };
  const handleCheckboxChange = async (optionLabel, idElment) => {
    setSelectedOptions((prevOptions) => [...prevOptions, optionLabel]);
    setIdElment(idElment);
  };
  const handleValider = () => {
    const updatedEmissionsList = [...energieList];
    updatedEmissionsList[selectedEmissionIndex].selectedOptions.push(
      ...selectedOptions
    );
    setEnergieList(updatedEmissionsList);
    setSelectedOptions([]);
    setOpenDialog(false);
    setFe();
  };
  const SupprimerSelectedOption = (optionToRemove) => {
    const updatedEmissionsList = [...energieList];
    updatedEmissionsList[selectedEmissionIndex].selectedOptions =
      updatedEmissionsList[selectedEmissionIndex].selectedOptions.filter(
        (option) => option !== optionToRemove
      );
    setEnergieList(updatedEmissionsList);
  };
  const [indice, setIndice] = useState();
  const [idElment, setIdElment] = useState();
  const [Quantité, setQuantité] = useState(0);
  const handleChange = (e) => {
    setQuantité(Number(e.target.value)); //
  };
  const handleSave = async () => {
    const bilan = JSON.parse(localStorage.getItem("Bilan"));
    console.log("bilan", bilan);
    bilan.selectedCategoryElements[indice].push({
      quantity: Quantité,
      categoryElement: idElment,
    }); //{ "quantity": 3, "categoryElement": "66101ed3aad307245468b5e1" }
    localStorage.setItem("Bilan", JSON.stringify(bilan));
  };
  const [loading, setLoading] = useState(false);
  return (
    <div>
      {energieList.map((produit, index) => (
        <Box key={index} p={2} bgcolor={"#F0F2F7"} mb={2} borderRadius={4}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={12} md={9}>
              <Typography variant="h6" gutterBottom style={Styles.contenuEtape}>
                {produit.label}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3} sx={{ textAlign: "center" }}>
              <Button
                style={Styles.ajouterActiviteButton}
                onClick={() => handleClickOpen(index, produit.ind)}
              >
                <Typography style={Styles.ajouterText}>
                  Ajouter Activité
                </Typography>
              </Button>
            </Grid>
            {/* write code  */}
            <Grid item xs={12} md={12}>
              {produit.selectedOptions &&
                produit.selectedOptions.length > 0 && (
                  <Grid style={{ marginTop: "15px" }}>
                    {produit.selectedOptions.map((option, optionIndex) => (
                      <Grid
                        key={optionIndex}
                        container
                        sx={{
                          border: "1px solid black",
                          borderRadius: "15px",
                          marginBottom: "15px",
                          padding: "20px",
                          borderColor: "#6F6C8F",
                        }}
                      >
                        <Grid item md={12}>
                          <Grid container>
                            <Grid
                              item
                              xs={12}
                              md={12}
                              sx={{
                                marginBottom: "15px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                key={optionIndex}
                                style={Styles.contenuEtape}
                              >
                                {option}
                              </Typography>
                              <CroixIcon
                                onClick={() => SupprimerSelectedOption(option)}
                              />
                            </Grid>
                            <Grid
                              item
                              md={1.6}
                              xs={12}
                              container
                              alignItems="center"
                              style={{ marginTop: "-8px" }}
                            >
                              <Typography style={Styles.contenuEtape}>
                              {option.split(",")[1].split("/")[1]?"Quantité " + option.split(",")[1].split("/")[1] + ":":""}
                              </Typography>
                            </Grid>

                            <Grid item xs={12} md={10.4}>
                              <TextField
                                type="number"
                                variant="outlined"
                                fullWidth
                                sx={{
                                  borderRadius: "15px",
                                  mt: 1,
                                  mb: 2,
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#969696 !important", // Couleur de la bordure
                                    borderRadius: "15px",
                                  },
                                  "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#969696 !important", // Couleur de la bordure en survol
                                    borderRadius: "15px",
                                  },
                                  "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderColor: "#969696 !important", // Couleur de la bordure en focus
                                      borderRadius: "15px",
                                    },
                                }}
                                onChange={handleChange}
                              />
                              <Button
                                variant="contained"
                                href="#contained-buttons"
                                onClick={handleSave}
                              >
                                save
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                )}
            </Grid>
          </Grid>
        </Box>
      ))}

      <Dialog
        open={openDialog}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        borderRadius={15}
      >
        <DialogContent>
          <Grid
            container
            spacing={2}
            sx={{ paddingLeft: "16px", paddingRight: "16px" }}
          >
            {selectedEmissionIndex !== null && (
              
              <Grid item xs={12} md={12}>
                <Typography variant="h6" style={Styles.customTitle}>
                  Catégorie 1
                </Typography>
                <select
                  style={{ ...Styles.customSelect, width: "100%" }}
                  onChange={handleCategory2}
                >
                  <option disabled selected>
                    Selectionner une catégorie
                  </option>
                  {energieList[selectedEmissionIndex].dialogOptions.map(
                    
                    (option, index) => (
                       
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    )
                  )}
                </select>
              </Grid>
            )}
            <Grid item xs={12} md={12}>
              <Typography variant="h6" style={Styles.customTitle}>
                Catégorie 2
              </Typography>
              <select
                style={{ ...Styles.customSelect, width: "100%" }}
                onChange={handleCategory3}
              >
                <option disabled selected>
                  Selectionner une catégorie
                </option>
                {nextLevelCategories.map((index) => (
                  <option key={index} value={index}>
                    {index}
                  </option>
                ))}
              </select>
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography variant="h6" style={Styles.customTitle}>
                Catégorie 3
              </Typography>
              <select
                style={{ ...Styles.customSelect, width: "100%" }}
                onChange={handleFe}
              >
                <option disabled selected>
                  Selectionner une catégorie
                </option>
                {nextLevelCategories2.map((index) => (
                  <option key={index} value={index}>
                    {index}
                  </option>
                ))}
              </select>
            </Grid>

            <Grid item xs={12} md={12}>
              <Button style={Styles.rechercheButton}>
                <Typography style={Styles.rechercherText}>
                  Rechercher
                </Typography>
              </Button>
            </Grid>
            <Grid
              item
              xs={12}
              md={12}
              style={{ overflow: "auto", backgroundColor: "#F2F4F8" }}
            >
              <Paper
                elevation={0}
                style={{
                  height: "150px",
                  borderRadius: "15px",
                  padding: "20px",
                  backgroundColor: "#F2F4F8",
                }}
              >
                <FormControl>
                  <FormLabel>Emissions Fe</FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue={""} // Assuming selectedOption is the state for the selected radio button
                    name="radio-buttons-group"
                    onChange={(event) =>
                      handleCheckboxChange(
                        event.target.labels[0].innerText,
                        event.target.value
                      )
                    }
                  >
                    {loading && <CircularProgress />}
                    {fe &&
                      fe.map((item, index) => {
                          
                            const displayName = item["Nom base français"]  ;
                          const unity= item.unity || item["Unité français"]
                          const idEle = item.id || item["Identifiant de l'élément"]
                          const nameAttr=item["Nom attribut français"]
                          const tags=item["Tags français"]
                          const type=item["Type Ligne"]
                          let country = item["Sous-localisation géographique français"]
                          
                          if(!country){
                            country=""
                          }
                            return (
                               type== "Elément" &&
                              (
                              
                              <FormControlLabel
                                key={index}
                                value={item._id} // Adjust this value as needed
                                control={<Radio />} // Using Radio component here
                                label={
                                  country + "- " +
                                  displayName +
                                  ", " +
                                  unity +
                                  ", " +
                                  nameAttr +
                                  
                                  ", " +
                                 
                                  tags
                                } // Adjust this label as needed
                              />)
                            ); 
                        })}
                  </RadioGroup>
                </FormControl>
              </Paper>
            </Grid>
            <Grid item xs={12} md={12}>
              <Grid container spacing={3}>
                <Grid item xs={6} md={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    style={{ ...Styles.annulerButton }}
                    onClick={handleClose}
                  >
                    <Typography style={Styles.annulerText}>Annuler</Typography>
                  </Button>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    style={{ ...Styles.validerButton }}
                    onClick={handleValider}
                  >
                    <Typography style={Styles.validerText}>Valider</Typography>
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Energie;
