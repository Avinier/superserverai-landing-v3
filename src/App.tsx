import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import AutoDiscovery from './components/AutoDiscovery';
import CapabilitiesGrid from './components/CapabilitiesGrid';
import ChatWithDeployment from './components/ChatWithDeployment';
import Integrations from './components/Integrations';
import CTABanner from './components/CTABanner';
import Footer from './components/Footer';
import AbstractBackground from './components/AbstractBackground';
import { DiagramsPage } from './pages/DiagramsPage';

function App() {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Route: /#/diagrams -> Diagram preview page
  if (route === '#/diagrams') {
    return <DiagramsPage />;
  }

  // Default: Landing page
  return (
    <div className="min-h-screen bg-background text-text relative">
      {/* Grid background animation */}
      <AbstractBackground />
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <AutoDiscovery />
        <CapabilitiesGrid />
        <ChatWithDeployment />
        <Integrations />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}

export default App;
