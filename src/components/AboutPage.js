import React from 'react';
import { motion } from 'framer-motion';
// The CSS is now handled globally by index.css, so this import can be removed if you consolidate styles.
// import './AboutPage.css'; // This line can be removed if styles are in index.css

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
        <p>
        My expertise includes:
        <ul>
            <li>Interactive Web Development (React, Three.js, Framer Motion)</li>
            <li>Immersive Installation Design</li>
            <li>UI/UX Design and Prototyping</li>
            <li>Audiovisual Production and Editing</li>
            <li>Spatial Storytelling and Experience Design</li>
            <li>Brand Identity and Visual Communication</li>
        </ul>
        </p>
        <p>
        I'm passionate about creating meaningful connections between people and technology, exploring how digital art and innovative interfaces can enhance human perception and interaction.
        </p>
        <p>
        Feel free to browse my portfolio or reach out if you'd like to collaborate on a project!
        </p>
      </div>
    </motion.div>
  );
};

export default AboutPage;