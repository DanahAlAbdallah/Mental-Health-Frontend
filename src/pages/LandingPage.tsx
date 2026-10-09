import Footer from "../components/landing/Footer";
import Hero from "../components/landing/Hero";
import SplitSection from "../components/landing/SplitSection";
import Features from "../components/landing/Features";
import ArticlesSection from "../components/landing/ArticlesSection";

function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <Hero />
      <Features />
      <ArticlesSection />
      <SplitSection />
     
      <Footer />
    </div>
  );
}

export default LandingPage;
