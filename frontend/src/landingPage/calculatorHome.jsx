import Navbar from "./Navbar.jsx";
import Hero from "./Hero.jsx";
import Sectionii from "./Sectionii.jsx";
import Video from "./Video.jsx";
import Info from "./Info.jsx";
import Stat from "./Stat.jsx";
import Questions from "./Questions.jsx";
import Last from "./Last.jsx";
import Foot from "./Foot.jsx";

function Landing() {
  localStorage.setItem("isConnected", JSON.stringify(false));
localStorage.setItem("verifiedEmail", JSON.stringify(false));
localStorage.removeItem("token");

  return (
    <section>
      <Navbar />
      <Hero />
      <Sectionii />
      <Video />
      <Info />
      <Stat />
      <Questions />
      <Last />
      <Foot />
    </section>
  );
}

export default Landing;
