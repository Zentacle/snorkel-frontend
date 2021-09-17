import styles from "./Location.module.css"
import Image from "next/image";
import Rating from "react-rating";
import { EmptyStar, FullStar } from "components/StarRating";
import Link from "next/link";
import DifficultyTag from "components/DifficultyTag";
const SlideLocation = ({ ...props }) => {
    return (
        <Link href={props.info.url}>
            <a className={styles.slide} style={props.style}>
                <div className={styles.slidepic}>
                    <Image
                        className={styles.image}
                        src={props.info.hero_img || '/generic_beach.jpeg'}
                        alt="picture"
                        objectFit="contain"
                        height="160"
                        width="270"
                    />
                </div>
                <div className={styles.locationInfoContainer}>
                    <div className={styles.spotName}>{props.info.name}</div>
                    <div className={styles.location}>{props.info.location_city}</div>
                    <div className={styles.ratingContainer} title={ props.info.rating }>
                        <DifficultyTag difficulty={props.info.difficulty}/>
                        <Rating
                            fractions={2}
                            emptySymbol={(<EmptyStar className={styles.starempty}/>)}
                            fullSymbol={(<FullStar className={styles.starfull}/>)}
                            initialRating={props.info.rating}
                            readonly
                        />
                        <div className={styles.numReviews}>({props.info.num_reviews})</div>
                    </div>
                </div>
            </a>
        </Link>
    )
}

export default SlideLocation;