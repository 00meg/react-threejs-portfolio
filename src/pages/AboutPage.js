// src/pages/AboutPage.js
import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import Typewriter from '../components/Typewriter';

const aboutData = [
  {
    number: '01',
    title: 'I start by understanding.',
    description: 'Good design begins with context. I take time to understand the people, the space, and the system I\'m designing for — asking questions, mapping needs, and listening before I act.',
  },
  {
    number: '02',
    title: 'I think in systems.',
    description: 'I don\'t just design screens or visuals — I think about how everything fits together. Whether it\'s a product, an installation, or a toolkit, I aim for experiences that are coherent, flexible, and future-friendly.',
  },
  {
    number: '03',
    title: 'I prototype early.',
    description: 'I believe in testing ideas quickly — through sketches, motion, or code. Prototyping helps me stay grounded and discover what actually works, not just what sounds good on paper.',
  },
  {
    number: '04',
    title: 'I design for people.',
    description: 'For me, usability and emotion go hand in hand. I care about clarity, timing, interaction, and feeling — because even the smallest detail can change how someone experiences a system.',
  },
  {
    number: '05',
    title: 'I build what I imagine.',
    description: 'I work across design and development — from UX and motion to code and integration. This lets me carry ideas through to the end and make sure the final result stays true to the vision.',
  },
  {
    number: '06',
    title: 'I believe in evolving work.',
    description: 'Projects rarely end with delivery. I like building things that can grow, adapt, or be reused in new ways — tools, formats, systems that keep generating value over time.',
  },
];

// Data for the image stack including scattered positions
const imageData = [
  {
    src: '/mee.png',
    alt: 'A portrait of Meg',
    z: 1,
    rotate: -8,
    x: '-45%',
    y: '-25%',
  },
  {
    src: '/me1.jpg',
    alt: 'Meg working on a project',
    z: 2,
    rotate: 5,
    x: '35%',
    y: '0%',
  },
  {
    src: '/me2.jpg',
    alt: 'A candid shot of Meg',
    z: 0,
    rotate: 10,
    x: '-15%',
    y: '50%',
  },
];

// --- STYLED COMPONENTS ---

const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  align-items: center;
  gap: 4rem;
  padding: 0 3rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    min-height: 0;
    padding: 15vh 1.5rem 8vh;
    text-align: center;
    gap: 2rem;
  }

  @media (max-width: 768px) {
    padding: 12vh 1.5rem 6vh;
  }
`;

const HeroContent = styled(motion.div)`
  z-index: 1;
  
  @media (max-width: 968px) {
    order: 2;
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  margin: 0 0 3rem 0;
  letter-spacing: -0.03em;
  line-height: 1;

  @media (max-width: 968px) {
    font-size: clamp(2.5rem, 8vw, 4rem);
    margin-bottom: 2.5rem;
  }
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
`;

const IntroText = styled(motion.p)`
  font-size: 1.05rem;
  line-height: 1.75;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.secondary};
  opacity: 0.85;
  margin: 0;
  
  &:first-child {
    font-size: 1.15rem;
    font-weight: 500;
    opacity: 0.95;
    line-height: 1.6;
  }
  
  @media (max-width: 968px) {
    margin-left: auto;
    margin-right: auto;
    text-align: left;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    
    &:first-child {
      font-size: 1.1rem;
    }
  }
`;

const ImageStackContainer = styled(motion.div)`
  position: relative;
  width: clamp(280px, 30vw, 380px);
  height: calc(clamp(280px, 30vw, 380px) * 1.25);
  justify-self: center;
  align-self: center;
  
  @media (max-width: 968px) {
    order: 1;
    margin-bottom: 2rem;
    height: calc(clamp(260px, 60vw, 320px) * 1.25);
    width: clamp(260px, 60vw, 320px);
  }
`;

const StackedImage = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.border};
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: box-shadow 0.4s ease;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.95);
    transition: filter 0.4s ease;
  }
  
  &:hover {
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    
    img {
      filter: brightness(1);
    }
  }
`;

// --- MY APPROACH SECTION STYLES ---

const MyApproachSection = styled(motion.section)`
  padding: 8rem 3rem 10rem;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 6rem 1.5rem 8rem;
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

// --- ANIMATED APPROACH ITEM COMPONENT ---

const MyApproachItem = ({ number, title, description, index }) => {
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

// --- MAIN ABOUT PAGE COMPONENT ---

const AboutPage = () => {
  const heroRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(1); // Default to middle image

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const smoothHeroProgress = useSpring(heroProgress, { stiffness: 100, damping: 30 });
  const textY = useTransform(smoothHeroProgress, [0, 1], ["0%", "-20%"]);

  // Individual parallax transforms for each image
  const parallaxTransforms = [
    useTransform(smoothHeroProgress, [0, 1], ["0%", "-25%"]),
    useTransform(smoothHeroProgress, [0, 1], ["0%", "-5%"]),
    useTransform(smoothHeroProgress, [0, 1], ["0%", "15%"])
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getScale = (index) => {
    if (index === activeIndex) return 1.1;
    if (index === hoveredIndex) return 1.05;
    return 1;
  };

  const getZIndex = (index, baseZ) => {
    if (index === hoveredIndex) return 20;
    if (index === activeIndex) return 10;
    return baseZ;
  };

  return (
    <PageWrapper>
      <HeroSection ref={heroRef}>
        <HeroContent style={{ y: textY }}>
          <Title
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <Typewriter text="Driven by purpose." />
          </Title>
          
          <TextGroup>
            <IntroText
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              For me, creating isn't just a job — it's a way of being in the world. Every project I take on is a space of meaning: a chance to explore, to connect, to build something that resonates.
            </IntroText>
            
            <IntroText
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              I don't just want to make things that work — I want to make things that matter. That move people. That carry intention, clarity, and care.
            </IntroText>
            
            <IntroText
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              I come from a hybrid path — psychology and media design — which means I look at systems both emotionally and structurally. I think about interfaces, spaces, and experiences as narratives in motion: alive, responsive, open to interaction.
            </IntroText>
            
            <IntroText
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.4, 0, 0.2, 1] }}
            >
              From the first spark to the final layer of polish, I'm involved. I like to be inside the process — designing, developing, refining. Not just crafting how something functions, but how it feels, and why it's there in the first place.
            </IntroText>
            
            <IntroText
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
              Because in the end, I believe every detail is a chance to say something. To create meaning — and leave a trace.
            </IntroText>
          </TextGroup>
        </HeroContent>

        <ImageStackContainer>
          {imageData.map((image, index) => (
            <StackedImage
              key={index}
              style={{ x: image.x, y: `calc(${image.y} + ${parallaxTransforms[index].get()})` }} 
              initial={{
                scale: 0.8,
                opacity: 0,
              }}
              animate={{
                opacity: 1,
                rotate: activeIndex === index ? 0 : image.rotate,
                scale: getScale(index),
                zIndex: getZIndex(index, image.z),
              }}
              transition={{
                type: 'spring',
                stiffness: 350,
                damping: 30,
              }}
              onClick={() => setActiveIndex(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img src={image.src} alt={image.alt} />
            </StackedImage>
          ))}
        </ImageStackContainer>
      </HeroSection>

      <MyApproachSection>
        <SectionHeader
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <span>My Approach</span>
        </SectionHeader>
        
        <ApproachList>
          {aboutData.map((item, index) => (
            <MyApproachItem key={item.number} {...item} index={index} />
          ))}
        </ApproachList>
      </MyApproachSection>
    </PageWrapper>
  );
};

export default AboutPage;