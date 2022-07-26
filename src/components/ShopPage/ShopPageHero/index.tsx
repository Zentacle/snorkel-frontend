import React from 'react'
import Rating from "react-rating";
import Link from 'next/link';
import Image from "next/image";
import { useRouter } from "next/router";
import { toaster } from 'evergreen-ui';

import { EmptyStar, FullStar } from "components/StarRating";
import { sendEvent } from 'hooks/amplitude';
import styles from "../../BeachPageHero/styles.module.css";

const ShopPageHero = (props: any) => {
    const onWebsiteClick = () => {
        // sendEvent('entry_map__click')
        if (props.shop.url) { return }
        toaster.danger(`Sorry, we don\'t have a website for this shop yet!`)
    }

    const onDirectionsClick = () => {
        // sendEvent('directions__click')
        if (props.shop.entry_map) { return }
        toaster.danger(`Sorry, we don\'t have directions for this shop yet!`)
    }

    const contactClick = () => {
        // sendEvent('contact__click')
        if (!props.shop.phone) { return }
        toaster.notify(props.shop.phone)
    }

    const cityState = (): string => {
        if (props.shop.city && props.shop.state){
            return `${props.shop.city}, ${props.shop.state}`
        }
        else if (props.shop.city && props.shop.country){
            return `${props.shop.city}, ${props.shop.country_name}`
        }
        else if (props.shop.city){
            return `${props.shop.city}`
        }
        else if (props.shop.state){
            return props.shop.state
        }
        else if (props.shop.country){
            return props.shop.country_name
        }
        else {
            return ""
        }
    }

    return (
        <div className={styles.image}>
            <div className={styles.imageinner}>
                {props.shop.logo_img && <Image
                    src='/hero.jpg'
                    layout='fill'
                    objectFit='cover'
                    alt={props.shop.name}
                />}
                <div className={styles.overlay} />
                <div className={styles.pageHeroInfo}>
                    <div className={styles.nameContainer}>
                        <h1 className={styles.pagetitle}>{props.shop.name}</h1>
                    </div>
                    <div className={styles.stars}>
                        <Rating
                            fractions={2}
                            emptySymbol={(<EmptyStar />)}
                            fullSymbol={(<FullStar />)}
                            initialRating={props.shop.rating}
                            readonly>
                        </Rating>
                    </div>
                    <div>
                    {cityState()}
                    </div>
                </div>
            </div>
            <div className={styles.menu}>
                <div className={styles.buttoncontainer}>
                    <div className={styles.buttonouter}>
                        <a className={styles.buttoncircle} onClick={() => contactClick()}>

                            <Image src='/contactphone.png' alt="phone" objectFit="contain" height='20' width="20"></Image>
                        </a>
                        <div className={styles.buttonlabel}>Contact</div>
                    </div>
                    <div className={styles.buttonouter}>
                            <a className={styles.buttoncircle} href={props.shop.url}>
                                <Image src='/iconoir_internet.png' alt="map" objectFit="contain" height="20" width="20"></Image>
                            </a>
                        <div className={styles.buttonlabel}>Website</div>
                    </div>
                    <div className={styles.buttonouter}>
                        {
                            props.shop.location_google ? (
                                <Link href={props.shop.location_google || ''}>
                                    <a className={styles.buttoncircle} onClick={onDirectionsClick}>
                                        <Image src='/directionsicon.png' alt="directions" objectFit="contain" height='24' width="24"></Image>
                                    </a>
                                </Link>
                            ) : (
                                <div className={styles.buttoncircle} onClick={onDirectionsClick}>
                                    <Image src='/directionsicon.png' alt="directions" objectFit="contain" height='24' width="24"></Image>
                                </div>
                            )
                        }
                        <div className={styles.buttonlabel}>Directions</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShopPageHero;