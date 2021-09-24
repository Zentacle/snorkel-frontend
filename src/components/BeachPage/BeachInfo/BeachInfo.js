import React from "react";

import styles from "./styles.module.css";
import VizDepth from "components/BeachPage/VizDepth/VizDepth";
import BeachReviews from "components/BeachPage/BeachReviews/BeachReviews";
import ReviewSummary from 'components/BeachPage/ReviewSummary';
import Patron from 'components/Patron';
import SectionTitle from "components/SectionTitle";

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
            <SectionTitle text={`About ${name} Snorkeling and Scuba Diving`}/>
            <div className={styles.description}>
                { description.length < 3
                    ? `${name} is a ${Math.round(rating * 100) / 100}-star rated scuba dive and snorkel destination in ${location_city} based on ${num_reviews} ratings. Visibility conditions were rated a ${last_review_viz} out of 5.`
                    :  description }
            </div>
            { entry_map && <EntryMap src={ entry_map }/> }
            { tidesArray.length ? <>
                <h3 className={styles.sectionTitle}>{name} Tide Chart and Surf Report (Beta)</h3>
                <div className={styles.helper}>Nearest tide station in {stationData.name}, {stationData.region} ({Math.round(stationData.distance * 100) / 100} mi away)</div>
                <div className={`${styles.tideRow} ${styles.tideRowHeader}`}>
                    <div className={styles.tideItem}>Date</div>
                    <div className={styles.tideItem}>Height</div>
                    <div className={styles.tideItem}>High/Low Tide</div>
                </div>
                { tidesArray.slice(0, 5).map(tide => {
                    const tideData = new Date(`${tide.t.replace(/ /g,"T")}Z`);
                    return (
                        <div className={styles.tideRow} key={tide.t}>
                            <div className={`${styles.tideItem} ${tideData < new Date() ? styles.past : '' }`}>{tideData.toLocaleString([], {'weekday': 'short', 'day': 'numeric', 'month': 'short', hour: 'numeric', minute:'2-digit'})}</div>
                            <div className={`${styles.tideItem} ${tideData < new Date() ? styles.past : '' }`}>{tide.v}ft</div>
                            <div className={`${styles.tideItem} ${tideData < new Date() ? styles.past : '' }`}>{tide.type}</div>
                        </div>
                    )
                })}
                </> : <></> }
            {
                area_two_id == 2 && <Patron name={name}/>
            }
            <ReviewSummary ratings={ ratings } rating={ rating } num_reviews={num_reviews}></ReviewSummary>
            <BeachReviews beachid={id} url={url} reviews={reviews}></BeachReviews>
        </div>
    )
}

export default BeachInfo;