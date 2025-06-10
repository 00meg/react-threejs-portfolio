import React, { useState, useEffect } from 'react'; // Import useEffect
import { Canvas } from '@react-three/fiber';
import { AnimatePresence } from 'framer-motion';
import VideoScene from './components/VideoScene';
import ContactForm from './components/ContactForm';
import AboutPage from './components/AboutPage';
import './index.css';

function App() {
  const [showContact, setShowContact] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [layoutSeed, setLayoutSeed] = useState(0);
  const [cameraZ, setCameraZ] = useState(15); // State for camera Z position

  // Adjust camera Z based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // Adjust breakpoint as needed
        setCameraZ(20); // Pull camera back for mobile
      } else {
        setCameraZ(15);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on mount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const blurClass = showContact || showAbout ? 'blurred' : '';

  const handleCloseModals = () => {
    setShowContact(false);
    setShowAbout(false);
  };

  const handleShowAbout = () => {
    setShowContact(false);
    setShowAbout(true);
  };

  const handleShowContact = () => {
    setShowAbout(false);
    setShowContact(true);
  };

  const triggerRearrangeOrClose = () => {
    if (showContact || showAbout) {
      handleCloseModals();
    } else {
      setLayoutSeed(s => s + 0.5);
    }
  };

  return (
    <div className="main-container">
      <div id="canvas-container" className={blurClass} onClick={triggerRearrangeOrClose}>
        <Canvas camera={{ position: [0, 0, cameraZ] }}> {/* Use dynamic cameraZ */}
          <VideoScene 
            layoutSeed={layoutSeed} 
          />
        </Canvas>
      </div>
      <div className="ui-foreground-container">
        
        <div className="nav-container">
          <button onClick={handleShowAbout} className="nav-link">
            about me
          </button>
          <button onClick={handleShowContact} className="nav-link">
            let's chat
          </button>
        </div>

        <p className="bottom-text">
        i craft digital ecosystems and cross-media experiences where design, storytelling, and technology converge.
my work spans immersive installations, web platforms, and brand identities—merging UI/UX, audiovisual composition, and spatial narratives to create sensorial, dynamic, and intentional experiences.
        </p>
        
        <input
          type="range"
          min="0"
          max="50"
          value={layoutSeed % 100}
          className="vertical-slider"
          onChange={(e) => setLayoutSeed(Number(e.target.value))}
        />
      </div>
      <AnimatePresence>
        {showContact && <ContactForm onBack={handleCloseModals} />}
        {showAbout && <AboutPage onBack={handleCloseModals} />}
      </AnimatePresence>
    </div>
  );
}

export default App;