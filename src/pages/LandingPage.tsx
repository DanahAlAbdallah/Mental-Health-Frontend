import Footer from "../components/landing/Footer";
import ClosingBanner from "../components/landing/ClosingBanner";
import Hero from "../components/landing/Hero";
import SplitSection from "../components/landing/SplitSection";
import Features from "../components/landing/Features";

function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <Hero />
      <Features />
      <SplitSection />
      <ClosingBanner />
      <Footer />
    </div>
  );
}

export default LandingPage;
