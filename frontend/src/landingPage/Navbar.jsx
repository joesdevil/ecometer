import Ecometer from "./Ecometer"

function Navbar() {
 
  return (
    // <nav className="{ /*`${fix ? " sticky top-0 " : ""}`"} */ ">
    <header className=" bg-slate-90  text-[white] w-full h-[18vh] flex m-0 p-0">
      <div className="w-[8%]"> </div>
      <div className="flex justify-between   w-[44%] items-center ">
        <a href="/">
          <Ecometer />
        </a>
        <a
          href="/#"
          className="no-underline pt-[0.6vh]  font-normal  leading-normal font-[Arial] text-[2.8vh] visited:text-[rgba(242,243,239,0.315)"
        >
          Accueil
        </a>
        <a
          href="/#"
          className="no-underline pt-[0.6vh] font-extralight text-[2.8vh] visited:text-[rgba(242,243,239,0.315)"
        >
          À propos
        </a>
        <a
          href="/#"
          className="no-underline pt-[0.6vh] font-extralight text-[2.8vh] visited:text-[rgba(242,243,239,0.315)"
        >
          Fonctionnement
        </a>
        <a
          href="/#"
          className="no-underline pt-[0.6vh] font-extralight text-[2.8vh] visited:text-[rgba(242,243,239,0.315)"
        >
          FAQ
        </a>
      </div>
      <div className="w-[16.5%]"> </div>
      <div className="flex w-[30%] items-center justify-center">
        <a
          href="/login"
          className="no-underline bg-[#003049] text-[white] text-[2.4vh] cursor-pointer  duration-[0.3s]  font-normal ml-5 px-[3vh] py-[1.2vh] rounded-[1.5vh]  hover:bg-[#023559]   hover:rounded-[1.8vh]  "
        >
          Se connecter
        </a>

        <a
          href="/signup"
          className="no-underline bg-[#D62828] text-[white] text-[2.4vh] cursor-pointer  duration-[0.3s]  font-normal ml-[1.5vh] px-[3vh] py-[1.2vh] rounded-[1.5vh] border-[none]  hover:bg-[#e32b2b]  hover:rounded-[1.8vh]       "
        >
          S’inscrire
        </a>
      </div>
    </header>
    // </nav>
  );
}

export default Navbar;
