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
  
  
  const [data, setData] = React.useState(null);
  React.useEffect(()=>{
    getData().then((data) => setData(data));

  }, []);
  
  

  return (
    <div className={styles.carousel}>
      <CarouselProvider
        naturalSlideWidth={slideheight}
        naturalSlideHeight={slidewidth}
        totalSlides={6}
        visibleSlides={visslides}
        infinite={true}>
        {data && <RenderSlides posts={data}></RenderSlides>}
        <div className={styles.buttons}>
          <ButtonBack>Back</ButtonBack>
          <ButtonNext>Next</ButtonNext>
        </div>
      </CarouselProvider>
    </div>
  );
}

function RenderSlides({posts}) {
  let slides = [];
  
  for (let i = 0; i < posts.length; i++) {
    slides.push(<Slide key={i} index={i}><SlideLocation info={posts[i]}></SlideLocation></Slide>);
  }
  return (
    <Slider className={styles.slider}>
          {slides}
        </Slider>
  )
}


async function getData() {
  const res = await fetch('https://snorkel-backend.herokuapp.com/spots/get')
  const data =  await res.json()
  
  return data.data;
}


export default MyCarousel;