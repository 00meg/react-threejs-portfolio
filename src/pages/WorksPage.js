// src/pages/WorksPage.js
import React, { useState, useMemo, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { projects, categories } from '../data/projects'; // categories are now dynamically generated
import Typewriter from '../components/Typewriter';
import HoverAnimatedText from '../components/HoverAnimatedText';

// --- Styled components are unchanged, so they are omitted for brevity ---
// (WorksContainer, WorksHeader, FilterButton, etc.)
// ...
const WorksContainer = styled.div`
  padding: 6rem 3rem 4rem;
  max-width: 1600px;
  margin: 0 auto;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 5rem 1.5rem 3rem;
  }
`;

const WorksHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline; /* Align title and filters at same baseline */
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
`;

const PageTitle = styled(motion.h1)`
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 700;
  margin: 0; /* Remove margin since container handles spacing */
  text-align: left;
  letter-spacing: -0.03em;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin: 0; /* Remove margin since header container handles spacing */

  @media (max-width: 768px) {
    justify-content: center;
    width: 100%;
  }
`;

const FilterButton = styled(motion.button)`
  background: ${({ $isActive, theme }) => 
    $isActive ? 'transparent' : 'transparent'};
  border: 1px solid ${({ $isActive, theme }) => 
    $isActive ? theme.colors.secondary : theme.colors.border};
  color: ${({ theme }) => theme.colors.secondary};
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: ${({ $isActive }) => $isActive ? '700' : '400'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${({ $isActive }) => $isActive ? '1' : '0.7'};

  &:hover {
    border-color: ${({ theme }) => theme.colors.secondary};
    font-weight: 700;
    opacity: 1;
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  }
`;

const WorksGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 2.5rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const WorkItem = styled(motion.div)`
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
    transform: scale(1.15);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  &:hover {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
    
    img {
      transform: scale(1.08);
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
  
  ${WorkItem}:hover & {
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
  
  ${WorkItem}:hover & {
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
  
  ${WorkItem}:hover & {
    opacity: 0.7;
  }
`;


const WorksPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const containerRef = useRef(null);
  
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;
    // Updated filter logic for the array
    return projects.filter(project => project.categories.includes(activeFilter));
  }, [activeFilter]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <WorksContainer ref={containerRef}>
      <WorksHeader>
        <PageTitle 
          style={{ y: titleY }}
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
        >
          <Typewriter text="Selected Works" />
        </PageTitle>
        
        <FilterContainer>
          {/* Use the dynamically generated categories */}
          {categories.map((category) => (
            <FilterButton
              key={category}
              $isActive={activeFilter === category}
              onClick={() => setActiveFilter(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <HoverAnimatedText text={category} />
            </FilterButton>
          ))}
        </FilterContainer>
      </WorksHeader>
      
      <AnimatePresence mode="wait">
        <WorksGrid
          key={activeFilter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          {filteredProjects.map((project, index) => (
            <WorkItem
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
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
            </WorkItem>
          ))}
        </WorksGrid>
      </AnimatePresence>
    </WorksContainer>
  );
};

export default WorksPage;