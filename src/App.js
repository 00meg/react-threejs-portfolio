import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence } from 'framer-motion';
import VideoScene from './components/VideoScene';
import ContactForm from './components/ContactForm';
import AboutPage from './components/AboutPage';
// Removed VideoInfoOverlay import
// import { mediaData } from './mediaData'; // No longer directly needed in App.js for video data

import './index.css';

function App() {
  const [showContact, setShowContact] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [layoutSeed, setLayoutSeed] = useState(0);
  const [cameraZ, setCameraZ] = useState(15);
  // This state is just to know if *any* video is focused for canvas click logic.
  // It doesn't trigger blur directly anymore, that's handled by VideoScene.
  const [isAnyVideoFocusedInScene, setIsAnyVideoFocusedInScene] = useState(false);


  // Adjust camera Z based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCameraZ(20); // Pull camera back for mobile
      } else {
        setCameraZ(15);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on mount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Blur class now only depends on modals
  const blurClass = showContact || showAbout ? 'blurred' : '';

  const handleCloseModals = () => {
    setShowContact(false);
    setShowAbout(false);
  };

  const handleShowAbout = () => {
    setShowContact(false);
    setShowAbout(true);
    // When modals are opened, ensure the video scene state is reset (defocused if applicable)
    // This will be handled by a slight alteration to triggerRearrangeOrClose or directly in VideoScene via prop.
    // For now, let's keep it simple and allow VideoScene to manage its own focus.
  };

  const handleShowContact = () => {
    setShowAbout(false);
    setShowContact(true);
    // Similar to handleShowAbout, will rely on VideoScene to manage its own focus.
  };

  // This function is called when clicking on the blurred canvas background
  const triggerRearrangeOrClose = () => {
    if (showContact || showAbout) {
      handleCloseModals(); // Close modals if open
    } else {
      setLayoutSeed(s => s + 0.5); // Otherwise, trigger rearrange
    }
    // Video defocus is handled by VideoScene's internal background click
  };

  // Callback from VideoScene to inform App.js if any video is focused
  // This helps App.js decide if clicking the canvas background should rearrange
  // or if it should allow VideoScene to handle the defocus.
  const handleVideoFocusStateChange = (isFocused) => {
    setIsAnyVideoFocusedInScene(isFocused);
  };

  return (
    <div className="main-container">
      {/* The blurClass is applied to canvas-container */}
      <div id="canvas-container" className={blurClass} onClick={triggerRearrangeOrClose}>
        <Canvas camera={{ position: [0, 0, cameraZ] }}>
          <VideoScene
            layoutSeed={layoutSeed}
            onVideoFocusStateChange={handleVideoFocusStateChange} // Pass callback for focus state
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
        {/* VideoInfoOverlay is removed from App.js */}
      </AnimatePresence>
    </div>
  );
}

export default App;