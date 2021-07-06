import styles from "../BeachPage/BeachPage.module.css";
import Image from "next/image";
import BeachInfo from "../BeachPage/BeachInfo/BeachInfo";
const BackImage = () => {
    return (
        <div className={styles.image}>
                <div className={styles.imageinner}>
                
                <Image className={styles.actualimage} height='1223' width='3000' objectFit="contain" alt="here" src="/homepageimg.jpeg">
                    
                </Image>
                
                </div>
                <div className={styles.pagetitle}>Beach Name <br></br>
                <div className={styles.beachdescription}>Example, Location</div>
                <div className={styles.stars}>stars</div>
                </div>
                <div className={styles.menu}>
                    <div className={styles.buttoncontainer}>
                        <div className={styles.buttonouter}>
                        <div className={styles.buttoncircle}>
                        <Image src='/../public/mapicon.png' alt="map" objectFit="contain" height='24' width="24"></Image>
                        </div>
                        <div className={styles.buttonlabel}>Entry Map</div>
                        </div>
                        <div className={styles.buttonouter}>
                        <div className={styles.buttoncircle}>
                            <Image src='/../public/directionsicon.png' alt="directions" objectFit="contain" height='24' width="24"></Image>
                        </div>
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

const BeachPage = () => {
    return (
        <div>
            <BackImage>

            </BackImage>
            <BeachInfo/>
        </div>
    )
}

export default BeachPage;