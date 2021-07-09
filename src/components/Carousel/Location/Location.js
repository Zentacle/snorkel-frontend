import styles from "./Location.module.css"
import { Card, CardContent } from "@material-ui/core";
import Image from "next/image";
import { useRouter } from "next/router";
import Rating from "react-rating";
import { Star } from "@material-ui/icons";
const SlideLocation = ({ ...props }) => {
    const router = useRouter();

    return (
        <Card className={styles.slide} onClick={() => router.push(`/Beach/${props.info.id}`)}>
            <div className={styles.slidepic}>
                <Image className={styles.image} src={props.info.hero_img} alt="picture" objectFit="contain" layout="fill"></Image>
                
            </div>

            <div className={styles.locationtext}>
                {props.info.name}
                <br></br>
                <Rating fractions={2}
                    emptySymbol={(<Star className={styles.starempty}></Star>)}
                    fullSymbol={(<Star className={styles.starfull}></Star>)}
                    initialRating={props.info.rating}
                    readonly></Rating>
            </div>

        </Card>
    )
}

export default SlideLocation;