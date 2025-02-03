import Navbar from "./Navbar.jsx";
import Hero from "./Hero.jsx";
import Sectionii from "./Sectionii.jsx";
import Video from "./Video.jsx";
import Info from "./Info.jsx";
import Stat from "./Stat.jsx";
import Questions from "./Questions.jsx";
import Last from "./Last.jsx";
import Foot from "./Foot.jsx";
import FaqHero from "./FaqHero.jsx"
import logo1 from "../../public/Section.png"
 
function Faq() {
 
  return (
    <section  style={{ height:100+"vh",backgroundImage: `url(${logo1})` }} >
        <Navbar/>
        <FaqHero/>
      
 
        <Questions />
         <Last />
         <Foot />
    </section>
  );
}

export default Faq;



