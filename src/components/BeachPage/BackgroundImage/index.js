import styles from "components/BeachPageHero/styles.module.css";
import Rating from "react-rating";
import { EmptyStar, FullStar } from "components/StarRating";
const BackgroundImageOnly = ({ ...props }) => {
    return (
        <div className={styles.imageinner} style={{ backgroundImage: `url(\'${props.hero_img}\')` }}>
            <div className={styles.overlay} />
            <div className={styles.pageHeroInfo}>
                <h1 className={styles.pagetitle}>{props.name}</h1>
                <div className={styles.stars}>
                    <Rating
                        fractions={2}
                        emptySymbol={(<EmptyStar />)}
                        fullSymbol={(<FullStar />)}
                        initialRating={props.rating}
                        readonly>
                    </Rating>
                </div>
                <div className={styles.beachdescription}>{props.location_city}</div>
            </div>

        </div>
    )
    
}

export default BackgroundImageOnly;