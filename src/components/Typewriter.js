// src/components/Typewriter.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TypewriterText = styled.span`
  position: relative;
`;

const Typewriter = ({ text, speed = 100 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(displayText + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, displayText, text, speed]);

  return <TypewriterText>{displayText}</TypewriterText>;
};

export default Typewriter;