import styles from './Carousel.module.css';
import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import SlideLocation from './Location/Location';
import { ArrowBack, ArrowForward } from '@material-ui/icons';
import useWindowSize from '../../hooks/WindowDimension/WindowDimension';
import { rootDomain } from 'lib/constants';

const MyCarousel = (props) => {
  const [data, setData] = React.useState(props.data);

  return (
    data && <div className={styles.carousel}>
      { data.map(beach => (<SlideLocation key={ beach.id } info={beach}></SlideLocation>)) }
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

export default MyCarousel;