import styles from "../IndividualReview/IndividualReview.module.css";
import Rating from "react-rating";
import { Star } from "@material-ui/icons";
const IndividualReview = ({review}) => {
    return (
        <div className={styles.container}>
            
            <div className={styles.outerupper}>
            <div className={styles.imageouter}>
            image
            </div>
            <div className={styles.centerouter}>
                <div className={styles.centerupper}>
                    Matthew Betsill
                </div>
                <div className={styles.centerlower}>
                <Rating fractions={2}
                    emptySymbol={(<Star className={styles.starempty}></Star>)}
                    fullSymbol={(<Star className={styles.starfull}></Star>)}
                    initialRating={5}
                    readonly></Rating>
                </div>
            </div>

            </div>
            <div className={styles.outerlower}>

            </div>
            </div>
    )
}

export default IndividualReview;