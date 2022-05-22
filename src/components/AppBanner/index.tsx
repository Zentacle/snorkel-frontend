import React from 'react';

import * as ga from 'lib/ga';
import PrimaryButton, { PrimaryLink } from 'components/PrimaryButton';
import styles from './styles.module.css';

export default function AppBanner() {
  const onClick = () => {
    ga.event({
      action: "add_to_cart",
      params: {
        eventLabel: 'iOS App',
        items: [{
          item_list_name: 'home_banner',
          item_name: 'iOS App',
          item_category: 'iOS App',
        }]
      }
    })
  }

  return (
    <div className={styles.outerContainer}>

    </div>
  );
}
