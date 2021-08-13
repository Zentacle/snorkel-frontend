import Link from 'next/link';
import Image from 'next/image';

import * as ga from 'lib/ga';
import styles from './styles.module.css'

const AdCarousel = (props) => {
  const onClick = () => {
    ga.event({
      action: "purchase",
    })
  }

  return (
    <>
      <div className={styles.carouselTitle}>Recommended boat tour</div>
      <div className={styles.container}>
      <Image className={styles.image} src="https://www.lovebigisland.com/wp-content/uploads/hokulani-kealakekua-bay-snorkel-620x427.jpg"/>
        <div className={styles.slideContainer}>
          <div className={styles.name}>
            AM or PM Snorkel on Four Winds
          </div>
          <div className={styles.description}>
            Explore {props.beach_name} in a once in a lifetime snorkel experience. Snorkel and encounter pristine clear waters, coral reefs, and marine life, including turtles, dolphins, and a number of different fish.
          </div>
          <Link href="https://www.fourwindsmaui.com/book-maui-molokini-snorkel-tours/">
            <a className={styles.button} onClick={onClick}>
              Book Now ($65)
            </a>
          </Link>
        </div>
      </div>
    </>
  )
}

export default AdCarousel;