import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backg from "../../public/section-vector.png"
import Navbar from "../landingPage/Navbar";

function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [redPass, setRedPass] = useState(false);
  const [redEmail, setRedEmail] = useState(false);

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
    setRedEmail(false);
    setRedPass(false);
  };
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const toggle = () => {
    setShow(!show);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:3000/api/clients/login";
      const { data: res } = await axios.post(url, data);
      
      if (res.clientId) {
        await axios.get(`http://localhost:3000/api/clients/profile`, {
          headers: {
            'clientId': res.clientId,
            'Authorization': `Bearer ${res.token}`
          }
        })
          .then(response => {
            console.log("respo-->",response)

            localStorage.removeItem("token");
            localStorage.setItem("token", res.token); 
            localStorage.setItem("clientId", res.clientId);
            localStorage.setItem("isConnected", true);
                        
            const isAdmin = response.data.isAdmin;
            if(isAdmin){
              // navigate("/admin/utilisateurs");
              navigate("/calculateur");
              return;
            }
            navigate("/rapport");
            
          })
          .catch(error => {
            console.error("There was an error fetching the client data!", error);
          });
      }
      
      
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);

        if (error.response.status === 404) {
          setRedEmail(true);
        } else if (error.response.status === 401) {
          setRedPass(true);
        }
      }
    }
  };
  return (

    <><Navbar />
    <div className="realtive font-['Inter']">
      <img
        src={backg}
        className="absolute max-w-full w-[100%]"
        alt="SVG Image"
      ></img>
      <div className="absolute w-full h-full ">
        <div className="  mx-auto mt-[22vh]    w-[30%] h-[68%]  bg-[white]  rounded-[15px] shadow-[0px_0px_30px_-15px]">
          <div className="text-center text-neutral-800 h-[10vh] text-[4.8vh] font-bold font-['Eudoxus Sans'] pt-[4vh]">
            Se connecter
          </div>
          <br /><br />
          {/* formulaire  */}
          <form className="" onSubmit={handleSubmit}>
            <div className="flex flex-col  justify-center items-center">
              <div
                className={redEmail
                  ? "w-[84%] h-[8vh] mb-[3vh]  px-5  rounded-1vh] border border-red-500 flex-col justify-center items-start flex"
                  : "w-[84%] h-[8vh] mb-[3vh]  px-5  rounded-[1vh] border border-slate-900 flex-col justify-center items-start flex"}
              >
                <div className="  flex-col  justify-center  items-start flex">
                  <div className=" w-[50%] text-neutral-500  leading-none font-sans   text-[1.9vh] font-normal  ">
                    Email d’utilisateur
                  </div>

                  <div className="w-[60vh]  justify-start items-center inline-flex">
                    <div className="text-neutral-500  font-normal  ">
                      <input
                        className="text-[2.6vh]  font-sans outline-none  focus:border-none focus:outline-none "
                        type="email"
                        name="email"
                        placeholder="exemple@domain.com"
                        onChange={handleChange}
                        value={data.email}
                        required />
                    </div>
                  </div>
                  {error && (
                    <div className="w-[370px] text-sm bg-[#f34646] text-[white] text-center mx-0 my-[5px] p-[15px] rounded-[5px]">
                      {error}
                    </div>
                  )}
                </div>
              </div>

              <div
                className={redPass
                  ? "w-[84%] h-[8vh]  px-5  rounded-[1vh] border border-red-500"
                  : "w-[84%] h-[8vh]  px-5  rounded-[1vh] border border-slate-900"}
              >
                <div className=" w-[10%] float-right h-[100%] flex justify-center ">
                  <img
                    className="w-[70%] my-[auto] h-[70%] cursor-pointer"
                    src={show ? "Eye.svg" : "eye-off.svg"}
                    alt="toggle"
                    onClick={toggle}
                  ></img>
                </div>
                <div className=" w-[90%] h-[100%] flex-col justify-center items-start flex">
                  <div className="  w-[50%]  text-neutral-500  leading-6 font-sans   text-[1.9vh] font-normal ">
                    Mot de passe
                  </div>

                  <div className="  pb-[1vh] w-full  justify-start items-center flex">
                    <div className="text-neutral-500 w-full text-sm font-normal  ">
                      <input
                        className="text-[2.6vh]  font-sans w-[100%]  focus:outline-none  "
                        type={show ? "text" : "password"}
                        name="password"
                        placeholder="Doit contenir au moins 8 caractères"
                        onChange={handleChange}
                        value={data.password}
                        required />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[82%] h-[4vh] mb-[3vh] justify-between items-center flex">
                <div className="text-red-500 w-[50%] text-[1.9vh] font-sans font-normal   ">
                  {redEmail
                    ? "Cet Email n’exist pas"
                    : redPass
                      ? "Mot de passe incorrect"
                      : ""}
                </div>
                <a
                  href="/forgetpassword"
                  className="text-right w-[50%]  text-sky-600 text-[1.9vh] font-sans font-normal  "
                >
                  Mot de passe oublié
                </a>
              </div>
              <div className="w-full">
                <button type="submit" className="w-full">
                  <div className="w-[84%] h-[5vh] hover:bg-[#023559] duration-[0.3s]      bg-sky-950 rounded-[1vh] justify-center items-center gap-2.5 inline-flex">
                    <div className="text-center text-white text-[2vh]  font-['Inter sans'] ">
                      Se connecter
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </form>
          <div className="flex justify-center mt-[4vh]">
            <span className="text-neutral-800 text-[1.8vh]   ">
              Vous n’avez pas encore de compte ?{" "}
            </span>
            <a href="/signup">
              {" "}
              <span className="text-sky-600  text-[1.8vh]  ">
                &nbsp;S’inscrire
              </span>
            </a>
          </div>
        </div>
      </div>
    </div></>
  );
}

export default Login;
