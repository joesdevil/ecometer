import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AccueilIcon from "./AcceuilIcon";
import CalculateurIcon from "./CalculateurIcon";
import RapportIcon from "./RapportIcon";
import ObjectifIcon from "./ObjectifIcon";
import LogoutIcon from "./LogoutIcon";
import { useNavigate, useLocation } from "react-router-dom";
import Ecometer from "../../landingPage/Ecometer";

// const ecometerTextStyle = {
//   fontFamily: 'Inter',
//   fontSize: '25px',
//   fontWeight: 700,
//   lineHeight: '24px',
//   textAlign: 'center',
//   color: '#fff'
// };

const accessTextStyle = {
  fontFamily: "Eudoxus , sans-serif",
  fontSize: "20px",
  fontWeight: 500,
  lineHeight: "30px",
  textAlign: "left",
  color: "#fff",
};

const listItemTextStyle = {
  fontFamily: "Inter",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  textAlign: "left",
  color: "#fff",
};

const listItemStyle = {
  paddingLeft: "32px",
  marginBottom: "10px",
};

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleListItemClick = (path) => {
    navigate(path);
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Grid container style={{ height: "100%", backgroundColor: "#003049" }}>
      <Grid item xs={12}>
        <div className="h-[2%]"></div>
        <Ecometer />
        <Typography
          variant="h6"
          gutterBottom
          style={accessTextStyle}
          marginLeft={"35px"}
          marginTop={"56px"}
          marginBottom={"20px"}
        >
          Accès Rapide
        </Typography>
        <List component="nav" aria-label="icon list">
          <ListItem
            button
            selected={location.pathname === "/"}
            style={listItemStyle}
            onClick={() => handleListItemClick("/acceuil")}
          >
            <ListItemIcon style={{ color: "#fff" }}>
              <AccueilIcon />
            </ListItemIcon>
            <ListItemText primary="Accueil" style={listItemTextStyle} />
          </ListItem>
          <ListItem
            button
            selected={location.pathname === "/calculateur"}
            style={listItemStyle}
            onClick={() => handleListItemClick("/calculateur")}
          >
            <ListItemIcon style={{ color: "#fff" }}>
              <CalculateurIcon />
            </ListItemIcon>
            <ListItemText primary="Calculateur" style={listItemTextStyle} />
          </ListItem>
          <ListItem
            button
            selected={location.pathname === "/rapport"}
            style={listItemStyle}
            onClick={() => handleListItemClick("/rapport")}
          >
            <ListItemIcon style={{ color: "#fff" }}>
              <RapportIcon />
            </ListItemIcon>
            <ListItemText primary="Rapport" style={listItemTextStyle} />
          </ListItem>
          <ListItem button style={listItemStyle}>
            <ListItemIcon style={{ color: "#fff" }}>
              <ObjectifIcon />
            </ListItemIcon>
            <ListItemText primary="Objectifs" style={listItemTextStyle} />
          </ListItem>
        </List>
      </Grid>
      {/* ListItem "Déconnexion" */}
      <Grid
        item
        xs={12}
        style={{ position: "absolute", bottom: "50px", width: "100%" }}
      >
        <div
          style={{ ...listItemStyle, display: "flex", alignItems: "center" }}
        >
          <ListItemIcon style={{ color: "#fff" }}>
            <div
              className="cursor-pointer
              "
              onClick={handleLogout}
            >
              <LogoutIcon />
            </div>
          </ListItemIcon>
          <ListItemText
            className="cursor-pointer "
            onClick={handleLogout}
            primary="Se déconnecter"
            style={{ ...listItemTextStyle, marginLeft: "8px" }}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default SideBar;
