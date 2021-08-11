import styles from "../IndividualReview/IndividualReview.module.css";
import Rating from "react-rating";
import Star from "@material-ui/icons/Star";
import Image from 'next/image';
import Link from 'next/link';
import React from "react";
import { ReactPhotoCollage } from "react-photo-collage";
const IndividualReview = ({ review, user }) => {

    const PhotoGrid = ({ indreview }) => {
        const [photoArray, setPhotoArray] = React.useState(null);
        const reviewRef = React.createRef();
        reviewRef.current = indreview

        React.useEffect(() => {

            setPhotoArray([...reviewRef.current.signedUrls])

        }, [])

        const [photosArray, setPhotosArray] = React.useState([]);
        React.useEffect(() => {

            let photos = [];
            if (photosArray.length < 1 && photoArray) {

                for (let i = 0; i < photoArray.length; i++) {

                    photos.push({ source: photoArray[i].signedurl.data })
                }
                setPhotosArray([...photos])
            }
        }, [photoArray])

        let layoutArray = [];
        let heightArray = [];
        let photoslen = photosArray.length;
        let width = '600px';

        if (photoslen == 1) {
            width = '50px';
            heightArray = ['50px']
            layoutArray = [1]
        }
        else if (photoslen == 2) {
            width = '100px';
            heightArray = ["50px"]
            layoutArray = [2]
        }
        else if (photoslen == 3) {
            width = '150px';
            heightArray = ["50px"]
            layoutArray = [3]
        }
        else {
            width = '200px'
            heightArray = ["50px"]
            layoutArray = [4]
        }


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
                            {user.profile_pic
                                ? <Image className={styles.profilePic} alt={user.display_name} src={user.profile_pic} height='48' width='48' />
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
                <div className={styles.photos}>
                    {review && <PhotoGrid indreview={review}></PhotoGrid>}
                </div>

            </div>
            {review.shorediving_data && <div className={styles.helper}>Originally posted on shorediving.com</div>}
        </div>
    )
}

export default IndividualReview;