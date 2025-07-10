import React, { useState } from 'react';
import LandingPage from './components/LandingPage.jsx';
import AntibiogramApp from './components/AntibiogramApp.jsx';
import SyndromesApp from './components/SyndromesApp.jsx';

const App = () => {
    const [currentSection, setCurrentSection] = useState('landing');

    const handleSelectSection = (section) => {
        if (section === 'antibiogram') {
            setCurrentSection('antibiogram');
        } else if (section === 'syndromes') {
            setCurrentSection('syndromes');
        }
    };

    const handleBackToLanding = () => {
        setCurrentSection('landing');
    };

    const renderCurrentSection = () => {
        switch (currentSection) {
            case 'antibiogram':
                return <AntibiogramApp onBackToLanding={handleBackToLanding} />;
            case 'syndromes':
                return <SyndromesApp onBackToLanding={handleBackToLanding} />;
            case 'landing':
            default:
                return <LandingPage onSelectSection={handleSelectSection} />;
        }
    };

    return renderCurrentSection();
};

export default App;