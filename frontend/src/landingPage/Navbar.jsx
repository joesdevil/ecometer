import Ecometer from "./Ecometer"
import logo from "../../public/calec1.png"

function Navbar() {
 
  return (
    // <nav className="{ /*`${fix ? " sticky top-0 " : ""}`"} */ ">
    <header className=" bg-slate-90  text-[white] w-full h-[18vh] flex m-0 p-0" style={{position:"absolute",top:0,zIndex:99}}>
      <div className="w-[8%]"> </div>
      <div className="flex justify-between   w-[44%] items-center ">
        <a href="/">
          <Ecometer />
        </a>
        <a
          href="/"
          className="no-underline pt-[0.6vh]  font-normal  leading-normal font-[Arial] text-[2.8vh] visited:text-[rgba(242,243,239,0.315)"
        >
          Accueil
        </a>
        <a
          href="/fonctionnement"
          className="no-underline pt-[0.6vh] font-extralight text-[2.8vh] visited:text-[rgba(242,243,239,0.315)"
        >
          Fonctionnement
        </a>
        <a
          href="/propos"
          className="no-underline pt-[0.6vh] font-extralight text-[2.8vh] visited:text-[rgba(242,243,239,0.315)"
        >
          À propos
        </a>
        
        <a
          href="/faq"
          className="no-underline pt-[0.6vh] font-extralight text-[2.8vh] visited:text-[rgba(242,243,239,0.315)"
        >
          FAQ
        </a>
      </div>
      <div className="w-[16.5%]"> </div>
      <div className="flex w-[30%] items-center justify-center">
      <img
            className=" max-w-full w-[50%] "
            src={logo}
            alt="SVG Image"
          ></img>
      </div>
    </header>
    // </nav>
  );
}

export default Navbar;
