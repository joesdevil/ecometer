import logo from "../../public/image.png"
import logo1 from "../../public/Section.png"
function Hero() {
  return (
    
    <section
      style={{ backgroundImage: `url(${logo1})` }}
      className="bg-slate-90 w-[100%] h-[100vh] relative">
 
  <div className=" absolute flex  w-full h-full">
         {/** --------------------------- */}
        
         <div id="div" className="flex w-[50%] ml-20  ">
           <div className=" pt-[25vh]  ">
 
             <div style={{height:'auto'}} className=" h-[5vh]  font-['Eudoxus Sans'] py-[5] text-[white]  text-[5vh] font-bold w-[100%] ">
             A Propos 
             </div>
 
             <div  style={{height:'auto'}}   className=" h-[5vh]  font-['Eudoxus Sans'] py-[5] text-[white]  text-[7vh] font-bold w-[100%] ">
               Calculateur de Bilan Carbone
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
