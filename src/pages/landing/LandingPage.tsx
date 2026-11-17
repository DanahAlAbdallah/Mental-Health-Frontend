import Footer from "../../components/Footer";
import Features from "./Features";
import Hero from "./Hero";
import SplitSection from "./SplitSection";

function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <Hero />
      <Features />
      <SplitSection />
      <Footer />
    </div>
  );
}

export default LandingPage;
