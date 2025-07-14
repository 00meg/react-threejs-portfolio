import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import HoverAnimatedText from './HoverAnimatedText';
import ThemeToggle from './ThemeToggle';

const HeaderContainer = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem 3rem;
  background: ${({ theme }) => `${theme.colors.primary}E6`};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
  }
`;

const NavContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 0.8rem;
  }
`;

const StyledNavLink = styled(NavLink)`
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0.5)};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 1px;
    background: ${({ theme }) => theme.colors.secondary};
    transform: scaleX(${({ $isActive }) => ($isActive ? 1 : 0)});
    transform-origin: left;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    opacity: 1;
    
    &::after {
      transform: scaleX(1);
    }
  }

  @media (max-width: 768px) {
    font-size: 0.7rem;
    letter-spacing: 0.06em;
  }
`;

const ContactButton = styled.button`
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
  opacity: 0.5;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: none;
  border: none;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 1px;
    background: ${({ theme }) => theme.colors.secondary};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    opacity: 1;
    
    &::after {
      transform: scaleX(1);
    }
  }

  @media (max-width: 768px) {
    font-size: 0.7rem;
    letter-spacing: 0.06em;
  }
`;

const ThemeToggleWrapper = styled.div`
  display: flex;
  align-items: center;
`;


const Header = ({ onShowContact, isDarkMode, toggleTheme }) => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const location = useLocation();

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

  const navItems = [
    { path: '/', label: 'HOME' },
    { path: '/works', label: 'WORKS' },
    { path: '/about', label: 'ABOUT' },
  ];

  return (
    <HeaderContainer
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <NavContainer>
        <NavItems>
          {navItems.map((item) => (
            <StyledNavLink
              key={item.path}
              to={item.path}
              $isActive={location.pathname === item.path}
            >
              <HoverAnimatedText text={item.label} />
            </StyledNavLink>
          ))}
          <ContactButton onClick={onShowContact}>
            <HoverAnimatedText text="CONTACT" />
          </ContactButton>
          <ThemeToggleWrapper>
            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          </ThemeToggleWrapper>
        </NavItems>
      </NavContainer>
    </HeaderContainer>
  );
};

export default Header;