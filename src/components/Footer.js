import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import HoverAnimatedText from './HoverAnimatedText'; // Import the new component

// ... (Keep styled-components the same) ...
const FooterContainer = styled.footer`
  width: 100%;
  padding: 2.5rem 3rem; /* Reduced padding */
  background: ${({ theme }) => theme.colors.primary};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: 8rem;

  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
    margin-top: 6rem;
  }
`;

const FooterContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem; /* Gap between all items */
  
  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }
`;

const LeftContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap; /* Allow text to wrap if needed */
  justify-content: center;
`;

const FooterItem = styled.a`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 0.85rem;
  opacity: 0.7;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 1;
    font-weight: 700; /* Bold instead of orange color */
  }
`;

const CopyrightText = styled.p`
  font-size: 0.85rem; /* Consistent font size */
  color: ${({ theme }) => theme.colors.secondary};
  opacity: 0.5;
`;

const ContactButton = styled(motion.button)`
  padding: 0.4rem 1rem; /* Reduced from 0.5rem 1.25rem for minimalist look */
  background: transparent;
  border: 0.5px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 18px; /* Reduced from 25px for more subtle look */
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 0.8rem; /* Reduced from 0.85rem */
  font-weight: 400;
  letter-spacing: 0.02em; /* Reduced letter spacing */
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  
  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    border-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
    transform: translateY(-1px); /* Reduced from -2px for subtle effect */
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08); /* Lighter shadow */
  }
`;


const Footer = ({ onContactClick }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <LeftContent>
          <CopyrightText>
            © {currentYear} Meg. All rights reserved.
          </CopyrightText>
          <FooterItem href="mailto:megiannilli@gmail.com">
            <HoverAnimatedText text="megiannilli@gmail.com" />
          </FooterItem>
          <FooterItem href="tel:+39 339 342 1673">
            <HoverAnimatedText text="+39 339 342 1673" />
          </FooterItem>
        </LeftContent>
        
        <ContactButton
          onClick={onContactClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <HoverAnimatedText text="Get in Touch" />
        </ContactButton>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;