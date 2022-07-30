import styles from "./StarRate.module.css";
import Rating from "react-rating";
import { EmptyStar, FullStar } from "components/StarRating";

const StarRate = ({ value, onChange, onHover }) => {
    return (
        <div className={styles.ratingcontainer}>
            <Rating
                fractions={1}
                initialRating={value}
                emptySymbol={(<EmptyStar />)}
                fullSymbol={(<FullStar />)}
                onChange={onChange}
                onHover={onHover}
            />
        </div>
    )
}

export default StarRate;