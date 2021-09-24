import React from 'react';

import * as ga from 'lib/ga';
import SectionTitle from 'components/SectionTitle';
import styles from './styles.module.css';

const Patron = (props) => {
  React.useEffect(() => {
    sendViewEvent();
  }, [])

  const sendViewEvent = () => {
    ga.event({
      action: "view_item",
      params: {
        eventLabel: 'Kona Shore Divers',
        items: [{
          item_list_name: props.name,
          item_name: 'Patron Link',
          item_brand: 'Kona Shore Divers',
          item_category: 'Patron',
        }]
      }
    })
  }

  const sendClickEvent = () => {
    ga.event({
      action: "purchase",
      params: {
        eventLabel: 'Kona Shore Divers',
        items: [{
          item_list_name: props.name,
          item_name: 'Patron Link',
          item_brand: 'Kona Shore Divers',
          item_category: 'Patron',
        }]
      }
    })
  }

  return (
    <div>
        <SectionTitle text={`${props.name} Patrons`} />
        <div className={styles.description}>
            <a
                onClick={ sendClickEvent }
                className={styles.patronName}
                href="https://www.konashoredivers.com"
            >Kone Shore Divers</a>
            <span> - Our goal is to give you the opportunity to share and explore the underwater world in and around the near shore waters of Kailua-Kona. We focus on small group sizes and strive to offer the best personalized service we can to our guests. From the first timer to the old timer come with us and see what the Kona Shore has to offer!</span>
        </div>
    </div>
  )
}

export default Patron;