import styles from "../BeachPage/BeachPage.module.css";
import Image from "next/image";
import BeachInfo from "../BeachPage/BeachInfo/BeachInfo";
import Rating from "react-rating";
import { Star } from "@material-ui/icons";
import Link from 'next/link';

const BackImage = (props) => {
    return (
        <div className={styles.image}>
            <div className={styles.imageinner} style={{ backgroundImage: `url(\'${props.beach.hero_img}\')` }}>
                <div className={styles.overlay} />
                <div className={styles.pageHeroInfo}>
                    <h1 className={styles.pagetitle}>{props.beach.name}</h1>
                    <div className={styles.stars}>
                        <Rating
                            fractions={2}
                            emptySymbol={(<Star className={styles.starempty}></Star>)}
                            fullSymbol={(<Star className={styles.starfull}></Star>)}
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
                        <div className={styles.buttoncircle}>
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
    return (
        <div>
            <BackImage beach={props.beach} />
            <BeachInfo {...props.beach} />
        </div>
    )
}

export default BeachPage;