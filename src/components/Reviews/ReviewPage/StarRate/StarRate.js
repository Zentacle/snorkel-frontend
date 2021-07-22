import styles from "./StarRate.module.css";
import Rating from "react-rating";
import { Star } from "@material-ui/icons";

const StarRate = ({value, onChange, onHover, large}) => {
    return (
        <div className={styles.ratingcontainer}>
            <Rating
                fractions={1} 
                initialRating={ value }
                emptySymbol={(<Star className={`${styles.starempty} ${large && styles.large}`}></Star>)} 
                fullSymbol={(<Star className={`${styles.starfull} ${large && styles.large}`}></Star>)}
                onChange={ onChange }
                onHover={ onHover }
            >
            </Rating>

        </div>
    )
}

export default StarRate;