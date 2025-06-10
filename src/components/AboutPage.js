// src/components/AboutPage.js

import React from 'react';
import { motion } from 'framer-motion';
// The CSS is now handled globally by index.css, so this import can be removed if you consolidate styles.
import './AboutPage.css'; 

const AboutPage = ({ onBack }) => {
  return (
    <motion.div
      className="about-container"
      initial={{ opacity: 0, scale: 0.9, y: "-50%", x: "-50%" }}
      animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
      exit={{ opacity: 0, scale: 0.9, y: "-50%", x: "-50%" }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <button onClick={onBack} className="close-button">
        &times;
      </button>
      <div className="about-content">
        <img src={process.env.PUBLIC_URL + '/me.jpeg'} alt="Your Name" className="profile-picture" />
        <h2>About Me</h2>
        <p>
        I design digital and physical experiences where storytelling, design, and technology converge.
        With a background in psychology and media design, I craft cross-media projects that blend UI/UX, audiovisual composition, and spatial storytelling—from web platforms to immersive installations and interactive branding systems.
        </p>
        {/* Make sure the rest of your text content is here */}
      </div>
    </motion.div>
  );
};

export default AboutPage;