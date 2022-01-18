import styles from "./styles.module.css"
import Image from "next/image";
import { useRouter } from "next/router";
import Rating from "react-rating";
import { EmptyStar, FullStar } from "components/StarRating";
import Link from "next/link";
import DifficultyTag from "components/DifficultyTag";

const Location = (props) => {
    return (
        <div className={styles.slide}>
            <div className={styles.slidepic}>
                <Image
                    className={styles.image}
                    src={props.info.hero_img || '/generic_beach.jpeg'}
                    alt={props.info.name}
                    objectFit="contain"
                    height="154"
                    width="280"
                />
            </div>
            <div className={styles.locationInfoContainer}>
                <h2 className={styles.spotName}>#{props.index + 1} - {props.info.name}</h2>
                <h3 className={styles.location}>
                    { props.info.locality && props.info.locality.url ?
                        <Link href={props.info.locality.url}>
                            <a className={styles.locationLink} style={props.style}>
                                {props.info.location_city}
                            </a>
                        </Link>
                        : props.info.location_city
                    }
                </h3>
                <div className={styles.ratingContainer} title={props.info.rating}>
                    <DifficultyTag difficulty={props.info.difficulty} />
                    <Rating
                        fractions={2}
                        emptySymbol={(<EmptyStar />)}
                        fullSymbol={(<FullStar />)}
                        initialRating={props.info.rating}
                        readonly
                    />
                    <div className={styles.numReviews}>({props.info.num_reviews})</div>
                </div>
                <div>
                    {props.info.description}
                </div>
            </div>
            <Link href={props.info.url}>
                <a className={styles.cardLink}></a>
            </Link>
        </div>
    )
}

export default Location;