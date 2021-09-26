import styles from "../BeachPage/BeachPage.module.css";
import Image from "next/image";
import BeachInfo from "../BeachPage/BeachInfo/BeachInfo";
import Rating from "react-rating";
import { EmptyStar, FullStar } from "components/StarRating";
import Link from 'next/link';
import Carousel from 'components/Carousel/Carousel';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import { toaster } from 'evergreen-ui';
import React from 'react'
import { ReactPhotoCollage } from "react-photo-collage";
import { rootDomain } from 'lib/constants';
import { useRouter } from "next/router";

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
    const [photosHeight, setPhotosHeight] = React.useState(0);
    const [photoArray, setPhotoArray] = props.photoState;

    React.useEffect(() => {
        if (!props.name) {
            fetch(`${rootDomain}/beachimages?beach_id=` + props.beach.id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                return response.json();
            }).then(data => {
                setPhotoArray([...data.data]);
                if (data.data.length != 0) {
                    setPhotosHeight(145)
                }
            })
        }
    }, [])

    const [settings1, setSettings1] = React.useState(null);

    React.useEffect(() => {
        if (photoArray.length > 0) {
            setSettings1({
                width: '320px',
                height: ['100px', '100px', '100px'],
                layout: [Math.min(3, photoArray.length)],
                photos: photoArray.map(photo => ({ source: photo.signedurl.data })),
                showNumOfRemainingPhotos: true
            })
        }

    }, [photoArray])



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
            {settings1 && settings1.photos[0].source && <div className={styles.photocontainer}>
                <ReactPhotoCollage {...settings1}></ReactPhotoCollage>
            </div>}
        </div>
    )
}

const BeachPage = (props) => {
    const photoState = React.useState([]);

    return (
        <>
            <BackImage beach={props.beach} photoState={photoState} />
            <BeachInfo {...props.beach} tides={props.tides} stationData={props.stationData} reviews={props.reviews} />
            { props.nearbyBeaches.length
                ? <div className={styles.carouselSpacer}>
                    <div className={styles.carouseltitle}>Other Locations Nearby</div>
                    <Carousel data={props.nearbyBeaches}></Carousel>
                </div> : <></>
            }
        </>
    )
}

export default BeachPage;