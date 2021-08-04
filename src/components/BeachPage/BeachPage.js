/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-comment-textnodes */
import styles from "../BeachPage/BeachPage.module.css";
import Image from "next/image";
import BeachInfo from "../BeachPage/BeachInfo/BeachInfo";
import Rating from "react-rating";
import { EmptyStar, FullStar } from "components/StarRating";
import Link from 'next/link';
import React from 'react'

import { rootDomain } from 'lib/constants';
import { useRouter } from "next/router";

const BackImage = (props) => {
    const router = useRouter();
    const [photosHeight, setPhotosHeight] = React.useState(0);
    const [photoArray, setPhotoArray] = React.useState([]);
    const [signedUrls, setSignedUrls] = React.useState([]);
    const changeHeight = () => {
        if (photosHeight == 0) {
            setPhotosHeight(200)
        } else {
            setPhotosHeight(0)
        }
    }
    React.useEffect(() => {
        

        if (!props.name) {
            fetch(`${rootDomain}/images`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                return response.json();
            }).then(data => {
                setPhotoArray([...data.data]);
                
                
            })
        }

    }, [])
    console.log(photoArray)
    React.useEffect(()=>{
        
        for (let i = 0; i < photoArray.length && i < 3; i++){
        fetch(`${rootDomain}/s3-download?file=` + 'reviews/' + photoArray[i].url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            console.log(response)
            return response.json();
        }).then(data => {
            
            const urls = signedUrls;
            urls.push(data.data)
            setSignedUrls([...urls])
            
        }).catch(err => {
            console.log(err)
        })
        }
        
    }, [photoArray])
    console.log(signedUrls)
   
   
    return (
        <div className={styles.image}>
            <div className={styles.imageinner} style={{ backgroundImage: `url(\'${props.beach.hero_img}\')` }}>
                <div className={styles.overlay} />
                <div className={styles.pageHeroInfo}>
                    <h1 className={styles.pagetitle}>{props.beach.name}</h1>
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
                        <Link href={props.beach.entry_map || ''}>
                            <a className={styles.buttoncircle}>
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
                        <div className={styles.buttoncircle} onClick={() => changeHeight()}>
                            <Image src='/photosicon.png' alt="photos" objectFit="contain" height='24' width="24"></Image>
                        </div>
                        <div className={styles.buttonlabel}>Photos</div>
                    </div>
                </div>
            </div>

            <div className={styles.photoouterwrapper} style={{ height: photosHeight}}>
                <div className={styles.pagetitlephotos}>User Photos</div>
                <div className={styles.photocontainer}>
            {signedUrls && signedUrls.map((object, i)=>{
                const url = object
                
                return (<div key={object} className={styles.photopage}>
                    
                    <img alt="error loading" src={url} className={styles.individualphoto}></img>
                    
                </div>)

            })}
            </div>
            <div onClick={()=>router.push('/Beach/Photos')}> show more</div>
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