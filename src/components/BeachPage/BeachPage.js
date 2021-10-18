import React from 'react'
import Rating from "react-rating";
import Link from 'next/link';
import Image from "next/image";
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import { useRouter } from "next/router";
import { toaster } from 'evergreen-ui';

import styles from "components/BeachPage/BeachPage.module.css";
import ReviewSummary from 'components/BeachPage/ReviewSummary';
import Carousel from 'components/Carousel/Carousel';
import BeachReviews from "components/BeachPage/BeachReviews/BeachReviews";
import BeachInfo from "components/BeachPage/BeachInfo/BeachInfo";
import { EmptyStar, FullStar } from "components/StarRating";
import PhotoPreview from './PhotoPreview';

const BackImage = (props) => {
    const onEntryMapClick = () => {
        if (props.beach.entry_map) { return }
        toaster.danger(`Sorry, we don\'t have a map for this location yet!`)
    }

    const photoClick = () => {
        if (photoArray.length == 0) {
            toaster.danger(`Sorry, we don\'t have any photos for this location yet!`)
        }
        else {
            router.push(`${props.beach.url}/photos`)
        }
    }

    const router = useRouter();

    return (
        <div className={styles.image}>
            <div className={styles.imageinner} style={{ backgroundImage: `url(\'${props.beach.hero_img}\')` }}>
                <div className={styles.overlay} />
                <div className={styles.pageHeroInfo}>
                    <div className={styles.nameContainer}>
                        <h1 className={styles.pagetitle}>{props.beach.name}</h1>
                        <Link href="/register">
                            <a className={styles.favorite} alt="Mark as favorite">
                                <FavoriteBorder />
                            </a>
                        </Link>
                    </div>
                    <div className={styles.stars}>
                        <Rating
                            fractions={2}
                            emptySymbol={(<EmptyStar />)}
                            fullSymbol={(<FullStar />)}
                            initialRating={props.beach.rating}
                            readonly>
                        </Rating>
                    </div>
                    <div className={styles.beachdescription}>{props.beach.location_city}</div>
                </div>

            </div>
            <div className={styles.menu}>
                <div className={styles.buttoncontainer}>
                    <div className={styles.buttonouter}>
                        <Link href={props.beach.entry_map || props.beach.url}>
                            <a className={styles.buttoncircle} onClick={onEntryMapClick}>
                                <Image src='/mapicon.png' alt="map" objectFit="contain" height='24' width="24"></Image>
                            </a>
                        </Link>
                        <div className={styles.buttonlabel}>Entry Map</div>
                    </div>
                    <div className={styles.buttonouter}>
                        <Link href={props.beach.location_google || ''}>
                            <a className={styles.buttoncircle}>
                                <Image src='/directionsicon.png' alt="directions" objectFit="contain" height='24' width="24"></Image>
                            </a>
                        </Link>
                        <div className={styles.buttonlabel}>Directions</div>
                    </div>
                    <div className={styles.buttonouter}>
                        <div className={styles.buttoncircle} onClick={() => photoClick()}>
                            <Image src='/photosicon.png' alt="photos" objectFit="contain" height='24' width="24"></Image>
                        </div>
                        <div className={styles.buttonlabel}>Photos</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const BeachPage = (props) => {
    const photoState = React.useState([]);

    return (
        <>
            <BackImage beach={props.beach} photoState={photoState} />
            <BeachInfo
                {...props.beach}
                isSingularReview={props.isSingularReview}
                tides={props.tides}
                reviews={props.reviews}
            />
            <PhotoPreview
                photoState={photoState}
                beach={props.beach}
            />
            <ReviewSummary
                ratings={props.beach.ratings}
                rating={props.beach.rating}
                num_reviews={props.beach.num_reviews}
            />
            <BeachReviews
                beachid={props.beach.id}
                url={props.beach.url}
                reviews={props.reviews}
                isSingularReview={props.isSingularReview}
            />
            {props.nearbyBeaches.length
                ? <div className={styles.carouselSpacer}>
                    <div className={styles.carouseltitle}>Other Locations Nearby</div>
                    <Carousel data={props.nearbyBeaches}></Carousel>
                </div> : <></>
            }
        </>
    )
}

export default BeachPage;