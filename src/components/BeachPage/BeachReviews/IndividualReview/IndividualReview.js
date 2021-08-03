import styles from "../IndividualReview/IndividualReview.module.css";
import Rating from "react-rating";
import { Star } from "@material-ui/icons";
import Image from 'next/image';
import Link from 'next/link';

const IndividualReview = ({ review, user, style }) => {
    const review_date = new Date(review.date_posted).toLocaleString(
        [],
        {day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute:'2-digit'}
    );

    return (
        <div className={styles.container} style={style}>

            <div className={styles.outerupper}>
                <div className={styles.imageouter}>
                    { user.profile_pic
                        ? <Image className={styles.profilePic} src={user.profile_pic} height='48' width='48'/>
                        : <Image className={styles.profilePic} src='/default_profile.png' height='48' width='48' />
                    }
                </div>
                <div className={styles.centerouter}>
                    {
                     user.username
                        ? (
                            <Link href={`/user/${user.username}`}>
                                <a className={styles.centerupper}>
                                    {user.display_name}
                                </a>
                            </Link>
                        ) : <div className={styles.centerupper}>{user.display_name}</div>
                    }
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