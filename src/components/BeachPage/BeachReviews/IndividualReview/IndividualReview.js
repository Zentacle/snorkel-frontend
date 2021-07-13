import styles from "../IndividualReview/IndividualReview.module.css";
import Rating from "react-rating";
import { Star } from "@material-ui/icons";
import Image from 'next/image';

const IndividualReview = ({ review }) => {
    const review_date = new Date(review.date_posted).toLocaleString(
        [],
        {day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute:'2-digit'}
    );

    return (
        <div className={styles.container}>

            <div className={styles.outerupper}>
                <div className={styles.imageouter}>
                    { review.user.profile_pic
                        ? <Image className={styles.profilePic} src={review.user.profile_pic} height='48' width='48'/>
                        : <Image className={styles.profilePic} src='/default_profile.png' height='48' width='48' />
                    }
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
                            initialRating={review.rating}
                            readonly
                        />
                        <span className={styles.reviewDate}>{ review_date }</span>
                    </div>
                </div>
            </div>
            <div className={ styles.activityContainer }>
                <span className={ styles.activity }>{review.activity_type}</span>
            </div>
            <div className={styles.outerlower}>
                {review.text}
            </div>
        </div>
    )
}

export default IndividualReview;