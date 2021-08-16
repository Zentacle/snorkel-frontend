import styles from "../BeachInfo/BeachInfo.module.css";
import VizDepth from "../VizDepth/VizDepth";
import BeachAbout from "../BeachAbout/BeachAbout";
import BeachReviews from "../BeachReviews/BeachReviews";
import ReviewSummary from 'components/BeachPage/ReviewSummary';
import AdCarousel from "components/AdCarousel";

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
    latitude,
    longitude,
    ratings,
    rating,
    num_reviews,
    reviews,
    max_depth,
}) => {
    
    return (
        <div className={styles.container}>
            <VizDepth date={ last_review_date } difficulty={difficulty} viz={ last_review_viz } max_depth={ max_depth }></VizDepth>
            <BeachAbout description={ description }></BeachAbout>
            { entry_map && <EntryMap src={ entry_map }/> }
            { latitude && longitude && <div
                data-gyg-href="https://widget.getyourguide.com/default/activities.frame"
                data-gyg-locale-code="en-US"
                data-gyg-widget="activities"
                data-gyg-number-of-items="3"
                data-gyg-partner-id="215UJOG"
                data-gyg-q={`${latitude},${longitude}`}
            ></div> }
            <ReviewSummary ratings={ ratings } rating={ rating } num_reviews={num_reviews}></ReviewSummary>
            <BeachReviews beachid={id} reviews={reviews}></BeachReviews>
        </div>
    )
}

export default BeachInfo;