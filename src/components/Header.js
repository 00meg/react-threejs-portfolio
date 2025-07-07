import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import HoverAnimatedText from './HoverAnimatedText'; // Import the new component

// ... (Keep styled-components the same) ...
const HeaderContainer = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  background: ${({ theme }) => `${theme.colors.primary}E6`};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
  }
`;

const Logo = styled(NavLink)`
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.secondary};
  transition: all 0.3s ease;

  &:hover {
    font-weight: 700;
    opacity: 1;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 0.8rem;
  }
`;

const NavItem = styled.button`
  font-size: 0.9rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.secondary};
  padding: 0.4rem 0;
  position: relative;
  transition: all 0.3s ease;
  font-weight: 400;

  &:hover {
    font-weight: 700;
  }
`;

const StyledNavLink = styled(NavLink)`
  font-size: 0.9rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.secondary};
  padding: 0.4rem 0;
  position: relative;
  transition: all 0.3s ease;
  font-weight: 400;

  &:hover {
    font-weight: 700;
    opacity: 1;
  }

  &.active {
    font-weight: 700;
  }
`;

const ThemeToggle = styled(motion.button)`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 1rem;
  font-size: 0.8rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.secondary};
    font-weight: 700;
    transform: rotate(180deg);
  }

  @media (max-width: 768px) {
    margin-left: 0.6rem;
  }
`;


const Header = ({ onShowContact, isDarkMode, toggleTheme }) => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  // ... (useEffect logic remains the same) ...
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const visible = prevScrollPos > currentScrollPos || currentScrollPos < 10;
      
      setPrevScrollPos(currentScrollPos);
      setVisible(visible);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);


  return (
    <HeaderContainer
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <Logo to="/">
        <HoverAnimatedText text="Meg" />
      </Logo>
      <Nav>
        <StyledNavLink to="/works" end>
          <HoverAnimatedText text="Works" />
        </StyledNavLink>
        <StyledNavLink to="/about" end>
          <HoverAnimatedText text="About" />
        </StyledNavLink>
        <NavItem onClick={onShowContact}>
          <HoverAnimatedText text="Contact" />
        </NavItem>
        <ThemeToggle
          onClick={toggleTheme}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle theme"
        >
          {isDarkMode ? '☀' : '☾'}
        </ThemeToggle>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;