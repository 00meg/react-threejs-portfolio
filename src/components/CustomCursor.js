// src/components/CustomCursor.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CursorTag = styled(motion.div)`
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  mix-blend-mode: difference;
  
  .tag {
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.primary};
    padding: 0.5rem 1.2rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
    white-space: nowrap;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOverProject, setIsOverProject] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseEnterProject = (e) => {
      if (e.target.closest('[data-project-card]')) {
        setIsOverProject(true);
        setTimeout(() => setIsVisible(true), 50);
        document.body.style.cursor = 'none';
      }
    };

    const handleMouseLeaveProject = (e) => {
      if (!e.relatedTarget?.closest('[data-project-card]')) {
        setIsOverProject(false);
        setIsVisible(false);
        document.body.style.cursor = 'auto';
      }
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseEnterProject);
    document.addEventListener('mouseout', handleMouseLeaveProject);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseEnterProject);
      document.removeEventListener('mouseout', handleMouseLeaveProject);
      document.body.style.cursor = 'auto';
    };
  }, [cursorX, cursorY]);

  return (
    <CursorTag
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isOverProject ? 1 : 0.6,
        y: isOverProject ? -10 : 0,
      }}
      transition={{
        opacity: { duration: 0.3, ease: "easeOut" },
        scale: { 
          type: "spring", 
          damping: 20, 
          stiffness: 400,
          mass: 0.8
        },
        y: { 
          type: "spring", 
          damping: 25, 
          stiffness: 300 
        }
      }}
    >
      <motion.div 
        className="tag"
        animate={{
          scale: isOverProject ? 1 : 0.95,
        }}
        transition={{
          scale: { 
            type: "spring", 
            damping: 15, 
            stiffness: 300 
          }
        }}
      >
        View Project
      </motion.div>
    </CursorTag>
  );
};

export default CustomCursor;