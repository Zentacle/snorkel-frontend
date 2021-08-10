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
            router.push({
                pathname: '/Beach/Photos', query: {
                    beach_id: props.beach.id,
                    hero_img: props.beach.hero_img,
                    name: props.beach.name,
                    rating: props.beach.rating,
                    location_city: props.beach.location_city

                }
            })
        }
    }



    const router = useRouter();
    const [photosHeight, setPhotosHeight] = React.useState(0);
    const [photoArray, setPhotoArray] = React.useState([]);




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
    const [settings2, setSettings2] = React.useState(null);
    const [settings3, setSettings3] = React.useState(null);
    React.useEffect(() => {

        if (photoArray.length > 0) {
            const arLen = photoArray.length;
            setSettings1({
                width: '100px',
                height: ['100px'],
                layout: [1],
                photos: [{ source: photoArray[arLen - 1].signedurl.data }],
                showNumOfRemainingPhotos: false
            })
            if (photoArray.length > 1) {
                setSettings2({
                    width: '100px',
                    height: ['100px'],
                    layout: [1],
                    photos: [{ source: photoArray[arLen - 2].signedurl.data }],
                    showNumOfRemainingPhotos: false
                })
            }
            if (photoArray.length > 2) {
                setSettings3({
                    width: '100px',
                    height: ['100px'],
                    layout: [1],
                    photos: [{ source: photoArray[arLen - 3].signedurl.data }],
                    showNumOfRemainingPhotos: false
                })
            }
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
            <div className={styles.photoouterwrapper} style={{ height: photosHeight }}>
                {settings1 && settings1.photos[0].source && <div className={styles.photocontainer}>
                    <ReactPhotoCollage {...settings1}></ReactPhotoCollage>
                    {settings2 && settings2.photos[0].source && <ReactPhotoCollage {...settings2}></ReactPhotoCollage>}
                    {settings3 && settings3.photos[0].source && <ReactPhotoCollage {...settings3}></ReactPhotoCollage>}
                </div>}
                {!settings1 && <div className={styles.photocontainer}>No photos yet!
                </div>}

            </div>
        </div>
    )
}

const BeachPage = (props) => {
    return (
        <>
            <BackImage beach={props.beach} />
            <BeachInfo {...props.beach} reviews={props.reviews} />
            <div className={styles.carouselSpacer}>
                <div className={styles.carouseltitle}>Other Locations Nearby</div>
                <Carousel data={[...props.nearbyBeaches]}></Carousel>
            </div>
        </>
    )
}

export default BeachPage;