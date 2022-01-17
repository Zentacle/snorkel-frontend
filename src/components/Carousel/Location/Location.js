import styles from "./Location.module.css"
import Image from "next/image";
import Rating from "react-rating";
import { EmptyStar, FullStar } from "components/StarRating";
import Link from "next/link";
import DifficultyTag from "components/DifficultyTag";
const SlideLocation = ({ ...props }) => {
    return (
        <div className={styles.slide}>
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
                <div className={styles.spotName}>
                    <Link href={props.info.url}>
                        <a>{props.info.name}</a>
                    </Link>
                </div>
                <div className={styles.location}>
                    {props.info.locality && props.info.locality.url ?
                        <Link href={props.info.locality.url}>
                            <a className={styles.locationLink} style={props.style}>
                                {props.info.location_city}
                            </a>
                        </Link>
                        : props.info.location_city
                    }
                </div>
                <div className={styles.ratingContainer} title={props.info.rating}>
                    <DifficultyTag difficulty={props.info.difficulty} />
                    <Rating
                        fractions={2}
                        emptySymbol={(<EmptyStar className={styles.starempty} />)}
                        fullSymbol={(<FullStar className={styles.starfull} />)}
                        initialRating={props.info.rating}
                        readonly
                    />
                    <div className={styles.numReviews}>({props.info.num_reviews})</div>
                </div>
            </div>
            <Link href={props.info.url}>
                <a className={styles.cardLink} style={props.style}></a>
            </Link>
        </div>
    )
}

export default SlideLocation;