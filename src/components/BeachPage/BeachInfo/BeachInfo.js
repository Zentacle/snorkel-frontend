import styles from "../BeachInfo/BeachInfo.module.css";
import VizDepth from "../VizDepth/VizDepth";
import BeachAbout from "../BeachAbout/BeachAbout";
import BeachReviews from "../BeachReviews/BeachReviews";
import ReviewSummary from 'components/BeachPage/ReviewSummary';

const EntryMap = ({ src }) => (
    <a className={ styles.entryMap } style={{ backgroundImage: `url(\'${src}\')` }} href={ src }>
        <div className={ styles.overlay }></div>
        <div className={ styles.viewButton }>View Entry Map</div>
    </a>
)

const BeachInfo = ({ id, description, entry_map, last_review_date, last_review_viz, ratings, rating, num_reviews, reviews }) => {
    
    return (
        <div className={styles.container}>
            <VizDepth date={ last_review_date } viz={ last_review_viz }></VizDepth>
            <BeachAbout description={ description }></BeachAbout>
            { entry_map && <EntryMap src={ entry_map }/> }
            <ReviewSummary ratings={ ratings } rating={ rating } num_reviews={num_reviews}></ReviewSummary>
            <BeachReviews beachid={id} reviews={reviews}></BeachReviews>
        </div>
    )
}

export default BeachInfo;