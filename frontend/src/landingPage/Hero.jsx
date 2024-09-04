function Hero() {
  return (
    <section className="bg-slate-90 w-[100%] h-[90vh] relative">
      <img
        className="absolute  w-[100%] max-w-full bottom-0"
        src="/Vector1.svg"
        alt="SVG Image"
      ></img>

      {/** --------------------------- */}
      <div className=" absolute flex  w-full h-full">
        {/** --------------------------- */}
        <div className="w-[8%]"></div>
        <div id="div" className="flex w-[45%]  ">
          <div className=" pt-[8vh]  ">
            <div className=" h-[12vh]  font-['Eudoxus Sans'] py-[10] text-[white]  text-[10vh] font-bold w-[100%] ">
              Calculer le
            </div>

            <div
              className=" h-[12vh]  font-['Eudoxus
Sans'] text-[white] text-[9.5vh] font-bold w-[100%] "
            >
              Bilan Carbone de
            </div>

            <div className="flex  w-[100%] ">
              <div className="  text-[white] text-[9.5vh] font-bold  ">
                Votre&nbsp;
              </div>

              <div
                className=" relative font-['Eudoxus
Sans']  text-[white] text-[9.5vh] font-bold  "
              >
                <p className="absolute">Entreprise.</p>
                <img
                  className=" h-[5.2vh] mt-[7vh] "
                  src="/Rectangle.svg"
                  alt="SVG Image"
                ></img>
              </div>
            </div>
            <div className="  text-[white] text-[2.8vh] w-[100%] mt-[2vh] ">
              Bilan vert, avenir brillant,
              <br /> l’outil essentiel pour des choix éco-responsables.
            </div>
            <div className="  text-[white] text-base w-[100%] mt-[5vh] ">
              <a
                href="/signup"
                className="no-underline bg-[#D62828] text-[white] text-[2.8vh] cursor-pointer  duration-[0.3s]   hover:bg-[#e32b2b] hover:rounded-[1.2vh]   px-[3vh] py-[1.5vh] rounded-[1.7vh] border-[none] "
              >
                S’inscrire
              </a>
              <a
                href="/login"
                className=" no-underline bg-[#0F172A] text-[white] text-[2.8vh] cursor-pointer transition-all duration-[0.3s] ease-[ease] delay-[0s]   hover:bg-[#121c36] hover:rounded-[1.2vh]   border ml-[2vh] px-[3vh] py-[1.5vh] rounded-[1.7vh] border-[none] border-solid border-white "
              >
                Se connecter
              </a>
            </div>
          </div>
        </div>
        {/** --------------------------- */}
        <div className=" w-[42%] pt-[4vh] ">
          <img
            className=" max-w-full w-[95%] "
            src="/Illustrations.svg"
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
