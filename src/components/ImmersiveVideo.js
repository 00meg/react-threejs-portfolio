import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const VideoSection = styled.section`
  position: relative;
  height: 400vh;
  background: ${({ theme }) => theme?.colors?.primary || '#000'};
`;

const StickyContainer = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VideoWrapper = styled.div`
  width: min(1400px, 90vw);
  aspect-ratio: 16 / 9;
  border-radius: 20px;
  overflow: hidden;
  background: black;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  will-change: transform, width, height, border-radius;
  
  /* Use CSS custom properties for smooth interpolation */
  --scale: 1;
  --border-radius: 20px;
  --width: min(1400px, 90vw);
  --height: auto;
  
  width: var(--width);
  height: var(--height);
  border-radius: var(--border-radius);
  transform: scale(var(--scale));
  
  /* Smoother transition with optimized timing */
  transition: 
    width 0.6s cubic-bezier(0.23, 1, 0.32, 1),
    height 0.6s cubic-bezier(0.23, 1, 0.32, 1),
    border-radius 0.6s cubic-bezier(0.23, 1, 0.32, 1),
    transform 0.4s cubic-bezier(0.23, 1, 0.32, 1),
    box-shadow 0.6s ease;
  
  /* Fullscreen state */
  &.fullscreen {
    --width: 100vw;
    --height: 100vh;
    --border-radius: 0px;
    --scale: 1;
    aspect-ratio: unset;
    box-shadow: none;
  }
  
  /* Smooth scale effects */
  &.expanding {
    --scale: 1.02;
  }
  
  &.contracting {
    --scale: 0.99;
  }
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Slight scale to prevent edge visibility */
  transform: scale(1.01);
`;

// Overlay for smooth fade effect during transitions
const TransitionOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme?.colors?.primary || '#000'};
  opacity: ${props => props.$opacity || 0};
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 1;
`;

// Debug component (remove in production)
const DebugInfo = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  font-family: monospace;
  font-size: 12px;
  z-index: 9999;
  border-radius: 4px;
`;

const ImmersiveVideo = () => {
  const sectionRef = useRef(null);
  const [videoState, setVideoState] = useState('initial');
  const [scrollPercent, setScrollPercent] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const lastProgress = useRef(0);

  useEffect(() => {
    let ticking = false;

    const updateVideoState = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const scrolled = -rect.top;
      const totalHeight = sectionRef.current.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, scrolled / totalHeight));
      
      setScrollPercent(Math.round(progress * 100));

      // Smooth state transitions with adjusted boundaries
      let newState = 'initial';
      let newOverlayOpacity = 0;
      
      if (progress < 0.1) {
        newState = 'initial';
        // Fade in at the very beginning
        newOverlayOpacity = Math.max(0, (0.1 - progress) / 0.1) * 0.3;
      } else if (progress >= 0.1 && progress < 0.2) {
        newState = 'expanding';
        // Subtle fade during expansion
        newOverlayOpacity = ((progress - 0.1) / 0.1) * 0.1;
      } else if (progress >= 0.2 && progress < 0.8) {
        newState = 'fullscreen';
        // Clear during fullscreen
        newOverlayOpacity = 0;
      } else if (progress >= 0.8 && progress < 0.9) {
        newState = 'contracting';
        // Subtle fade during contraction
        newOverlayOpacity = ((progress - 0.8) / 0.1) * 0.1;
      } else {
        newState = 'final';
        // Fade out at the end
        newOverlayOpacity = Math.min(0.3, ((progress - 0.9) / 0.1) * 0.3);
      }

      // Update states
      setVideoState(newState);
      setOverlayOpacity(newOverlayOpacity);
      lastProgress.current = progress;

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateVideoState);
        ticking = true;
      }
    };

    // Initial state
    updateVideoState();

    // Add scroll listener with throttling
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also listen for resize to maintain smooth behavior
    window.addEventListener('resize', updateVideoState);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateVideoState);
    };
  }, []);

  // Determine CSS classes based on state
  const getVideoClasses = () => {
    switch (videoState) {
      case 'expanding':
        return 'expanding';
      case 'fullscreen':
        return 'fullscreen';
      case 'contracting':
        return 'fullscreen contracting';
      default:
        return '';
    }
  };

  return (
    <>
      {/* Remove in production */}
      <DebugInfo>
        <div>Scroll: {scrollPercent}%</div>
        <div>State: {videoState}</div>
      </DebugInfo>
      
      <VideoSection ref={sectionRef}>
        <StickyContainer>
          <VideoWrapper className={getVideoClasses()}>
            <VideoContainer>
              <StyledVideo
                src="/kollateral.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
              <TransitionOverlay $opacity={overlayOpacity} />
            </VideoContainer>
          </VideoWrapper>
        </StickyContainer>
      </VideoSection>
    </>
  );
};

export default ImmersiveVideo;