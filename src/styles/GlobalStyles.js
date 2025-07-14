// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* PPNeueMontreal Font Face Declarations */
  @font-face {
    font-family: 'PPNeueMontreal';
    src: url('./fonts/PPNeueMontreal-Thin.otf') format('opentype');
    font-weight: 100;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'PPNeueMontreal';
    src: url('./fonts/PPNeueMontreal-Book.otf') format('opentype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'PPNeueMontreal';
    src: url('./fonts/PPNeueMontreal-Medium.otf') format('opentype');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'PPNeueMontreal';
    src: url('./fonts/PPNeueMontreal-Bold.otf') format('opentype');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'PPNeueMontreal';
    src: url('./fonts/PPNeueMontreal-Italic.otf') format('opentype');
    font-weight: 400;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: 'PPNeueMontreal';
    src: url('./fonts/PPNeueMontreal-SemiBolditalic.otf') format('opentype');
    font-weight: 600;
    font-style: italic;
    font-display: swap;
  }

  /* Enhanced CSS reset for smooth experience */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    /* Smooth scrolling behavior */
    scroll-behavior: smooth;
    /* Allow vertical scrolling */
    overflow-y: auto;
    /* Prevent horizontal scrolling */
    overflow-x: hidden;
    /* Better text rendering */
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  body {
    /* Ensure the body can grow with its content */
    min-height: 100vh;
    width: 100%;
    position: relative;

    /* Enhanced font smoothing */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;

    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.secondary};
    font-family: ${({ theme }) => theme.fonts.main};
    line-height: 1.6;

    /* Ensure no overflow is hidden */
    overflow: visible;

    /* Smooth transitions for theme changes */
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  /* Custom scrollbar styling - more sophisticated */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.secondary}33;
    border-radius: 4px;
    transition: background 0.3s ease;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.secondary}66;
  }

  /* Firefox scrollbar */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.secondary}33 transparent;
  }

  a {
    color: ${({ theme }) => theme.colors.secondary};
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  a:hover {
    opacity: 0.8;
  }

  button {
    font-family: ${({ theme }) => theme.fonts.main};
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    -webkit-tap-highlight-color: transparent;

    /* Global style for thinner borders on buttons that have one */
    border-width: 0.5px;
  }

  /* Enhanced selection styling */
  ::selection {
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.primary};
  }

  ::-moz-selection {
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.primary};
  }

  /* UPDATED: Universal image optimization to prevent container showing */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
  
  /* For absolute positioned images (used in ProjectImage, etc.) */
  div[style*="position: relative"] img {
    max-width: none;
  }
  
  /* Ensure images in fixed aspect ratio containers fill properly */
  [style*="aspect-ratio"] img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Reduce motion for users who prefer it */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* Focus styles for accessibility */
  *:focus {
    outline: 2px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 2px;
  }

  *:focus:not(:focus-visible) {
    outline: none;
  }

  *:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 2px;
  }

  /* Utility class for full-width sections */
  .full-width {
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
  }
`;

export default GlobalStyles;