import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SymptomChecker from './components/SymptomChecker';
import Telemedicine from './components/Telemedicine';
import HealthMonitoring from './components/HealthMonitoring';
import PhysicalTherapy from './components/PhysicalTherapy';
import MoodScanner from './components/MoodScanner';
import About from './components/About';

function App() {
  const [currentSection, setCurrentSection] = useState('home');

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return <Hero onSectionChange={setCurrentSection} />;
      case 'symptom-checker':
        return <SymptomChecker />;
      case 'telemedicine':
        return <Telemedicine />;
      case 'monitoring':
        return <HealthMonitoring />;
      case 'therapy':
        return <PhysicalTherapy />;
      case 'mood-scanner':
        return <MoodScanner />;
      case 'about':
        return <About />;
      default:
        return <Hero onSectionChange={setCurrentSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentSection={currentSection} onSectionChange={setCurrentSection} />
      {renderSection()}
    </div>
  );
}

export default App;