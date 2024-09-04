import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Home from "./landingPage/Home";
import Login from "./logIn/Login";
import Signup from "./signUp/Signup";
import Calculateur from "./Auth/Pages/Calculateur.jsx";
import Acceuil from "./Auth/Pages/Accueil.jsx";
import Rapport from "./Auth/Pages/Rapport.jsx";
import Forgetpassword from "./logIn/Forgetpassword.jsx";
import Verf from "./logIn/Verf.jsx";
import Utilisateurs from "./admin/pages/Utilisateurs.jsx";
import Basededonnees from "./admin/pages/Basededonnees.jsx";
import ModifierCollection from "./admin/pages/ModifierCollection.jsx";
import "./App.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

// Centralize the authentication logic
const RequireAuth = ({ children }) => {
  const isConnected = localStorage.getItem("isConnected");

  if (!isConnected) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <>
     <ToastContainer />
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgetpassword" element={<Forgetpassword />} />
              <Route path="/verf" element={<Verf />} />
              <Route
                path="/acceuil"
                element={
                  <RequireAuth>
                    <Acceuil />
                  </RequireAuth>
                }
              />
              <Route
                path="/calculateur"
                element={
                  <RequireAuth>
                    <Calculateur />
                  </RequireAuth>
                }
              />
              <Route
                path="/rapport"
                element={
                  <RequireAuth>
                    <Rapport />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/utilisateurs"
                element={
                  <RequireAuth>
                    <Utilisateurs />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/bdd"
                element={
                  <RequireAuth>
                    <Basededonnees />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/bdd/modifier"
                element={
                  <RequireAuth>
                    <ModifierCollection />
                  </RequireAuth>
                }
              />
            </Routes>
          </ThemeProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
