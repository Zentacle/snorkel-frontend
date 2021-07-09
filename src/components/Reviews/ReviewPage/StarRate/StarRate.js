import styles from "./StarRate.module.css";
import Rating from "react-rating";
import { Star } from "@material-ui/icons";
import Image from "next/image";
const StarRate = ({value, onChange}) => {
    return (
        <div className={styles.container}>
            <div className={styles.ratingtitle}>
                Rating
            </div>
            <div className={styles.ratingcontainer}>
                <Rating
                    fractions={2} 
                    initialRating={ value }
                    emptySymbol={(<Star className={styles.starempty}></Star>)} 
                    fullSymbol={(<Star className={styles.starfull}></Star>)}
                    onChange={ onChange }
                >
                </Rating>

            </div>
        </div>
    )
}

export default StarRate;