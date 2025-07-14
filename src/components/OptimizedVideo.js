import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const VideoWrapper = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 24px;
  overflow: hidden;
  background: #0a0a0a;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
  opacity: ${({ $loaded }) => $loaded ? 1 : 0};
`;



const LoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;



const ErrorMessage = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  text-align: center;
  z-index: 2;
`;

const OptimizedVideo = ({ 
  src, 
  aspectRatio = '16 / 9',
  autoPlay = true,
  showControls = false,
  ...props 
}) => {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsLoaded(true);
      if (autoPlay && !showControls) {
        video.play().catch(() => {
          console.warn('Video autoplay failed');
        });
      }
    };

    const handleError = () => {
      setHasError(true);
      setIsLoaded(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [autoPlay, showControls]);

  return (
    <VideoWrapper
      {...props}
    >
      <Video
        ref={videoRef}
        src={src}
        $loaded={isLoaded && !hasError}
        loop
        muted={!showControls}
        playsInline
        preload="metadata"
        controls={showControls}
      />

      <AnimatePresence>
        {!isLoaded && !hasError && (
          <LoadingOverlay
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingSpinner />
          </LoadingOverlay>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hasError && (
          <ErrorMessage
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Video could not be loaded.<br />
            Check your connection and try refreshing.
          </ErrorMessage>
        )}
      </AnimatePresence>



    </VideoWrapper>
  );
};

export default OptimizedVideo; 