import Image from 'next/image';

import Rating from 'components/StarRating';
import { sendEvent } from 'hooks/amplitude';
import Shop from 'models/Shop';
import styles from './styles.module.css';
import Link from 'next/link';

interface Props {
  shop: Shop;
}

const ShopCard = (props: Props) => {
  const sendClickEvent = (name: string) => () => {
    sendEvent('click__nearby_shop', {
      name: name,
    });
  };

  return (
    <div className={styles.patronCard}>
      <div className={styles.innerContainer}>
        <div className={styles.image}>
          <Link href={props.shop.url}>
            <a>
              <Image
                src={props.shop.logo_img || '/default_hero_background.png'}
                layout="fill"
                objectFit="cover"
                alt={props.shop.name}
                unoptimized
              />
            </a>
          </Link>
        </div>
        <div className={styles.description}>
          <Link href={props.shop.url}>
            <a
              onClick={sendClickEvent(props.shop.name)}
              className={styles.patronName}
            >
              {props.shop.name}
            </a>
          </Link>
          <Rating
            className={styles.stars}
            initialRating={props.shop.rating}
            readonly
          />
          <div
            className={styles.city}
          >{`${props.shop.city}, ${props.shop.state}`}</div>
          <Link href={props.shop.fareharbor_url || props.shop.url}>
            <a
              onMouseDown={sendClickEvent(props.shop.name)}
              className={styles.bookNow}
            >
              Check Availability
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
