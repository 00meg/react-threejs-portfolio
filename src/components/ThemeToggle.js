import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ToggleButton = styled(motion.button)`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 0.4rem 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
  opacity: 0.5;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.secondary};
    opacity: 1;
    transform: translateY(-1px);
  }
  
  svg {
    width: 14px;
    height: 14px;
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: rotate(180deg);
  }
  
  @media (max-width: 768px) {
    padding: 0.3rem 0.6rem;
    font-size: 0.7rem;
    letter-spacing: 0.06em;
  }
`;

const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
  return (
    <ToggleButton
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isDarkMode ? (
          // Sun icon for dark mode
          <>
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </>
        ) : (
          // Moon icon for light mode
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        )}
      </svg>
      {isDarkMode ? 'LIGHT' : 'DARK'}
    </ToggleButton>
  );
};

export default ThemeToggle; 