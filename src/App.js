import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion'; // Import motion from framer-motion
import VideoScene from './components/VideoScene';
import ContactForm from './components/ContactForm';
import AboutPage from './components/AboutPage';

import './index.css';

function App() {
  const [showContact, setShowContact] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [layoutSeed, setLayoutSeed] = useState(0); // Controls video scattering
  const [cameraZ, setCameraZ] = useState(15); // Z-position of the camera
  const [isAnyVideoFocusedInScene, setIsAnyVideoFocusedInScene] = useState(false); // Tracks if any video is focused
  const [flash, setFlash] = useState(false); // State for the background flash effect
  const flashTimeout = useRef(null);

  // Adjust camera Z based on screen width for responsive viewing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCameraZ(20); // Pull camera back for mobile to make room for UI
      } else {
        setCameraZ(15); // Default desktop camera Z
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on mount to set initial camera Z
    return () => window.removeEventListener('resize', handleResize); // Cleanup
  }, []);

  // Class to apply blur to the canvas when modals are open
  const blurClass = showContact || showAbout ? 'blurred' : '';

  // Callback to trigger the white flash effect
  const triggerFlash = useCallback(() => {
    setFlash(true);
    clearTimeout(flashTimeout.current); // Clear any existing timeout
    flashTimeout.current = setTimeout(() => {
      setFlash(false);
    }, 200); // Short flash duration (200ms)
  }, []);


  // Callbacks for closing modals
  const handleCloseModals = useCallback(() => {
    setShowContact(false);
    setShowAbout(false);
    triggerFlash(); // Flash when modals close
  }, [triggerFlash]);

  // Callbacks for showing modals
  const handleShowAbout = useCallback(() => {
    setShowContact(false);
    setShowAbout(true);
    triggerFlash(); // Flash when About modal opens
  }, [triggerFlash]);

  const handleShowContact = useCallback(() => {
    setShowAbout(false);
    setShowContact(true);
    triggerFlash(); // Flash when Contact modal opens
  }, [triggerFlash]);

  // Callback to request a rearrange. This will update the layoutSeed.
  const handleRearrangeRequest = useCallback(() => {
    // Use a small random increment to ensure a new, slightly different layout each time
    setLayoutSeed(s => s + Math.random() * 0.1 + 0.1);
  }, []);

  // Handles clicks on the main canvas container
  const triggerRearrangeOrClose = useCallback(() => {
    if (showContact || showAbout) {
      // If a modal is open, close it (handleCloseModals will trigger flash)
      handleCloseModals();
    } else {
      // If no modals are open AND no video is currently focused,
      // trigger a rearrange (new random layout). This is the original behavior.
      // If a video *is* focused, VideoScene will handle defocusing and then
      // trigger `handleRearrangeRequest` itself via its useEffect.
      // The flash for video interactions is handled directly by VideoScene now.
      if (!isAnyVideoFocusedInScene) {
        handleRearrangeRequest();
      }
    }
  }, [showContact, showAbout, handleCloseModals, isAnyVideoFocusedInScene, handleRearrangeRequest]);

  // Callback from VideoScene to inform App.js about video focus state
  const handleVideoFocusStateChange = useCallback((isFocused) => {
    setIsAnyVideoFocusedInScene(isFocused);
    // Flash is now triggered directly by VideoItem/VideoScene's click handler
    // so no need to trigger it here based on focus state change.
  }, []);

  return (
    <div className="main-container">
      {/* Flash effect overlay */}
      {flash && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            zIndex: 3, // Ensure it's above canvas but below modals
            pointerEvents: 'none', // Allow clicks to pass through
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
      )}

      {/* The 3D canvas container, which gets blurred when modals are open */}
      <div id="canvas-container" className={blurClass} onClick={triggerRearrangeOrClose}>
        <Canvas camera={{ position: [0, 0, cameraZ] }}>
          <VideoScene
            layoutSeed={layoutSeed} // Passed to trigger new layout arrangement
            onVideoFocusStateChange={handleVideoFocusStateChange} // Callback to update App.js focus state
            onRearrangeRequest={handleRearrangeRequest} // Callback for VideoScene to request a new layout
            onInteraction={triggerFlash} // Pass triggerFlash to VideoScene
          />
        </Canvas>
      </div>

      {/* UI elements that sit on top of the canvas */}
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

        {/* Vertical slider to manually adjust layout (for testing/debug) */}
        {/* Keeping for potential debugging, but can be hidden in production by default */}
        <input
          type="range"
          min="0"
          max="50"
          value={layoutSeed % 100}
          className="vertical-slider"
          onChange={(e) => setLayoutSeed(Number(e.target.value))}
        />
      </div>

      {/* Modals rendered with Framer Motion for animations */}
      <AnimatePresence>
        {showContact && <ContactForm onBack={handleCloseModals} />}
        {showAbout && <AboutPage onBack={handleCloseModals} />}
      </AnimatePresence>
    </div>
  );
}

export default App;