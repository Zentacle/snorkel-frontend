import React from 'react';

import Shop from 'models/Shop';
import ShopCard from './ShopCard';
import styles from './styles.module.css';

interface Props {
  className?: string;
  shops: Shop[];
}

const Patron = (props: Props) => {
  return (
    <div className={props.className}>
      <div className={styles.container}>
        {props.shops.map((shop: Shop) => <ShopCard key={shop.id} shop={shop} />)}
      </div>
    </div>
  )
}

export default Patron;