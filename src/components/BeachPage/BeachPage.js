import styles from "../BeachPage/BeachPage.module.css";
import Image from "next/image";
import BeachInfo from "../BeachPage/BeachInfo/BeachInfo";


const BackImage = (props) => {
    return (
        <div className={styles.image}>
            <div className={styles.imageinner}>
                <Image className={styles.actualimage} height='1223' width='3000' objectFit="contain" alt="here" src={ props.beach.hero_img }>
                </Image>
            </div>
            <div className={styles.pagetitle}>{ props.beach.name }<br></br>
                <div className={styles.beachdescription}>{ props.beach.location_city }</div>
                <div className={styles.stars}>{ props.beach.rating } stars</div>
            </div>
            <div className={styles.menu}>
                <div className={styles.buttoncontainer}>
                    <div className={styles.buttonouter}>
                        <a href={ props.beach.entry_map } className={styles.buttoncircle}>
                            <Image src='/../public/mapicon.png' alt="map" objectFit="contain" height='24' width="24"></Image>
                        </a>
                        <div className={styles.buttonlabel}>Entry Map</div>
                    </div>
                    <div className={styles.buttonouter}>
                        <a href={ props.beach.location_google } className={styles.buttoncircle}>
                            <Image src='/../public/directionsicon.png' alt="directions" objectFit="contain" height='24' width="24"></Image>
                        </a>
                        <div className={styles.buttonlabel}>Directions</div>
                    </div>
                    <div className={styles.buttonouter}>
                        <div className={styles.buttoncircle}>
                            <Image src='/../public/photosicon.png' alt="photos" objectFit="contain" height='24' width="24"></Image>
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
            <BackImage beach={ props.beach } />
            <BeachInfo />
        </div>
    )
}

export default BeachPage;