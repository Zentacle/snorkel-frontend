import styles from "../IndividualReview/IndividualReview.module.css";
import Rating from "react-rating";
import Star from "@material-ui/icons/Star";
import Image from 'next/image';
import Link from 'next/link';
import { PhotoGrid } from "components/PhotoPage";
const IndividualReview = ({ review, user }) => {
    const review_date = new Date(review.date_posted).toLocaleString(
        [],
        {day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute:'2-digit'}
    );

    return (
        <div className={styles.container}>
            <div>
            <div className={styles.outerupper}>
                <div className={styles.imageouter}>
                    { user.profile_pic
                        ? <Image className={styles.profilePic} alt={user.display_name} src={user.profile_pic} height='48' width='48'/>
                        : <Image className={styles.profilePic} alt={user.display_name} src='/default_profile.png' height='48' width='48' />
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
            { review.shorediving_data && <div className={ styles.helper }>Originally posted on shorediving.com</div> }
            </div>
            <div className={styles.photos}>
                <PhotoGrid isReview={true} beach_id={-1} review_id={review.id}></PhotoGrid>
                
            </div>
        </div>
    )
}

export default IndividualReview;