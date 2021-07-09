import styles from "./Location.module.css"
import { Card, CardContent } from "@material-ui/core";
import Image from "next/image";
import { useRouter } from "next/router";
import Rating from "react-rating";
import { Star } from "@material-ui/icons";
import Link from "next/link";
const SlideLocation = ({ ...props }) => {
    const router = useRouter();

    return (
        <Link href={`/Beach/${props.info.id}`}>
            <a className={styles.slide}>
                <div className={styles.slidepic}>
                    <Image className={styles.image} src={props.info.hero_img} alt="picture" objectFit="contain" layout="fill"></Image>

                </div>

                <div className={styles.locationInfoContainer}>
                    <div className={styles.spotName}>{props.info.name}</div>
                    <div className={styles.location}>{props.info.location_city}</div>
                    <div className={styles.ratingContainer}>
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