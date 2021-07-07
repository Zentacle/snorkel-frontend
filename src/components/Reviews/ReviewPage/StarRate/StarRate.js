import styles from "./StarRate.module.css";
import Rating from "react-rating";
import Image from "next/image";
const StarRate = () => {
    return (
        <div className={styles.container}>
            <div className={styles.ratingtitle}>
                Rating
            </div>
            <div className={styles.ratingcontainer}>
                <Rating fractions={2} />
            </div>
        </div>
    )
}

export default StarRate;