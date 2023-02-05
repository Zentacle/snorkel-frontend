import React from "react";

import Tides from "components/BeachPage/Tides";
import NearbyShops from "components/NearbyShops";
import styles from "./styles.module.css";

interface Props {
  nearbyShops: any[];
  tidesArray: any[];
}

const Selector = ({ nearbyShops, tidesArray }: Props) => {
  const [selected, setSelected] = React.useState(false);
  return (
    <div>
      <div className={styles.container}>
        <div
          className={`${!selected ? styles.active : ""} ${styles.item} `}
          onClick={() => setSelected(false)}
        >
          Nearby Shops
        </div>
        <div
          className={`${selected ? styles.active : ""} ${styles.item}`}
          onClick={() => setSelected(true)}
        >
          Tide Report
        </div>
      </div>
      {selected ? (
        <Tides tidesArray={tidesArray} />
      ) : (
        <NearbyShops shops={nearbyShops} />
      )}
    </div>
  );
};

export default Selector;
