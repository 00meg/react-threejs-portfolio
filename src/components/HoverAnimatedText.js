import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

// A wrapper to ensure the overflow is hidden, making the effect clean.
const Wrapper = styled(motion.div)`
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom; /* Aligns the text block nicely */
`;

// Styling for the single animated text block
const AnimatedWord = styled(motion.span)`
  display: inline-block;
  position: relative;
  /* Inherit text styles from parent */
  color: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  letter-spacing: inherit;
`;

// Variants for the up-and-down animation for the whole word
const wordVariants = {
  initial: {
    y: 0,
  },
  hover: {
    y: [0, '-120%', '120%', 0], // Keyframes: start, go up, come from bottom, end
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
      // Controls the timing of the keyframes
      times: [0, 0.35, 0.36, 1],
    },
  },
};

const HoverAnimatedText = ({ text }) => {
  return (
    <Wrapper
      initial="initial"
      whileHover="hover"
      aria-label={text}
    >
      <AnimatedWord
        variants={wordVariants}
      >
        {text}
      </AnimatedWord>
    </Wrapper>
  );
};

export default HoverAnimatedText;