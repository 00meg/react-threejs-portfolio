// src/styles/ModalStyles.js
import styled from 'styled-components';
import { motion } from 'framer-motion';

export const ModalBackdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Less opaque background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(12px); /* Increased blur */
  -webkit-backdrop-filter: blur(12px);
`;

export const ModalContainer = styled(motion.div)`
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 3rem;
  /* Use the theme's modalBg for the glass effect */
  background-color: ${({ theme }) => theme.colors.modalBg}; 
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px; /* Slightly larger radius */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  position: relative;

  /* Enhanced border visibility for light mode */
  ${({ theme }) => theme.name === 'light' && `
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  `}

  /* Scrollbar styling for modal */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.accent};
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    padding: 2.5rem 2rem;
    width: 95%;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: transparent;
  border: none;
  font-size: 1.8rem;
  line-height: 1;
  color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  opacity: 0.7;
  
  /* Fix centering issues */
  transform-origin: center center;
  
  &:hover {
    /* Removed the orange background */
    opacity: 1;
    transform: scale(0.9);
  }
  
  &:active {
    transform: scale(0.85);
  }
`;

// More elegant animation
export const modalAnimation = {
  initial: { opacity: 0, scale: 0.9, y: 30 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 30 },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
};

export const backdropAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};