import Image from "next/image";
import Rating from "react-rating";
import Link from "next/link";

import DifficultyTag from "components/DifficultyTag";
import { EmptyStar, FullStar } from "components/StarRating";
import Beach from "models/Beach";
import Shop from "models/Shop";
import styles from "./styles.module.css";

interface Props {
  index?: number;
  info: Beach | Shop;
  beach?: Beach;
}

const Location = (props: Props) => {
  return (
    <div className={styles.slide}>
      <div className={styles.slidepic}>
        <Image
          className={styles.image}
          src={props.info.hero_img || "/generic_beach.jpeg"}
          alt={props.info.name}
          objectFit="contain"
          height="154"
          width="280"
          unoptimized
        />
      </div>
      <div className={styles.locationInfoContainer}>
        <h2 className={styles.spotName}>
          {props.index !== undefined ? `#${props.index + 1} - ` : ''}{props.info.name}
        </h2>
        <h3 className={styles.location}>
          {props.info.locality && props.info.locality.url ? (
            <Link href={props.info.locality.url}>
              <a className={styles.locationLink}>{props.info.location_city}</a>
            </Link>
          ) : (
            props.info.location_city
          )}
        </h3>
        <div className={styles.ratingContainer} title={`${props.info.rating}`}>
          {(props.info as any).difficulty ? (
            <DifficultyTag difficulty={(props.info as any).difficulty} />
          ) : (
            <></>
          )}
          <Rating
            fractions={2}
            emptySymbol={<EmptyStar />}
            fullSymbol={<FullStar />}
            initialRating={props.info.rating}
            readonly
          />
          <div className={styles.numReviews}>({props.info.num_reviews})</div>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: props.info.description || "" }}
        />
      </div>
      <Link href={props.info.url}>
        <a className={styles.cardLink}></a>
      </Link>
    </div>
  );
};

export default Location;
