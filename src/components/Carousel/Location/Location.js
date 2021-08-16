import styles from "./Location.module.css"
import Image from "next/image";
import { useRouter } from "next/router";
import Rating from "react-rating";
import Star from "@material-ui/icons/Star";
import Link from "next/link";
import DifficultyTag from "components/DifficultyTag";
const SlideLocation = ({ ...props }) => {
    const router = useRouter();

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
                        width="256"
                    />
                </div>
                <div className={styles.locationInfoContainer}>
                    <div className={styles.spotName}>{props.info.name}</div>
                    <div className={styles.location}>{props.info.location_city}</div>
                    <div className={styles.ratingContainer} title={ props.info.rating }>
                        <DifficultyTag difficulty={props.info.difficulty}/>
                        <Rating
                            fractions={2}
                            emptySymbol={(<Star className={styles.starempty}></Star>)}
                            fullSymbol={(<Star className={styles.starfull}></Star>)}
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