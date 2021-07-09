import styles from "../IndividualReview/IndividualReview.module.css";
import Rating from "react-rating";
import { Star } from "@material-ui/icons";
const IndividualReview = ({ review }) => {
    console.log(review);
    return (
        <div className={styles.container}>

            <div className={styles.outerupper}>
                <div className={styles.imageouter}>
                    <img className={styles.profilePic} src={review.user.profile_pic} />
                </div>
                <div className={styles.centerouter}>
                    <div className={styles.centerupper}>
                        {review.user.display_name}
                    </div>
                    <div className={styles.centerlower}>
                        <Rating
                            fractions={2}
                            emptySymbol={(<Star className={styles.starempty}></Star>)}
                            fullSymbol={(<Star className={styles.starfull}></Star>)}
                            initialRating={5}
                            readonly
                        />
                    </div>
                </div>
            </div>
            <div className={styles.outerlower}>
                {review.text}
            </div>
        </div>
    )
}

export default IndividualReview;