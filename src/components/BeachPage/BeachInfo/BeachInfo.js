import styles from "../BeachInfo/BeachInfo.module.css";
import VizDepth from "../VizDepth/VizDepth";
import BeachReviews from "../BeachReviews/BeachReviews";
import ReviewSummary from 'components/BeachPage/ReviewSummary';

const EntryMap = ({ src }) => (
    <a className={ styles.entryMap } style={{ backgroundImage: `url(\'${src}\')` }} href={ src }>
        <div className={ styles.overlay }></div>
        <div className={ styles.viewButton }>View Entry Map</div>
    </a>
)

const BeachInfo = ({
    id,
    description,
    difficulty,
    entry_map,
    last_review_date,
    last_review_viz,
    name,
    ratings,
    rating,
    num_reviews,
    reviews,
    max_depth,
    url,
}) => {
    
    return (
        <div className={styles.container}>
            <VizDepth date={ last_review_date } difficulty={difficulty} viz={ last_review_viz } max_depth={ max_depth }></VizDepth>
            <h2 className={styles.sectionTitle}>About {name} Snorkeling and Scuba Diving</h2>
            <div className={styles.description}>
                { description }
            </div>
            { entry_map && <EntryMap src={ entry_map }/> }
            <ReviewSummary ratings={ ratings } rating={ rating } num_reviews={num_reviews}></ReviewSummary>
            <BeachReviews beachid={id} url={url} reviews={reviews}></BeachReviews>
        </div>
    )
}

export default BeachInfo;