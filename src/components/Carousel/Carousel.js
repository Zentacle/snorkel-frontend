import styles from './Carousel.module.css';
import React from 'react';
import Image from 'next/image';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import Location from './Location/Location';
import { ArrowBack, ArrowForward } from '@material-ui/icons';
import useWindowSize from '../../hooks/WindowDimension/WindowDimension';
import { rootDomain } from 'lib/constants';

const MyCarousel = (props) => {
  const [data, setData] = React.useState(props.data);
  const [offset, setOffset] = React.useState(0);
  const carousel = React.useRef(null);

  const moveCarousel = (isForward) => () => {
    const direction = isForward ? -1 : 1;
    const cardWidth = 272;
    const numCards = Math.floor(carousel.current.offsetWidth / cardWidth);
    const newOffset = offset + ((cardWidth * numCards) * direction);
    const scrollWidth = carousel.current.scrollWidth;
    const maxScroll = (scrollWidth - (carousel.current.offsetWidth - 16) ) * -1;
    if (newOffset < maxScroll) {
      setOffset(maxScroll);
    } else if (newOffset > 0) {
      setOffset(0)
    } else {
      setOffset(newOffset);
    }
  }

  return (
    <div className={ styles.carouselContainer }>
      { data && <div className={styles.carousel} ref={carousel}>
        { data.map(beach => (<Location style={{'left': offset}}key={ beach.id } info={beach}></Location>)) }
      </div> }
      <div className={ `${styles.prevButton} ${styles.button}` } onClick={ moveCarousel(false)}><Image className={styles.caret} src='/left_caret.png' height='24' width='24'/></div>
      <div className={ `${styles.nextButton} ${styles.button}` } onClick={moveCarousel(true)}><Image className={styles.caret} src='/right_caret.png' height='24' width='24'/></div>
    </div>
  );
}

function RenderSlides({beaches}) {
  return (
    <Slider className={styles.slider}>
      {
        beaches.map((beach, index) => 
          <Slide key={beach.id} index={index}><Location info={beach}></Location></Slide>
        )
      }
    </Slider>
  )
}

export default MyCarousel;