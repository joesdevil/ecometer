import React from "react";
import { useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import { MuiOtpInput } from "mui-one-time-password-input";
import { toast } from 'react-toastify';
import {  CircularProgress } from "@mui/material";


function Verf() {
  const [otp, setOtp] = React.useState("");
  const token = localStorage.getItem("token");
  console.log(token);

  const handleChange = (newValue) => {
    setOtp(newValue);
  };

  const navigate = useNavigate();

  function matchIsNumeric(text) {
    const isNumber = typeof text === "number";
    const isString = matchIsString(text);
    return (isNumber || (isString && text !== "")) && !isNaN(Number(text));
  }

  function matchIsString(text) {
    return typeof text === "string";
  }
  const validateChar = (value) => {
    return matchIsNumeric(value);
  };

  const handleVerification = async () => {
    setLoading(true)
    try {
      // Set the Authorization header with the token
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      

      const response = await axios.post(
        "http://localhost:3000/api/clients/verify-email",
        { otp: otp },
        { headers: headers }
      );
      console.log("verification response:", response.data);
      localStorage.setItem("verifiedEmail", true);
      setLoading(false)
      navigate("/acceuil");
    } catch (error) {
      // Handle any errors
      console.error("Error during verification:", error);
      toast.error("Error during verification")
      setLoading(false)
    }
  };
  const [loading, setLoading] = useState(false);
  return (
    <div className="realtive font-['Inter']">
      <img
        src="/Vector2.svg"
        className="absolute max-w-full w-[100%]"
        alt="SVG Image"
      ></img>
      <div className="absolute w-full h-full  ">
        <div className="  mx-auto mt-[22vh] w-[35%] h-[62%]  bg-[white]  rounded-[15px] shadow-[0px_0px_30px_-15px]">
          <div className="text-center text-neutral-800 w-full h-[20%] text-[4.8vh] font-bold font-['Eudoxus Sans'] pt-[4vh]">
            Vérification
          </div>
          {loading && <CircularProgress />}
          <div className="text-center text-neutral-800 w-[86%] mx-auto  h-[25%] text-[2.2vh] font-bold font-['Eudoxus Sans'] pt-[4vh]">
            Saisissez votre code à 6 chiffres que vous avez reçu sur votre
            email.
          </div>
          <div className="w-full flex justify-center">
            <MuiOtpInput
              className="w-4/5 "
              length={6}
              value={otp}
              onChange={handleChange}
              validateChar={validateChar}
            />
          </div>

          <div className="h-[10%] text-orange flex justify-center items-center leading-9"></div>

          <button
            onClick={handleVerification}
            type="submit"
            className=" w-full"
          >
            <div className="w-[84%]  hover:bg-[#023559] duration-[0.3s]   hover:rounded-[1.8vh] h-[8vh]  bg-sky-950 rounded-[2vh] justify-center items-center gap-2.5 inline-flex">
              <div className="text-center text-white text-[3vh]  font-['Inter sans'] ">
                Se connecter
              </div>
            </div>
            <div className="flex justify-center mt-[1vh]">
              <span className="text-neutral-800 text-[2.6vh]   ">
                Si vous n'avez pas reçu de code !{" "}
              </span>
              <a href="/">
                {" "}
                <span className="text-sky-600  text-[2.6vh]  ">
                  &nbsp;Renvoyer
                </span>
              </a>
            </div>
          </button>
          
        </div>
      </div>
      
    </div>
  );
}

export default Verf;
