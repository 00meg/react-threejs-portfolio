// src/pages/HomePage.js
import React, { useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Typewriter from '../components/Typewriter';
import ApproachSection from '../components/ApproachSection';
import HoverAnimatedText from '../components/HoverAnimatedText';
import { projects } from '../data/projects';

// --- Styled components ---

const PageWrapper = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  overflow-x: hidden;
`;

const HeroSection = styled.section`
  height: 85vh; /* Slightly reduced to show more of the cards */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 3rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 80vh;
    padding: 0 1.5rem;
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(2rem, 7vw, 3.5rem);
  font-weight: 700;
  margin: 0 0 2rem 0;
  letter-spacing: -0.02em;
  line-height: 0.95;

  @media (max-width: 768px) {
    font-size: clamp(2.5rem, 9vw, 4rem);
    margin-bottom: 1.5rem;
  }
`;

const IntroText = styled(motion.p)`
  font-size: 1rem;
  line-height: 1.7;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.secondary};
  max-width: 50%;
  opacity: 0.85;

  @media (max-width: 1024px) {
    max-width: 60%;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    font-size: 0.95rem;
  }
`;

const WorksPreviewSection = styled(motion.section)`
  padding: 0 3rem 6rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  margin-top: -15vh; /* Less aggressive pull-up for better initial visibility */
  z-index: 10;

  @media (max-width: 768px) {
    padding: 0 1.5rem 4rem;
    margin-top: -10vh;
  }
`;

const WorksSectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
  
  span {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.secondary};
    opacity: 0.6;
    text-transform: uppercase;
    letter-spacing: 0.08em;
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

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.75rem;
  margin-bottom: 3.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ProjectItem = styled(motion.div)`
  cursor: pointer;
  position: relative;
  will-change: transform;
`;

const ImageContainer = styled(motion.div)`
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  aspect-ratio: 16/12;
  background: ${({ theme }) => theme.colors.border};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    will-change: transform;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 70%, rgba(0, 0, 0, 0.2) 100%);
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  
  &:hover {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    transform: translateY(-6px);
    
    &::after {
      opacity: 1;
    }
  }
`;

const CategoryTagContainer = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  z-index: 2;
`;

const CategoryTag = styled.div`
  background: ${({ theme }) => `${theme.colors.primary}CC`};
  color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => `${theme.colors.secondary}26`};
  padding: 0.35rem 0.85rem;
  border-radius: 18px;
  font-size: 0.75rem;
  font-weight: 500;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${ProjectItem}:hover & {
    background: ${({ theme }) => `${theme.colors.primary}F2`};
    border-color: ${({ theme }) => `${theme.colors.secondary}4D`};
    transform: translateY(-2px) scale(1.02);
  }
`;

const ProjectInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 1rem;
  padding: 0 0.25rem;
`;

const WorkTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: -0.01em;
  
  ${ProjectItem}:hover & {
    transform: translateX(4px);
  }
`;

const WorkYear = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 400;
  opacity: 0.5;
  transition: opacity 0.3s ease;
  
  ${ProjectItem}:hover & {
    opacity: 0.7;
  }
`;

const SeeAllButtonWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const SeeAllButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  padding: 0.85rem 1.75rem;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 26px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.colors.secondary};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-2px);
    
    &::before {
      transform: scaleX(1);
    }
    
    & > * {
      position: relative;
      z-index: 1;
      color: ${({ theme }) => theme.colors.primary};
    }
  }
  
  &::after {
    content: '→';
    margin-left: 0.25rem;
    transition: transform 0.3s ease;
  }
  
  &:hover::after {
    transform: translateX(4px);
  }
`;

const HomePage = () => {
  const worksRef = useRef(null);
  const approachRef = useRef(null);
  const { scrollY } = useScroll();
  const scrollYSpring = useSpring(scrollY, { stiffness: 100, damping: 30 });

  // Hero parallax
  const titleY = useTransform(scrollYSpring, [0, 500], [0, -50]);
  const textY = useTransform(scrollYSpring, [0, 500], [0, -30]);

  // Works section scroll progress
  const { scrollYProgress: worksScrollProgress } = useScroll({
    target: worksRef,
    offset: ['start end', 'end start'],
  });

  // Enhanced parallax for the entire works section
  const worksY = useTransform(worksScrollProgress, [0, 1], [60, -60]);
  
  // Individual card parallax - different speeds for each row
  const cardRow1Y = useTransform(worksScrollProgress, [0, 1], ['0%', '-15%']);
  const cardRow2Y = useTransform(worksScrollProgress, [0, 1], ['0%', '-10%']);
  
  // Image parallax inside cards
  const imageParallaxY = useTransform(worksScrollProgress, [0, 1], ['-10%', '10%']);

  // Approach section parallax
  const { scrollYProgress: approachScrollProgress } = useScroll({
    target: approachRef,
    offset: ['start end', 'end start'],
  });
  const approachY = useTransform(approachScrollProgress, [0, 1], [40, -40]);

  const featuredProjects = projects.slice(0, 6);

  // Variants for smooth image animations
  const imageVariants = {
    initial: { scale: 1.1 },
    hover: { scale: 1.02 }
  };

  return (
    <PageWrapper>
      <HeroSection>
        <Title 
          style={{ y: titleY }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Typewriter text="Interactive Creative Systems" />
        </Title>
        <IntroText 
          style={{ y: textY }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          I design and develop digital experiences — from websites and interfaces to immersive installations and audiovisual tools.
          I work across UI/UX, motion, and code to turn complex ideas into clear, engaging systems.
        </IntroText>
      </HeroSection>

      <WorksPreviewSection ref={worksRef}>
        <motion.div 
          style={{ y: worksY }}
          initial={{ opacity: 1 }} // Start visible
          animate={{ opacity: 1 }}
        >
          <WorksSectionHeader>
            <span>Selected Works</span>
          </WorksSectionHeader>
          
          <ProjectsGrid>
            {featuredProjects.map((project, index) => {
              // Determine which row for parallax effect
              const cardParallaxY = index < 3 ? cardRow1Y : cardRow2Y;
              
              return (
                <ProjectItem
                  key={project.id}
                  style={{ y: cardParallaxY }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.7, 
                    delay: 0.1 + (index * 0.08),
                    ease: [0.6, -0.05, 0.01, 0.99]
                  }}
                  whileHover="hover"
                >
                  <Link to={`/work/${project.id}`}>
                    <ImageContainer>
                      <CategoryTagContainer>
                        {project.categories.slice(0, 2).map((category, catIndex) => (
                          <CategoryTag key={catIndex}>{category}</CategoryTag>
                        ))}
                      </CategoryTagContainer>
                      <motion.img 
                        src={project.images.cover} 
                        alt={project.title}
                        variants={imageVariants}
                        style={{ y: imageParallaxY }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        loading="lazy"
                      />
                    </ImageContainer>
                    <ProjectInfo>
                      <WorkTitle>{project.title}</WorkTitle>
                      <WorkYear>{project.year}</WorkYear>
                    </ProjectInfo>
                  </Link>
                </ProjectItem>
              );
            })}
          </ProjectsGrid>
          
          <SeeAllButtonWrapper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <SeeAllButton to="/works">
              <HoverAnimatedText text="View All Works" />
            </SeeAllButton>
          </SeeAllButtonWrapper>
        </motion.div>
      </WorksPreviewSection>

      <ApproachSection ref={approachRef} style={{ y: approachY }} />
    </PageWrapper>
  );
};

export default HomePage;