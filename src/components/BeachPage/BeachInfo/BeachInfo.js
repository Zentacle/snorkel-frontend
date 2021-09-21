import styles from "../BeachInfo/BeachInfo.module.css";
import VizDepth from "../VizDepth/VizDepth";
import BeachReviews from "../BeachReviews/BeachReviews";
import ReviewSummary from 'components/BeachPage/ReviewSummary';
import React from "react";

const EntryMap = ({ src }) => (
    <a className={ styles.entryMap } style={{ backgroundImage: `url(\'${src}\')` }} href={ src }>
        <div className={ styles.overlay }></div>
        <div className={ styles.viewButton }>View Entry Map</div>
    </a>
)

const BeachInfo = ({
    id,
    area_two_id,
    description,
    difficulty,
    entry_map,
    last_review_date,
    last_review_viz,
    name,
    location_city,
    ratings,
    rating,
    num_reviews,
    reviews,
    max_depth,
    url,
    tides,
    stationData,
}) => {
    const [tidesArray, setTides] = React.useState(tides)

    React.useEffect(() => {
        setTides([...tidesArray]);
    }, [])
    
    return (
        <div className={styles.container}>
            <VizDepth date={ last_review_date } difficulty={difficulty} viz={ last_review_viz } max_depth={ max_depth }></VizDepth>
            <h2 className={styles.sectionTitle}>About {name} Snorkeling and Scuba Diving</h2>
            <div className={styles.description}>
                { description.length < 3
                    ? `${name} is a ${Math.round(rating * 100) / 100}-star rated scuba dive and snorkel destination in ${location_city} based on ${num_reviews} ratings. Visibility conditions were rated a ${last_review_viz} out of 5.`
                    :  description }
            </div>
            { entry_map && <EntryMap src={ entry_map }/> }
            { tidesArray.length ? <>
                <h3 className={styles.sectionTitle}>{name} Tide Chart (Beta)</h3>
                <div className={styles.helper}>Nearest tide station in {stationData.name}, {stationData.region} ({Math.round(stationData.distance * 100) / 100} mi away)</div>
                <div className={`${styles.tideRow} ${styles.tideRowHeader}`}>
                    <div className={styles.tideItem}>Date</div>
                    <div className={styles.tideItem}>Height</div>
                    <div className={styles.tideItem}>High/Low Tide</div>
                </div>
                { tidesArray.slice(0, 5).map(tide => <div className={styles.tideRow} key={tide.t}>
                    <div className={`${styles.tideItem} ${new Date(`${tide.t} GMT`) < new Date() ? styles.past : '' }`}>{new Date(`${tide.t} GMT`).toLocaleString([], {'weekday': 'short', 'day': 'numeric', 'month': 'short', hour: 'numeric', minute:'2-digit'})}</div>
                    <div className={`${styles.tideItem} ${new Date(`${tide.t} GMT`) < new Date() ? styles.past : '' }`}>{tide.v}ft</div>
                    <div className={`${styles.tideItem} ${new Date(`${tide.t} GMT`) < new Date() ? styles.past : '' }`}>{tide.type}</div>
                    </div>)}
                </> : <></> }
            {
                area_two_id == 2 && <div>
                    <h3 className={styles.sectionTitle}>{name} Patrons</h3>
                    <div className={styles.description}><a className={styles.patronName} href="https://www.konashoredivers.com">Kone Shore Divers</a> - Our goal is to give you the opportunity to share and explore the underwater world in and around the near shore waters of Kailua-Kona. We focus on small group sizes and strive to offer the best personalized service we can to our guests. From the first timer to the old timer come with us and see what the Kona Shore has to offer!</div>
                </div>
            }
            <ReviewSummary ratings={ ratings } rating={ rating } num_reviews={num_reviews}></ReviewSummary>
            <BeachReviews beachid={id} url={url} reviews={reviews}></BeachReviews>
        </div>
    )
}

export default BeachInfo;