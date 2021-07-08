import styles from './Carousel.module.css';
import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import SlideLocation from './Location/Location';
import { ArrowBack, ArrowForward } from '@material-ui/icons';
import useWindowSize from '../../hooks/WindowDimension/WindowDimension';
import { TramRounded } from '@material-ui/icons';
const MyCarousel = () => {
  const size = useWindowSize();

  let visslides = 3;
  

  if (size.width < 600) {
    visslides = 1.5;
    

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
    data && <div className={styles.carousel}>
      <CarouselProvider
        isIntrinsicHeight={true}
        totalSlides={data.length}
        visibleSlides={visslides}
        infinite={true}
      >
        <RenderSlides beaches={data}></RenderSlides>
        <div className={styles.buttons}>
          <ButtonBack className={styles.buttonback}><ArrowBack></ArrowBack></ButtonBack>
          <ButtonNext className={styles.buttonnext}><ArrowForward></ArrowForward></ButtonNext>
        </div>
      </CarouselProvider>
    </div>
  );
}

function RenderSlides({beaches}) {
  return (
    <Slider className={styles.slider}>
      {
        beaches.map((beach, index) => 
          <Slide key={beach.id} index={index}><SlideLocation info={beach}></SlideLocation></Slide>
        )
      }
    </Slider>
  )
}


async function getData() {
  const res = await fetch('https://snorkel-backend.herokuapp.com/spots/get')
  const data =  await res.json()
  
  return data.data;
}


export default MyCarousel;