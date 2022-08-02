import React from 'react';

import Shop from 'models/Shop';
import SectionTitle from 'components/SectionTitle';
import ShopCard from './ShopCard';
import styles from './styles.module.css';

interface Props {
  className?: string;
  shops: Shop[];
}

const Patron = (props: Props) => {
  return (
    <div className={props.className}>
      <SectionTitle text='Nearby dive shops' />
      <div className={styles.container}>
        {props.shops.map((shop: Shop) => <ShopCard key={shop.id} shop={shop} />)}
      </div>
    </div>
  )
}

export default Patron;