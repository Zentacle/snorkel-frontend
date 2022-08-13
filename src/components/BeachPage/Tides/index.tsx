import Image from 'next/image';

import styles from './styles.module.css';

interface Props {
  tidesArray: any[];
}

const Tides = ({tidesArray}: Props) => {
      return tidesArray.length ? <>
        <div className={styles.tideContainer}>
          {tidesArray.slice(0, 5).map(tide => {
            const tideData = new Date(`${tide.t.replace(/ /g, "T")}Z`);
            return (
              <div className={styles.tideRow} key={tide.t}>
                <div className={`${styles.tideItem} ${tideData < new Date() ? styles.past : ''}`}>{tideData.toLocaleString([], { 'weekday': 'long' })}</div>
                <div className={`${styles.tideItem} ${tideData < new Date() ? styles.past : ''}`}>{tideData.toLocaleString([], { hour: 'numeric', minute: '2-digit' })}</div>
                <div className={styles.tideImage}>
                  <Image
                    src={tide.type === 'H' ? '/high_tide.png' : '/low_tide.png'}
                    height='16'
                    width='16'
                    alt={tide.type === 'H' ? 'high tide icon' : 'low tide icon'}
                  />
                  <div
                    className={styles.tideIcon}
                  >
                    {tide.v}ft
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </> : <></>
}

export default Tides;
