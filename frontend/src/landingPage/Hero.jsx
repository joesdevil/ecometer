import logo from "../../public/image.png"
import logo1 from "../../public/Section.png"
function Hero() {
  return (
    
    <section
      style={{ backgroundImage: `url(${logo1})`, backgroundSize: 'cover' }}
      className="bg-slate-900 w-[100%] h-[100vh] relative">

      {/** --------------------------- */}
      <div className=" absolute flex  w-full h-full">
        {/** --------------------------- */}
       
        <div id="div" className="flex w-[50%] ml-20  ">
          <div className=" pt-[25vh]  ">

            <div style={{height:'auto'}} className=" h-[5vh]  font-['Eudoxus Sans'] py-[5] text-[white]  text-[5vh] font-bold w-[100%] ">
            Foundation Algérienne d’Economie Circulaire
            </div>

            <div  style={{height:'auto'}}   className=" h-[5vh]  font-['Eudoxus Sans'] py-[5] text-[white]  text-[7vh] font-bold w-[100%] ">
              Calculateur de Bilan Carbone
            </div>


            <br />
            <br />
            <div >
              <a href="/signup"
                className="no-underline bg-[#5D7B48] text-[white] text-[2.8vh] cursor-pointer  duration-[0.3s]         px-[3vh] py-[1.5vh] rounded-[1vh] border-[none] ">
                S’inscrire
              </a>
              <a href="/login" className=" no-underline bg-[transparent] text-[white] text-[2.8vh] cursor-pointer transition-all duration-[0.3s] ease-[ease] delay-[0s]    rounded-[1vh]   border ml-[2vh] px-[3vh] py-[1.5vh] rounded-[1vh] border-[none]  ">
                Se connecter
              </a>
            </div>

          </div>
          
        </div>
        {/** --------------------------- */}
        <div className=" w-[45%] pt-[25vh] ">
          <img
            className=" max-w-full w-[100%] "
            src={logo}
            alt="SVG Image"
          ></img>
        </div>
        {/** --------------------------- */}
        {/** --------------------------- */}
      </div>
    </section>
  );
}

export default Hero;
