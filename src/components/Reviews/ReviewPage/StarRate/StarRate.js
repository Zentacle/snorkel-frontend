import styles from "./StarRate.module.css";
import Rating from "react-rating";
import Star from "@material-ui/icons/Star";

const StarRate = ({value, onChange, onHover}) => {
    return (
        <div className={styles.ratingcontainer}>
            <Rating
                fractions={1} 
                initialRating={ value }
                emptySymbol={(<Star className={styles.starempty}></Star>)} 
                fullSymbol={(<Star className={styles.starfull}></Star>)}
                onChange={ onChange }
                onHover={ onHover }
            >
            </Rating>

        </div>
    )
}

export default StarRate;