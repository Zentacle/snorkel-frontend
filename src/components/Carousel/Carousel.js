import styles from './Carousel.module.css';
import React, { useEffect } from 'react';
import Image from 'next/image';
import Location from './Location/Location';

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

  useEffect(() => setData(props.data), [props.data])

  return (
    <div className={ styles.carouselContainer }>
      { data && <div className={styles.carousel} ref={carousel}>
        { data.map(beach => (<Location style={{'left': offset}}key={ beach.id } info={beach}></Location>)) }
      </div> }
      <div className={ `${styles.prevButton} ${styles.button}` } onClick={ moveCarousel(false)}><Image className={styles.caret} alt="left caret" src='/left_caret.png' height='24' width='24'/></div>
      <div className={ `${styles.nextButton} ${styles.button}` } onClick={moveCarousel(true)}><Image className={styles.caret} alt="right caret" src='/right_caret.png' height='24' width='24'/></div>
    </div>
  );
}

export default MyCarousel;