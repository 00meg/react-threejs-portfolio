// src/components/ApproachSection.js
import React, { useRef, forwardRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useInView } from 'framer-motion';

const approachData = [
    {
        number: '01',
        title: 'Embrace Complexity',
        description: 'I navigate intricate design challenges with care, crafting solutions that are both innovative and adaptable to a rapidly evolving world.',
    },
    {
        number: '02',
        title: 'Insights Before Ideation',
        description: 'I begin every engagement with a deep understanding of your users and goals, letting insights shape ideas that connect and push business forward.',
    },
    {
        number: '03',
        title: 'Partners, Not Hired Hands',
        description: 'I integrate with your team as a true partner, fostering collaboration and shared ownership to achieve the best possible outcomes together.',
    },
    {
        number: '04',
        title: 'Beauty with Purpose',
        description: 'I craft visually stunning designs that serve a strategic intent, merging aesthetic excellence with functional impact.',
    },
];

// --- STYLED COMPONENTS ---

// *** MODIFIED ***: Removed the self-contained :hover state.
const ItemTitle = styled(motion.h3).attrs({
    className: 'item-title-trigger'
})`
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: -0.02em;
  cursor: pointer;
`;

const SectionContainer = styled(motion.section)`
  padding: 8rem 3rem;
  max-width: 1400px;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.primary};
  will-change: transform;
  
  @media (max-width: 768px) {
    padding: 6rem 1.5rem;
  }
`;

const SectionHeader = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 4rem;
  
  span {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.secondary};
    opacity: 0.7;
  }
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.secondary};
    opacity: 0.7;
    transition: all 0.3s ease;
  }
`;

const ApproachList = styled.div`
  display: flex;
  flex-direction: column;
`;

// *** MODIFIED ***: All hover logic is now centralized here.
const ItemContainer = styled(motion.div)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
  
  &:last-child {
    border-bottom: none;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 0;
    height: 1px;
    background: ${({ theme }) => theme.colors.secondary};
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
  }
  
  /* This is the new, centralized hover logic */
  /* When the title is hovered... */
  &:has(.item-title-trigger:hover) {
    
    /* 1. Animate the underline */
    &::before {
      width: 100%;
    }

    /* 2. Animate the title */
    .item-title-trigger {
      transform: translateX(10px);
    }

    /* 3. Animate the number */
    .item-number-trigger {
      transform: translateX(10px);
    }
    
    /* 4. Animate the description's opacity */
    .item-description-trigger {
      opacity: 0.95;
    }
  }
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 2rem;
  align-items: baseline;
  padding: 3rem 0;

  @media (max-width: 768px) {
    gap: 1.5rem;
    padding: 2.5rem 0;
    grid-template-columns: 60px 1fr;
  }
`;

// *** MODIFIED ***: Added a class and removed hover logic.
const ItemNumber = styled(motion.span).attrs({
    className: 'item-number-trigger'
})`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 400; /* Replaced theme reference for clarity */
  font-style: italic; /* Replaced theme reference for clarity */
  padding-top: 0.5rem;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ItemContent = styled.div`
  overflow: hidden;
`;

const DescriptionWrapper = styled(motion.div)`
  overflow: hidden;
  position: relative;
`;

// *** MODIFIED ***: Added a class and removed hover logic.
const ItemDescription = styled.p.attrs({
    className: 'item-description-trigger'
})`
  font-size: 1.1rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.secondary};
  opacity: 0.8;
  max-width: 600px;
  margin-top: 1.5rem;
  transition: opacity 0.3s ease;
`;

const ProgressBar = styled(motion.div)`
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 2px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 1px;
  overflow: hidden;
  pointer-events: none;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const ProgressFill = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: ${({ theme }) => theme.colors.secondary};
  transform-origin: left;
`;

// --- APPROACH ITEM COMPONENT (No changes needed here) ---

const ApproachItem = ({ number, title, description, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    margin: "0px 0px -50% 0px",
    amount: 0.3 
  });
  const itemInView = useInView(ref, { 
    once: true, 
    margin: "-100px" 
  });

  return (
    <ItemContainer 
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={itemInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <ItemGrid>
        <ItemNumber>({number})</ItemNumber>
        <ItemContent>
          <ItemTitle>{title}</ItemTitle>
          <AnimatePresence mode="wait">
            {isInView && (
              <DescriptionWrapper
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: 1, 
                  height: 'auto', 
                  transition: { 
                    duration: 0.5, 
                    ease: [0.4, 0, 0.2, 1],
                    height: { duration: 0.3 },
                    opacity: { duration: 0.4, delay: 0.1 }
                  } 
                }}
                exit={{ 
                  opacity: 0, 
                  height: 0, 
                  transition: { 
                    duration: 0.3, 
                    ease: [0.4, 0, 0.2, 1],
                    height: { duration: 0.2 },
                    opacity: { duration: 0.2 }
                  } 
                }}
              >
                <ItemDescription>{description}</ItemDescription>
              </DescriptionWrapper>
            )}
          </AnimatePresence>
        </ItemContent>
      </ItemGrid>
      
      <ProgressBar>
        <ProgressFill
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isInView ? 1 : 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />
      </ProgressBar>
    </ItemContainer>
  );
};

// --- MAIN SECTION COMPONENT (No changes needed here) ---

const ApproachSection = forwardRef((props, ref) => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <SectionContainer 
      ref={ref} 
      style={props.style}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      <SectionHeader
        ref={headerRef}
        initial={{ opacity: 0, x: -20 }}
        animate={headerInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.6 }}
      >
                  <span>About Me</span>
      </SectionHeader>
      <ApproachList>
        {approachData.map((item, index) => (
          <ApproachItem key={item.number} {...item} index={index} />
        ))}
      </ApproachList>
    </SectionContainer>
  );
});

export default ApproachSection;