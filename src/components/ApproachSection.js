// src/components/ApproachSection.js
import React, { useRef, forwardRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useInView } from 'framer-motion';

const approachData = [
  {
    number: '01',
    title: 'Creative Process & Tool Design',
    description: 'I design systems that support ideation, prototyping, and creative workflows — from real-time visual tools to modular setups that extend and streamline the design process itself.'
  },
  {
    number: '02',
    title: 'Web & Interactive Experiences',
    description: 'I develop interfaces and digital ecosystems that connect content, interaction, and identity — from experimental platforms to responsive, content-driven websites.'
  },
  {
    number: '03',
    title: 'Spatial & Immersive Design',
    description: 'I create experiences that inhabit physical space — combining sound, motion, light, and interaction in installations, performances, and hybrid formats.'
  },
  {
    number: '04',
    title: 'Audiovisual & Motion Design',
    description: 'I craft visual narratives that move — through animation, motion graphics, and dynamic media for screens, projections, and digital communication.'
  },
  {
    number: '05',
    title: 'Experience & System Design',
    description: 'I approach every project as an interconnected system — thinking across formats and designing for coherence, adaptability, and continuity over time.'
  },
  {
    number: '06',
    title: 'Research & Narrative Strategy',
    description: 'I combine design with research, archival practices, and storytelling — building formats that give shape to memory, emotion, and cultural meaning.'
  }
];

// --- STYLED COMPONENTS ---

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
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.secondary};
    opacity: 0.6;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 500;
  }
  
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.secondary};
    opacity: 0.6;
  }
`;

const ApproachList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemContainer = styled(motion.div)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr;
  gap: 2rem;
  align-items: baseline;
  padding: 2.5rem 0;

  @media (max-width: 768px) {
    gap: 1.5rem;
    padding: 2rem 0;
    grid-template-columns: 50px 1fr;
  }
`;

const ItemNumber = styled(motion.span)`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.secondary};
  opacity: 0.5;
  font-weight: 500;
  padding-top: 0.25rem;
`;

const ItemContent = styled.div`
  overflow: hidden;
`;

const ItemTitle = styled(motion.h3)`
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
  line-height: 1.1;
`;

const DescriptionWrapper = styled(motion.div)`
  overflow: hidden;
  position: relative;
`;

const ItemDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.secondary};
  opacity: 0.7;
  max-width: 720px;
  margin: 0;
`;

const ProgressBar = styled(motion.div)`
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 1px;
  overflow: hidden;
  
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
  opacity: 0.6;
  transform-origin: left;
`;

// --- APPROACH ITEM COMPONENT ---

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
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
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

// --- MAIN SECTION COMPONENT ---

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
        <span>Areas of Practice</span>
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