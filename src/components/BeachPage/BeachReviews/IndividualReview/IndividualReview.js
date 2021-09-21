import Star from "@material-ui/icons/Star";
import React from "react";
import Rating from "react-rating";
import Link from 'next/link';
import { ReactPhotoCollage } from "react-photo-collage";

import ProfilePic from "components/ProfilePic";
import styles from "./IndividualReview.module.css";

const PhotoGrid = ({ review }) => {
    const [photosArray, setPhotosArray] = React.useState(review.signedUrls.map(photo => ({
        source: photo.signedurl.data
    })));

    React.useEffect(() => {
        setPhotosArray(review.signedUrls.map(photo => ({
            source: photo.signedurl.data
        })))
    }, [review])

    let layoutArray = [Math.min(4, photosArray.length)];
    let heightArray = ['50px'];
    let width = `${Math.min(200, photosArray.length * 50)}px`;

    let setting = {
        width: width,
        height: heightArray,
        layout: layoutArray,
        photos: photosArray,
        showNumOfRemainingPhotos: true
    };


    return (
        <div className={styles.gridcontainer}>
            {setting && photosArray && photosArray.length > 0 && <ReactPhotoCollage {...setting} />}
        </div>

    )
}

const IndividualReview = ({ review, user }) => {
    const review_date = new Date(review.date_posted).toLocaleString(
        [],
        { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }
    );

    return (
        <div className={styles.outercontainer}>
            <div className={styles.container}>
                <div>
                    <div className={styles.outerupper}>
                        <div className={styles.imageouter}>
                            <ProfilePic user={user} size={48}/>
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
                                <span className={styles.reviewDate}>{review_date}</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.activityContainer}>
                        <span className={styles.activity}>{review.activity_type}</span>
                    </div>
                    <div className={styles.outerlower}>
                        {review.text}
                    </div>
                </div>
            </div>
            {review.shorediving_data && <div className={styles.helper}>Originally posted on shorediving.com</div>}
            <div className={styles.photos}>
                {review && <PhotoGrid review={review}></PhotoGrid>}
            </div>
        </div>
    )
}

export default IndividualReview;