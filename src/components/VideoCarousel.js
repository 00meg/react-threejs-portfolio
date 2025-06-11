// src/components/VideoCarousel.js
import React from 'react';
import { motion } from 'framer-motion';
import './VideoCarousel.css'; // We'll create this CSS file

const VideoCarousel = ({ mediaData, onVideoSelect, isMobileView }) => {
  return (
    <motion.div
      className={`video-carousel-container ${isMobileView ? 'mobile-carousel' : 'desktop-carousel'}`}
      initial={{ opacity: 0, y: isMobileView ? 0 : '100%' }} // Animate from bottom for desktop, fade in for mobile
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: isMobileView ? 0 : '100%' }} // Animate out to bottom for desktop, fade out for mobile
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="video-carousel-content">
        {mediaData.map((video, index) => (
          <div key={video.id} className="video-carousel-item" onClick={() => onVideoSelect(index)}>
            <img src={video.thumbnailUrl || video.url} alt={video.title} className="video-thumbnail" />
            <div className="video-info">
              <h3>{video.title}</h3>
              {/* You can add more info here if needed */}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default VideoCarousel;