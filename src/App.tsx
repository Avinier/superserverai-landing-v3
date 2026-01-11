import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturesGrid1 from './components/FeaturesGrid1';
import FeaturesGrid2 from './components/FeaturesGrid2';
import AgentsCohosting from './components/AgentsCohosting';
import GatewaySection from './components/GatewaySection';
import CTABanner from './components/CTABanner';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />
      <main>
        <Hero />
        <FeaturesGrid1 />
        <FeaturesGrid2 />
        <AgentsCohosting />
        <GatewaySection />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}

export default App;
