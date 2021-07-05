import styles from './Carousel.module.css';
import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import SlideLocation from './Location/Location';

import useWindowSize from '../../hooks/WindowDimension/WindowDimension';
const MyCarousel = () => {
    const size = useWindowSize();
    
    let visslides = 3;
    let slideheight = 150;
    let slidewidth = 100;

    if (size.width < 600){
        visslides = 1.5;
        slideheight = 150;
        slidewidth = 100;
        
    }
    React.useEffect(()=>{

    }, [visslides])
    const info = {
        "hello": "moto",
        "nice": "day"
    };
    return (
    <div className={styles.carousel}>
    <CarouselProvider
    naturalSlideWidth={slideheight}
    naturalSlideHeight={slidewidth}
    totalSlides={6}
    visibleSlides={visslides}
    infinite={true}
  >
      
         
      
      
      <Slider className={styles.slider}>
          <Slide index={0}><SlideLocation info={info}></SlideLocation></Slide>
          <Slide index={1}><SlideLocation info={info}></SlideLocation></Slide>
          <Slide index={2}><SlideLocation info={info}></SlideLocation></Slide>
          <Slide index={3}><SlideLocation info={info}></SlideLocation></Slide>
          <Slide index={4}><SlideLocation info={info}></SlideLocation></Slide>
          <Slide index={5}><SlideLocation info={info}></SlideLocation></Slide>
        </Slider>
        <div className={styles.buttons}>
        <ButtonBack>Back</ButtonBack>
          <ButtonNext>Next</ButtonNext>
          </div>
        
       
  </CarouselProvider>
  </div>
);}

export default MyCarousel;