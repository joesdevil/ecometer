function Sectionii() {
  return (
    <section className="border-y-[0.1vh] border-[#AAAAAA] bg-[#f2f4f8] w-full h-[65vh]">
      <div className="text-[7.5vh] font-bold w-full text-[Black] text-center max-w-full  pt-[7vh]">
        Comprenez votre Bilan Carbone
      </div>
      <div className="flex w-[92%] mx-auto mt-[5vh]">
        <div className="w-3/12 items-center">
          <img
            className="block h-[6.5vh] m-auto"
            src="/globe.svg"
            alt="SVG Image"
          ></img>
          <div style={{lineHeight:1.2}} className="text-[2.9vh] leading-5 text-[Black] text-center max-w-full  pt-5">
            Comprenez l&apos;impact de vos
            <br /> activités sur
            <br /> l&apos;environnement.
          </div>
        </div>
        <div className="w-3/12 items-center">
          <img
            className="block h-[6.5vh] m-auto"
            src="/presentation-chart-bar.svg"
            alt="SVG Image"
          ></img>
          <div style={{lineHeight:1.2}} className="text-[2.9vh] leading-5   text-[Black] text-center max-w-full  pt-5">
            Respectez les exigences
            <br /> réglementaires en évaluant
            <br /> vos émissions de carbone.
          </div>
        </div>
        <div  className="w-3/12 leading-5 items-center">
          <img
            className="block h-[6.5vh] m-auto"
            src="/chart-pie.svg"
            alt="SVG Image"
          ></img>
          <div style={{lineHeight:1.2}} className="text-[2.9vh] leading-5 text-[Black] text-center max-w-full  pt-5">
            Évaluez votre performance
            <br /> par rapport à l&apos;industrie.
          </div>
        </div>
        <div className="w-3/12 items-center">
          <img
            className="block h-[6.5vh] m-auto"
            src="/home.svg"
            alt="SVG Image"
          ></img>
          <div style={{lineHeight:1.2}} className="text-[2.9vh] text-[Black] leading-5 text-center max-w-full  pt-5">
            {" "}
            Montrez votre engagement
            <br /> en gérant votre empreinte
            <br /> carbone pour une
            <br /> entreprise responsable.
          </div>
        </div>
      </div>
      <div className="w-[100%] flex ">
        {" "}
        <a
          href=""
          className="text-center mt-[3vh]  block justify-center items-center  no-underline bg-[#d62828] text-[white] text-[2.7vh]   hover:bg-[#e32b2b]  hover:rounded-[1.8vh] cursor-pointer transition-all duration-[0.3s] ease-[ease] delay-[0s] font-normal mx-auto px-[5vh] py-[2vh] rounded-[2vh] border-[none]"
        >
          En savoir plus
        </a>
      </div>
    </section>
  );
}

export default Sectionii;
