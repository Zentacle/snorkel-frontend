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

  if (size.width < 600) {
    visslides = 1.5;
    slideheight = 100;
    slidewidth = 100;

  }
  React.useEffect(() => {

  }, [visslides])
  const info = {
    "hello": "moto",
    "nice": "day"
  };
  let slides = [];
  for (let i = 0; i < 6; i++) {
    slides.push(<Slide key={i} index={0}><SlideLocation info={info}></SlideLocation></Slide>);
  }

  return (
    <div className={styles.carousel}>
      <CarouselProvider
        naturalSlideWidth={slideheight}
        naturalSlideHeight={slidewidth}
        totalSlides={6}
        visibleSlides={visslides}
        infinite={true}>
        <Slider className={styles.slider}>
          {slides}
        </Slider>
        <div className={styles.buttons}>
          <ButtonBack>Back</ButtonBack>
          <ButtonNext>Next</ButtonNext>
        </div>
      </CarouselProvider>
    </div>
  );
}

async function getData() {
  const res = await fetch('https://snorkel-backend.herokuapp.com/spots/get')
  const data = await res.json()
  console.log(data);
  return data;
}


export default MyCarousel;