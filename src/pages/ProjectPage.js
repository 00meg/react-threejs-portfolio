import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// --- IMPORTS ---
import { projects } from '../data/projects'; 
import Typewriter from '../components/Typewriter';
import HoverAnimatedText from '../components/HoverAnimatedText';
import CyclingImage from '../components/CyclingImage';

// --- STYLED COMPONENTS ---
const ProjectContainer = styled.div`
  padding: 6rem 3rem 4rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  overflow-x: hidden;
  @media (max-width: 768px) {
    padding: 5rem 1.5rem 3rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 0.95rem;
  font-weight: 400;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.7;
  &:hover {
    font-weight: 700;
    transform: translateX(-8px);
    opacity: 1;
  }
`;

const ProjectHeader = styled(motion.div)`
  margin-bottom: 4rem;
`;

const ProjectTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  min-height: 6rem;
  @media (max-width: 768px) {
    min-height: 4rem;
  }
`;

const ProjectMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.secondary};
  opacity: 0.7;
  flex-wrap: wrap;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 1rem;
  &:not(:last-child)::after {
    content: '•';
    opacity: 0.5;
  }
`;

const HeroImageContainer = styled.div`
  width: 100%;
  height: 80vh;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 4rem;
  position: relative;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
`;

const HeroImage = styled(motion.div)`
  width: 100%;
  height: 115%;
  background-image: url(${({ $src }) => $src});
  background-size: cover;
  background-position: center;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  margin-top: 4rem;
  color: ${({ theme }) => theme.colors.secondary};
  max-width: 800px;
  letter-spacing: -0.02em;
`;

const ProjectDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.colors.secondary};
  opacity: 0.85;
  max-width: 960px;
`;

const ProjectDetails = styled.div`
  font-size: 1rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.secondary};
  opacity: 0.85;
  margin-bottom: 4rem;
  max-width: 960px;
  b {
    font-weight: 600;
    opacity: 1;
    color: ${({ theme }) => theme.colors.secondary};
  }
  i {
    opacity: 0.8;
  }
`;

const ImageGrid = styled.div`
  display: grid;
  gap: 2rem;
  margin: 3rem 0 4rem;
  grid-template-columns: ${({ $columns }) =>
    $columns ? `repeat(${$columns}, 1fr)` : 'repeat(auto-fit, minmax(300px, 1fr))'};
  @media (max-width: 768px) {
    grid-template-columns: ${({ $columns }) => $columns ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))'};
    gap: 1.5rem;
  }
`;

const WideImageGrid = styled(ImageGrid)`
  transform: scale(1.08);

  &:hover {
    transform: scale(1.07);
  }
  
  @media (max-width: 768px) {
    transform: scale(1);
     &:hover {
      transform: scale(1);
    }
  }
`;

// UPDATED: Better image container solution
const ProjectImage = styled(motion.div)`
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background-color: transparent;
  
  /* If aspect ratio is specified, use it */
  ${({ $aspectRatio }) => $aspectRatio && $aspectRatio !== 'auto' && `
    aspect-ratio: ${$aspectRatio};
  `}

  /* For auto aspect ratio, let image determine height */
  ${({ $aspectRatio }) => (!$aspectRatio || $aspectRatio === 'auto') && `
    img {
      width: 100%;
      height: auto;
      display: block;
            object-fit: fill;

    }
  `}

  /* For fixed aspect ratio, position image absolutely */
  ${({ $aspectRatio }) => $aspectRatio && $aspectRatio !== 'auto' && `
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
  `}

  &:hover {
    transform: scale(0.99);
  }
`;

// ✨ START: NEW COMPONENTS FOR TRANSPARENT IMAGES
const FloatingImageGrid = styled(motion.div)`
  display: grid;
  gap: 1rem; /* Smaller gap for these images */
  margin: 2rem 0;
`;

const FloatingImage = styled.div`
  img {
    width: 100%;
    height: auto;
  }
`;
// ✨ END: NEW COMPONENTS FOR TRANSPARENT IMAGES


const MediaRow = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding: 0 4px 1rem;
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const MediaItemContainer = styled(motion.div)`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

// UPDATED: Fixed media image wrapper
const MediaImageWrapper = styled.div`
  height: 55vh;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background-color: transparent;

  &:hover {
    transform: scale(0.99);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;


const Caption = styled.p`
  font-size: 0.8rem;
  text-align: left;
  color: ${({ theme }) => theme.colors.secondary};
  opacity: 0.6;
  margin: 0;
  padding: 0 0.25rem;
`;


const MainVideoContainer = styled(motion.div)`
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  margin: 4rem 0;
  position: relative;
  
  video {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, 1fr);
  gap: 1.5rem;
  margin: 3rem 0 4rem;
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

// UPDATED: Fixed video container
const VideoContainer = styled(motion.div)`
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  aspect-ratio: ${({ $aspectRatio }) => $aspectRatio || '16 / 9'};
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background-color: transparent;

  &:hover {
    transform: scale(0.99);
  }

  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const NavigationLinks = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 6rem;
  padding-top: 3rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const NavLink = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    transform: translateX(${props => props.$align === 'right' ? '10px' : '-10px'});
  }
  span {
    font-size: 0.9rem;
    opacity: 0.6;
  }
  &[data-align="right"] {
    text-align: right;
  }
`;


// --- RENDERER COMPONENTS ---
const ParallaxWrapper = ({ children, speed = -1, type = 'default' }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ['start end', 'end start'],
    });

    // Disable parallax for headings and certain content types to prevent overlapping
    const shouldDisableParallax = type === 'heading' || type === 'overview';
    const effectiveSpeed = shouldDisableParallax ? 0 : speed;

    const y = useTransform(scrollYProgress, [0, 1], [`${effectiveSpeed}%`, `${-effectiveSpeed}%`]);
    const smoothY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 });

    return (
      <motion.div ref={ref} style={{ y: shouldDisableParallax ? 0 : smoothY }}>
        {children}
      </motion.div>
    );
};

const ContentRenderer = ({ content }) => {
  return content.map((block, index) => {
    const motionProps = {
      key: index,
      initial: { opacity: 0, y: 40 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.2 },
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
    };

    return (
        <ParallaxWrapper key={index} type={block.type} speed={-0.5}>
            {(() => {
                switch (block.type) {
                
                case 'cyclingImage':
                  return (
                    <motion.div {...motionProps}>
                      <CyclingImage images={block.images} interval={2000} />
                    </motion.div>
                  );
                
                // ✨ ADD NEW CASE FOR TRANSPARENT IMAGES
                case 'floatingImageGrid':
                  return (
                    <FloatingImageGrid {...motionProps}>
                      {block.images?.map((imgSrc, i) => (
                        <FloatingImage key={i}>
                          <img src={imgSrc} alt={`Key feature screenshot ${i + 1}`} />
                        </FloatingImage>
                      ))}
                    </FloatingImageGrid>
                  );

                case 'wideImageGrid':
                  return (
                    <WideImageGrid $columns={block.columns}>
                      {block.images?.map((imgSrc, i) => (
                        <ProjectImage
                          key={i}
                          $aspectRatio={block.aspectRatio}
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ duration: 0.6, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                        >
                          <img src={imgSrc} alt={`Key feature ${i + 1}`} />
                        </ProjectImage>
                      ))}
                    </WideImageGrid>
                  );

                case 'mediaRow':
                    return (
                    <motion.div {...motionProps}>
                        <MediaRow>
                        {block.items.map((item, i) => (
                            <MediaItemContainer key={i}>
                                <MediaImageWrapper>
                                    <img src={item.url} alt={item.caption || `Adaptation ${i + 1}`} />
                                </MediaImageWrapper>
                                {item.caption && <Caption>{item.caption}</Caption>}
                            </MediaItemContainer>
                        ))}
                        </MediaRow>
                    </motion.div>
                    );

                case 'overview':
                    return (
                    <motion.div {...motionProps} transition={{ duration: 0.8, delay: 0.3 }}>
                        <SectionTitle>Overview</SectionTitle>
                        <ProjectDescription dangerouslySetInnerHTML={{ __html: block.text }} />
                    </motion.div>
                    );

                case 'details':
                    return (
                    <motion.div {...motionProps}>
                        <ProjectDetails dangerouslySetInnerHTML={{ __html: block.text }} />
                    </motion.div>
                    );

                case 'heading':
                    return (
                    <motion.div {...motionProps}>
                        <SectionTitle>{block.text}</SectionTitle>
                    </motion.div>
                    );

                case 'mainVideo':
                    return (
                    <MainVideoContainer {...motionProps}>
                        <video src={block.videoUrl} controls autoPlay muted loop />
                    </MainVideoContainer>
                    );

                case 'imageGrid':
                    return (
                    <ImageGrid $columns={block.columns}>
                        {block.images?.map((imgSrc, i) => (
                        <ProjectImage
                            key={i}
                            $aspectRatio={block.aspectRatio}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                        >
                            <img src={imgSrc} alt={`Project gallery image ${i + 1}`} />
                        </ProjectImage>
                        ))}
                    </ImageGrid>
                    );

                case 'videoGrid':
                    return (
                    <VideoGrid $columns={block.columns || 2}>
                        {block.videos?.map((videoSrc, i) => (
                        <VideoContainer
                            key={i}
                            $aspectRatio={block.aspectRatio}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                        >
                            <video src={videoSrc} autoPlay loop muted playsInline />
                        </VideoContainer>
                        ))}
                    </VideoGrid>
                    );

                default:
                    return null;
                }
            })()}
      </ParallaxWrapper>
    )
  });
};


// --- MAIN PAGE COMPONENT ---
const ProjectPage = () => {
  const { projectId } = useParams();
  const heroImageRef = useRef(null);

  const project = projects.find(p => p.id === projectId);
  const currentIndex = projects.findIndex(p => p.id === projectId);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  const { scrollYProgress } = useScroll({
    target: heroImageRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const heroY = useTransform(smoothProgress, [0, 1], ["0%", "-10%"]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  if (!project) {
    return (
      <ProjectContainer>
        <ContentWrapper>
          <h1>Project not found</h1>
          <BackButton to="/works">
            <HoverAnimatedText text="← Back to Works" />
          </BackButton>
        </ContentWrapper>
      </ProjectContainer>
    );
  }

  return (
    <ProjectContainer>
      <ContentWrapper>
        <BackButton to="/works">
          <HoverAnimatedText text="← Back to Works" />
        </BackButton>

        <ProjectHeader
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <ProjectTitle>
            <Typewriter key={project.id} text={project.title} />
          </ProjectTitle>
          <ProjectMeta>
            {project.categories.map(cat => <MetaItem key={cat}>{cat}</MetaItem>)}
            <MetaItem>{project.year}</MetaItem>
          </ProjectMeta>
        </ProjectHeader>

        <HeroImageContainer ref={heroImageRef}>
          <HeroImage
            $src={project.images.cover}
            style={{ y: heroY }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          />
        </HeroImageContainer>

        <ContentRenderer content={project.content} />

        <NavigationLinks>
          {prevProject ? (
            <NavLink to={`/work/${prevProject.id}`} $align="left">
              <span><HoverAnimatedText text="← Previous" /></span>
              <HoverAnimatedText text={prevProject.title} />
            </NavLink>
          ) : <div />}
          {nextProject ? (
            <NavLink to={`/work/${nextProject.id}`} data-align="right" $align="right">
              <span><HoverAnimatedText text="Next →" /></span>
              <HoverAnimatedText text={nextProject.title} />
            </NavLink>
          ) : <div />}
        </NavigationLinks>
      </ContentWrapper>
    </ProjectContainer>
  );
};

export default ProjectPage;