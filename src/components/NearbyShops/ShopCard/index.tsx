import Image from 'next/image';

import { sendEvent } from 'hooks/amplitude';
import Shop from 'models/Shop';
import styles from './styles.module.css';

interface Props {
  shop: Shop;
}

const ShopCard = (props: Props) => {
  const sendClickEvent = (name: string) => () => {
    sendEvent('click__nearby_patron', {
      name: name,
    });
  }

  return (
    <div className={styles.patronCard}>
      <div className={styles.innerContainer}>
        <div className={styles.image}>
          <Image
            src={props.shop.logo_img || '/default_hero_background.png'}
            layout="fill"
            objectFit='cover'
            alt={props.shop.name}
          />
        </div>
        <div className={styles.description}>
          <a
            onClick={sendClickEvent(props.shop.name)}
            className={styles.patronName}
            href={props.shop.url}
          >
            {props.shop.name}
          </a>
          <div>{props.shop.address1}</div>
          <div>{props.shop.address2}</div>
          <div>{`${props.shop.city}, ${props.shop.state} ${props.shop.zip}`}</div>
        </div>
      </div>
      <a
        onMouseDown={sendClickEvent(props.shop.name)}
        className={styles.bookNow}
        href={props.shop.fareharbor_url || props.shop.url}
      >
        Check Availability
      </a>
    </div>
  )
};

export default ShopCard;
