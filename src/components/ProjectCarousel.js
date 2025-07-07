// src/components/ProjectCarousel.js
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import styled from 'styled-components';

// Import Swiper styles, including Navigation
import 'swiper/css';
import 'swiper/css/navigation';

const CarouselContainer = styled.div`
  margin: 2rem 0 4rem;
  width: 100%;
  position: relative; /* Needed for navigation arrows */

  /* Style the navigation arrows */
  .swiper-button-next,
  .swiper-button-prev {
    color: #ffffff;
    opacity: 0.5;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;
    }

    &::after {
      font-size: 1.5rem; /* Make arrows smaller */
    }
  }

  .swiper-slide {
    height: 45vh; /* A consistent height for all slides */
    background-color: #111; /* Background for any letterboxing */
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);

    @media (max-width: 768px) {
      height: 40vh;
    }
  }
`;

const SlideMedia = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  img, video {
    display: block;
    width: 100%;
    height: 100%;
    /* This will fill the container, cropping if necessary to maintain aspect ratio */
    object-fit: cover; 
  }
`;

const ProjectCarousel = ({ items }) => {
  return (
    <CarouselContainer>
      <Swiper
        modules={[Autoplay, Navigation]}
        navigation={true} /* Adds Next/Prev arrows */
        spaceBetween={30}
        // Responsive breakpoints
        breakpoints={{
          // when window width is >= 320px
          320: {
            slidesPerView: 1,
            spaceBetween: 20
          },
          // when window width is >= 768px
          768: {
            slidesPerView: 2,
            spaceBetween: 30
          },
          // when window width is >= 1024px
          1024: {
            slidesPerView: 3,
            spaceBetween: 30
          }
        }}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        className="mySwiper"
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <SlideMedia>
              {item.type === 'image' ? (
                <img src={item.url} alt={`Carousel slide ${index + 1}`} />
              ) : (
                <video src={item.url} autoPlay loop muted playsInline />
              )}
            </SlideMedia>
          </SwiperSlide>
        ))}
      </Swiper>
    </CarouselContainer>
  );
};

export default ProjectCarousel;