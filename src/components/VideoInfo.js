// src/components/VideoInfo.js

import React from 'react';
import { motion } from 'framer-motion';

const infoAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: 'easeInOut' }
};

function VideoInfo({ data }) {
  if (!data) return null;

  return (
    <motion.div
      className="video-info-container"
      variants={infoAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={infoAnimation.transition}
    >
      <h2 className="video-title">{data.title}</h2>
      <p className="video-description">{data.description}</p>
    </motion.div>
  );
}

export default VideoInfo;