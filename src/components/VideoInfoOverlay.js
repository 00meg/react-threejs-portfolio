// src/components/VideoInfoOverlay.js
import React from 'react';
import { motion } from 'framer-motion';

const overlayAnimation = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
  transition: { duration: 0.3, ease: 'easeInOut' }
};

const VideoInfoOverlay = ({ videoData, onClose }) => {
  if (!videoData) return null; // Non mostrare nulla se non ci sono dati video

  return (
    <motion.div
      className="video-info-overlay"
      variants={overlayAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <button onClick={onClose} className="close-button">&times;</button>
      <h3>{videoData.title}</h3>
      <p>{videoData.description}</p>
    </motion.div>
  );
};

export default VideoInfoOverlay;