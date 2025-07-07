import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const CyclingImageContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  margin: 3rem 0 4rem;
  background: ${({ theme }) => theme.colors.border};
`;

const CyclerImage = styled(motion.img)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const imageVariants = {
  enter: { opacity: 0 },
  center: { zIndex: 1, opacity: 1 },
  exit: { zIndex: 0, opacity: 0 },
};

const CyclingImage = ({ images, interval = 2000 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length > 1) {
      const timer = setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, interval);
      return () => clearTimeout(timer);
    }
  }, [index, images.length, interval]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <CyclingImageContainer>
      <AnimatePresence initial={false}>
        <CyclerImage
          key={index}
          src={images[index]}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ opacity: { duration: 0.5 } }}
        />
      </AnimatePresence>
    </CyclingImageContainer>
  );
};

export default CyclingImage;