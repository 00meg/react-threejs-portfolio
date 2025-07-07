// src/pages/HomePage.js
import React, { useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Typewriter from '../components/Typewriter';
import ApproachSection from '../components/ApproachSection';
import HoverAnimatedText from '../components/HoverAnimatedText';
import ImmersiveVideo from '../components/ImmersiveVideo';
import { projects } from '../data/projects';

// --- Styled components are unchanged, so they are omitted for brevity ---
// ...
const PageWrapper = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
`;

const HeroSection = styled.section`
  height: 90vh;
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
    height: 85vh;
    padding: 0 1.5rem;
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(1rem, 8vw, 3rem); /* Increased from previous size */
  font-weight: 700;
  margin: 0 0 2rem 0;
  letter-spacing: 0.01em;
  line-height: 0.95;

  @media (max-width: 768px) {
    font-size: clamp(3rem, 10vw, 5rem);
    margin-bottom: 1.5rem;
  }
`;

const IntroText = styled(motion.p)`
  font-size: 0.9rem;
  line-height: 1.7;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.secondary};
  max-width: 45%; /* Constrained to 35% of container width */
  opacity: 0.9;

  @media (max-width: 1024px) {
    max-width: 50%;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    font-size: 1rem;
  }
`;

const WorksPreviewSection = styled(motion.section)`
  padding: 6rem 3rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const WorksSectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
  
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
  }
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ProjectItem = styled(motion.div)`
  cursor: pointer;
  position: relative;
`;

const ImageContainer = styled(motion.div)`
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  aspect-ratio: 16/11;
  background: ${({ theme }) => theme.colors.border};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.1);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  &:hover {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
    
    img {
      transform: scale(1);
    }
  }
`;

const CategoryTagContainer = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  z-index: 2;
`;

const CategoryTag = styled.div`
  background: ${({ theme }) => `${theme.colors.primary}99`};
  color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => `${theme.colors.secondary}33`};
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: ${({ theme }) => theme.fontWeights.book};
  font-style: ${({ theme }) => theme.fontStyles.italic};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${ProjectItem}:hover & {
    background: ${({ theme }) => `${theme.colors.primary}CC`};
    border-color: ${({ theme }) => `${theme.colors.secondary}66`};
    transform: scale(1.03);
  }
`;

const ProjectInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 1.2rem;
  padding: 0 0.5rem;
`;

const WorkTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.secondary};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: -0.02em;
  
  ${ProjectItem}:hover & {
    font-weight: 700;
    transform: translateX(5px);
  }
`;

const WorkYear = styled.span`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: ${({ theme }) => theme.fontWeights.book};
  font-style: ${({ theme }) => theme.fontStyles.italic};
  opacity: 0.5;
  transition: opacity 0.3s ease;
  
  ${ProjectItem}:hover & {
    opacity: 0.7;
  }
`;

const SeeAllButtonWrapper = styled(motion.div)`
  display: flex;
  justify-content: flex-end;
`;

const SeeAllButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  position: relative;
  padding: 0.75rem 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
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

  const titleY = useTransform(scrollYSpring, [0, 500], [0, -60]);
  const textY = useTransform(scrollYSpring, [0, 500], [0, -40]);

  const { scrollYProgress: worksScrollProgress } = useScroll({
    target: worksRef,
    offset: ['start end', 'end start'],
  });

  const worksY = useTransform(worksScrollProgress, [0, 1], [60, -60]);
  const worksOpacity = useTransform(worksScrollProgress, [0, 0.3], [0, 1]);

  const { scrollYProgress: approachScrollProgress } = useScroll({
    target: approachRef,
    offset: ['start end', 'end start'],
  });

  const approachY = useTransform(approachScrollProgress, [0, 1], [40, -40]);
  const featuredProjects = projects.slice(0, 4);

  return (
    <PageWrapper>
      <HeroSection>
        <Title style={{ y: titleY }}>
          <Typewriter text="Cross-Media Digital Experiences" />
        </Title>
        <IntroText style={{ y: textY }}>
          I design interactive systems across digital and physical formats—ranging from websites 
          and installations to motion graphics and audiovisual environments. I work on UI/UX design, 
          audiovisual production for immersive spaces, and motion content for web and communication.
        </IntroText>
      </HeroSection>

      <ImmersiveVideo />

      <WorksPreviewSection ref={worksRef}>
        <motion.div style={{ y: worksY, opacity: worksOpacity }}>
          <WorksSectionHeader>
            <span>Selected Works</span>
          </WorksSectionHeader>
          
          <ProjectsGrid>
            {featuredProjects.map((project, index) => (
              <ProjectItem
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <Link to={`/work/${project.id}`}>
                  <ImageContainer>
                    {/* Display all categories */}
                    <CategoryTagContainer>
                      {project.categories.map((category, catIndex) => (
                        <CategoryTag key={catIndex}>{category}</CategoryTag>
                      ))}
                    </CategoryTagContainer>
                    {/* Use the new image structure */}
                    <img src={project.images.cover} alt={project.title} />
                  </ImageContainer>
                  <ProjectInfo>
                    <WorkTitle>{project.title}</WorkTitle>
                    <WorkYear>{project.year}</WorkYear>
                  </ProjectInfo>
                </Link>
              </ProjectItem>
            ))}
          </ProjectsGrid>
          
          <SeeAllButtonWrapper
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
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