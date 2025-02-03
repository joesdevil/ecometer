import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import {  CircularProgress } from "@mui/material";
import Navbar from "../landingPage/Navbar";

import backg from "../../public/section-vector.png"

// the sign up fonction
function Signup() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    numberOfEmployees: 0,
    industry: "",
    address: "",
    numberOfLocations: 0,
    structure: "",
    profilePicture: "",
    number:"",
    purpose:"",
    message:"",
    conf1:false,
    conf2:false,
  });

  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(true);
  const [imageInputState, setImageInputState] = useState("");

  const [ selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
      setData({ ...data, profilePicture: reader.result });
      setSelectedImage(reader.result); // Update the selected image preview
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    // Check if passwords match when confirm password changes
    setConfirmPassword(e.target.value === data.password);
  };

  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };
  function useSecteur(Type) {
    if (Type === "Association" || Type === "Entreprise") {
      return [
        "Administration",
        "Agriculture et forêts",
        "Banque / assurance",
        "BTP",
        "Commerce et distribution",
        "Eau et déchets",
        "Enseignement",
        "Industries agroalimentaires",
        "Industries chimiques et pharmaceutiques",
        "Industries de l'énergie",
        "Industries lourdes",
        "Industries manufacturières divers",
        "Information et communication",
        "Santé et action sociale",
        "Services divers",
        "Transport et logistique",
      ];
    } else {
      return [];
    }
  }
  const Secteur = useSecteur(data.structure);

  const TypedeStr = [
    "Association",
    "Collectivité territoriale",
    "Établissement public",
    "État",
    "Entreprise",
  ];




  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        return;
      }
      setLoading(true)
      const url = "http://localhost:3000/api/clients/register";
      const { data: res } = await axios.post(url, data);
    
      setLoading(false)
      navigate("/verf");
      

      // store the token generated from the signup
      localStorage.setItem("token",res.token);

    } catch (error) {
      
      setLoading(false)
      if(error.response.data.error.errors){
        for (const err of Object.values(error.response.data.error.errors)) {
          console.log("errors -->", err);
          toast.error(err.message);
      }
      
        
      }else{
        console.log("->error",error.response)
        toast.error(error.message)
      }
      
      
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        toast.error(error.response.data.message)
        setError(error.response.data.message);
      }
    }
  };
  const [loading, setLoading] = useState(false);

  return (
    <>
    <Navbar />
    <div className="realtive font-['Inter']  " style={{height:150+"vh"}}>
    <img
          src={backg}
          className="absolute max-w-full w-[100%] "
          alt="SVG Image"
        ></img>

    
       

        <div className="absolute w-full h-[130%] flex items-center  " style={{marginTop:80+"px"}}>
          <div className="  mx-auto     w-[70%] h-[90%]  bg-[white]  rounded-[15px] shadow-[0px_0px_30px_-15px]">
            <div
              id="title"
              className="h-[12%] pt-[1vh] flex-col flex justify-center items-center"
            >
              <div className="pt-[1vh] text-[4.8vh] text-neutral-800 font-bold font-['Eudoxus Sans'] leading-9  ">
                S’inscrire
              </div>
              <div className="text-[1.9vh]  font-sans ">
                Creation de Compte
              </div>
            </div>

            <div className="h-[85%] border-solid  w-full">
              <form className="flex w-full h-full" onSubmit={handleSubmit}>
                <div id="left" className="w-1/2   h-full">
                  <div
                    id="every"
                    className="h-[80px] mb-3 w-full  flex justify-center items-center"
                  >
                    <div className="w-[84%] h-[100%] rounded-[1vh] border border-slate-900 flex-col justify-center items-start flex">
                      <div className="  flex-col w-full  justify-center  items-start flex">
                        <div className="pl-[2vh] mb-[0.3vh] w-full text-neutral-800     leading-none font-sans   text-[1.9vh] font-normal  ">
                          Nom de l’organisation
                        </div>

                        <div className=" pl-[2vh]  w-full  justify-start items-center inline-flex">
                          <div className="text-neutral-500 w-full  font-normal  ">
                            <input
                              className=" w-[97%] text-[2.2vh]  font-sans  focus:border-none focus:outline-none "
                              type="text"
                              name="name"
                              placeholder="Exemple: CRD"
                              onChange={handleChange}
                              value={data.name}
                              required />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*  ----------------------*/}
                  <div
                    id="every"
                    className="h-[80px] mb-3 mb-3 w-full  flex justify-center items-center"
                  >
                    <div className="w-[84%] h-[100%] rounded-[1vh] border border-slate-900 flex-col justify-center items-start flex">
                      <div className="  flex-col w-full  justify-center  items-start flex">
                        <div className="pl-[2vh] mb-[0.3vh] w-full text-neutral-800     leading-none font-sans   text-[1.9vh] font-normal  ">
                          Adresse
                        </div>

                        <div className=" pl-[2vh]  w-full  justify-start items-center inline-flex">
                          <div className="text-neutral-500 w-full  font-normal  ">
                            <input
                              className=" w-[97%] text-[2.2vh]  font-sans  focus:border-none focus:outline-none "
                              type="text"
                              name="address"
                              placeholder="Exemple: 16309, Oued-Smar, El-Harrach, Alger"
                              onChange={handleChange}
                              value={data.address}
                              required />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*  ----------------------*/}
                  <div
                    id="every"
                    className="h-[80px] mb-3 mb-3 w-full  flex justify-center items-center"
                  >
                    <div className="w-[84%] h-[100%] rounded-[1vh] border border-slate-900 flex-col justify-center items-start flex">
                      <div className="  flex-col w-full justify-center  items-start flex">
                        <div className="pl-[2vh] mb-[0.3vh] w-full text-neutral-800     leading-none font-sans   text-[1.9vh] font-normal  ">
                          Email
                        </div>

                        <div className=" pl-[2vh] w-full justify-start items-center inline-flex">
                          <div className="  w-full   text-neutral-500  font-normal  ">
                            <input
                              className=" w-[97%]   text-[2.2vh]  font-sans  focus:border-none focus:outline-none "
                              type="email"
                              name="email"
                              placeholder="exemple@domain.com"
                              onChange={handleChange}
                              value={data.email}
                              required />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*  ----------------------*/}
                  <div
                    id="every"
                    className="h-[80px] mb-3 mb-3 w-full  flex justify-center items-center"
                  >
                    <div className="w-[84%] h-[100%] rounded-[1vh] border border-slate-900 flex-col justify-center items-start flex">
                      <div className="  flex-col w-full justify-center  items-start flex">
                        <div className="pl-[2vh] mb-[0.3vh] w-full text-neutral-800     leading-none font-sans   text-[1.9vh] font-normal  ">
                          Numéro Teléphone
                        </div>

                        <div className=" pl-[2vh] w-full justify-start items-center inline-flex">
                          <div className="  w-full   text-neutral-500  font-normal  ">
                            <input
                              className=" w-[97%]   text-[2.2vh]  font-sans  focus:border-none focus:outline-none "
                              type="text"
                              name="number"
                              placeholder="+213 555 555 555"
                              onChange={handleChange}
                              value={data.number}
                              required />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                 
                  {/*  ----------------------*/}
                  {/* <div
                    id="every"
                    className="h-[80px] mb-3 mb-3 w-full  flex justify-center items-center"
                  >
                    <div className="w-[84%] h-[100%] rounded-[1vh] border border-slate-900 flex-col justify-center items-start flex">
                      <div className="  flex-col w-full  justify-center  items-start flex">
                        <div className="pl-[2vh] mb-[0.3vh] w-full text-neutral-800     leading-none font-sans   text-[1.9vh] font-normal  ">
                          Mot de passe
                        </div>

                        <div className=" pl-[2vh] w-full  justify-start items-center inline-flex">
                          <div className="  w-full  text-neutral-500  font-normal  ">
                            <input
                              className=" w-[97%]    text-[2.2vh]  font-sans  focus:border-none focus:outline-none "
                              type="password"
                              name="password"
                              placeholder="Doit contenir au moins 8 caractères"
                              onChange={handleChange}
                              value={data.password}
                              required />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*  ---------------------- 

                  <div
                    id="every"
                    className="h-[80px] mb-3 mb-3 w-full  flex justify-center items-center"
                  >
                    <div className="w-[84%] h-[100%] rounded-[1vh] border border-slate-900 flex-col justify-center items-start flex">
                      <div className="  flex-col w-full justify-center  items-start flex">
                        <div className="pl-[2vh] mb-[0.3vh] w-full text-neutral-800     leading-none font-sans   text-[1.9vh] font-normal  ">
                          Confirmer le mot de passe
                        </div>

                        <div className=" pl-[2vh] w-full justify-start items-center inline-flex">
                          <div className="   w-full   text-neutral-500  font-normal  ">
                            <input
                              className="    w-[97%]  text-[2.2vh]  font-sans  focus:border-none focus:outline-none "
                              type="password"
                              name="confirmPassword"
                              onChange={handleConfirmPasswordChange}
                              placeholder="Doit contenir au moins 8 caractères" />
                          </div>
                        </div>
                        {error && (
                          <div className="w-[370px] text-sm bg-[#f34646] text-[white] text-center mx-0 my-[5px] p-[15px] rounded-[5px]">
                            {error}
                          </div>
                        )}
                      </div>
                    </div>
                  </div> */}


                <div id="every"
                    className="h-[80px] mb-3 w-full  flex justify-center items-center"
                  >
                    <div className="w-[84%] h-[100%] rounded-[1vh] border border-slate-900 flex-col justify-center items-start flex">
                      <div className=" relative flex-col w-full  justify-center  items-center flex">
                        <select

                          className="outline-none appearance-none w-[96%]"
                          onChange={handleChange}
                          name="purpose"
                          value={data.purpose}
                          required
                        >
                          <option selected>
                            Vous recherchez de
                          </option>
                          <option value="formation">
                            formation
                          </option>
                          <option value="bilan de carbon">
                            bilan de carbon
                          </option>
                          <option value="autre">
                            autre
                          </option>

                        </select>
                        <img
                          src="/Down.svg"
                          className="absolute pointer-events-none right-[5%] max-w-full"
                          alt="SVG Image"
                        ></img>
                      </div>
                    </div>
                  </div>
                  {/* ------- */}
                  <div
                    id="every"
                    className="h-[200px] mb-3 mb-3 w-full  flex justify-center items-center"
                  >
                    <div className="w-[84%] h-[100%] rounded-[1vh] border border-slate-900 flex-col justify-center items-start flex">
                      <div className="  flex-col w-full justify-center  items-start flex">
                        <div className="pl-[2vh] mb-[0.3vh] w-full text-neutral-800     leading-none font-sans   text-[1.9vh] font-normal  ">
                          Message
                        </div>

                        <div className=" pl-[2vh] w-full justify-start items-center inline-flex">
                          <div className="   w-full   text-neutral-500  font-normal  ">
                            <textarea
                              className="    w-[97%]  text-[2vh]  font-sans  focus:border-none focus:outline-none "

                              name="message"
                              onChange={handleChange}
                              value={data.message}
                              placeholder="Doit contenir au moins 8 caractères" />
                          </div>
                        </div>
                        {error && (
                          <div className="w-[370px] text-sm bg-[#f34646] text-[white] text-center mx-0 my-[5px] p-[15px] rounded-[5px]">
                            {error}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
                <div id="left" className="w-1/2  h-full">
                  <div className="w-full h-[40%]  flex justify-center items-center">
                    <div className="  w-[23vh] h-[23vh] bg-rose-300 rounded-full flex justify-center items-center cursor-pointer" onClick={() => document.getElementById('imageInput').click()}>
                      {!selectedImage ?
                        (<img
                          src="/camera.svg"
                          className="max-w-full h-[6vh] "
                          alt="SVG Image"
                        ></img>) : (<img
                          src={selectedImage}
                          className="min-w-full min-h-full rounded-full"
                          alt="SVG Image"
                        ></img>)}
                      <input type="file" name="image" className="hidden" id="imageInput" onChange={handleImageChange} />
                    </div>
                  </div>
                  <div className="w-full h-[80px] mb-3 mb-3  flex justify-center items-center">
                    <div className="w-[84%]  h-[100%] flex justify-between ">
                      <div className="h-full w-[48.5%]  rounded-[1vh] border border-slate-900 flex-col justify-center items-start flex">
                        <div className="pl-[2vh] mb-[0.3vh] w-full text-neutral-800     leading-none font-sans   text-[1.9vh] font-normal  ">
                          Nombre d’employés
                        </div>

                        <div className=" pl-[2vh]  w-full  justify-start items-center inline-flex">
                          <div className="text-neutral-500 w-full  font-normal  ">
                            <input
                              className=" w-[97%] text-[2.2vh]  font-sans  focus:border-none focus:outline-none "
                              type="number"
                              name="numberOfEmployees"
                              placeholder="Exemple: 100"
                              onChange={handleChange}
                              value={data.numberOfEmployees}
                              required />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                  <div
                    id="every"
                    className="h-[80px] mb-3 mb-3 w-full  flex justify-center items-center"
                  >
                    <div className="w-[84%] h-[100%] rounded-[1vh] border border-slate-900 flex-col justify-center items-start flex">
                      <div className=" relative flex-col w-full  justify-center  items-center flex">
                        <select
                          name="structure"
                          className=" outline-none   border-none appearance-none w-[96%]"
                          onChange={handleChange}
                          value={data.structure}
                          required
                        >
                          <option disabled selected>
                            Type de structure
                          </option>
                          {TypedeStr.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                        <img
                          src="/Down.svg"
                          className="absolute pointer-events-none right-[5%] max-w-full"
                          alt="SVG Image"
                        ></img>
                      </div>
                    </div>
                  </div>
                  <div
                    id="every"
                    className="h-[80px] mb-3 mb-3 w-full  flex justify-center items-center"
                  >
                    <div className="w-[84%] h-[100%] rounded-[1vh] border border-slate-900 flex-col justify-center items-start flex">
                      <div className=" relative flex-col w-full  justify-center  items-center flex">
                        <select
                          disabled={!Secteur.length}
                          className="outline-none appearance-none w-[96%]"
                          onChange={handleChange}
                          value={data.industry}
                          name="industry"
                          required
                        >
                          <option disabled selected>
                            Secteur d’activité
                          </option>
                          {Secteur.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                        <img
                          src="/Down.svg"
                          className="absolute pointer-events-none right-[5%] max-w-full"
                          alt="SVG Image"
                        ></img>
                      </div>
                    </div>
                  </div>




                  <div
                    id="every"
                    className="h-[80px] mb-3 mb-3 w-full  flex justify-center items-center"
                  >
                    <div className="w-[84%] h-[100%] rounded-[1vh]   flex-col justify-center items-start flex">
                      <div className="  flex-col w-full justify-center  items-start flex">


                        <div className=" pl-[2vh] w-full justify-start items-center inline-flex">
                          <div className="   w-full   text-neutral-500  font-normal  ">
                            <input type="checkbox" name="conf1" id="" onChange={handleChange} value={data.conf1} />
                            confidentialité
                          </div>


                          <div className="   w-full   text-neutral-500  font-normal  ">
                            <input type="checkbox" name="conf2" id="" onChange={handleChange} value={data.conf2} />
                            confidentialité 2
                          </div>
                        </div>
                        {error && (
                          <div className="w-[370px] text-sm bg-[#f34646] text-[white] text-center mx-0 my-[5px] p-[15px] rounded-[5px]">
                            {error}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

<br />
                  <div className="h-[10%] w-[96%] justify-end flex  ">
              <button type="submit" href="" className="no-underline h-[60%] bg-[#003049] text-[white] text-[2vh]  font-normal  px-[4.5vh]  rounded-[1vh] border-[none]">
                Confimer
              </button>
              {loading && <CircularProgress />}
            </div>
                </div>
                
              </form>
            </div>

            
          </div>
        </div>
     
    </div></>
  );
}

export default Signup;
