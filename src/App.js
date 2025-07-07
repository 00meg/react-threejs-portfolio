// src/App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AnimatePresence } from 'framer-motion';

// Theme and Global Styles
import { darkTheme, lightTheme } from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ContactForm from './components/ContactForm';
import ScrollToTop from './components/ScrollToTop'; // 1. Import the component

// Pages
import HomePage from './pages/HomePage';
import WorksPage from './pages/WorksPage';
import ProjectPage from './pages/ProjectPage';
import AboutPage from './pages/AboutPage';

function App() {
  const [showContact, setShowContact] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleShowContact = () => {
    setShowContact(true);
  };

  const handleCloseModals = () => {
    setShowContact(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <BrowserRouter>
        <ScrollToTop /> {/* 2. Add the component here */}
        <Header
          onShowContact={handleShowContact}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />

        {/* Main page content */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/works" element={<WorksPage />} />
          <Route path="/work/:projectId" element={<ProjectPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>

        {/* Add Footer and connect the contact click handler */}
        <Footer onContactClick={handleShowContact} />

        {/* Contact Modal with animation */}
        <AnimatePresence mode="wait">
          {showContact && (
            <ContactForm key="contact" onBack={handleCloseModals} />
          )}
        </AnimatePresence>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;