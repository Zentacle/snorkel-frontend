import React from "react";
import Image from 'next/image';

import styles from "./styles.module.css";
import NearbyShops from 'components/NearbyShops';
import Selector from 'components/BeachPage/Selector';
import VizDepth from "components/BeachPage/VizDepth/VizDepth";
import Patron from 'components/Patron';
import SectionTitle from 'components/SectionTitle';
import Tag from 'components/Tag';

const EntryMap = ({ src }) => (
    <a className={styles.entryMap} href={src}>
        <Image
            src={src}
            layout="fill"
            objectFit='cover'
            alt="entry map"
        />
        <div className={styles.overlay}></div>
        <div className={styles.viewButton}>View Entry Map</div>
    </a>
)

const BeachInfo = ({
    area_one,
    area_two,
    area_two_id,
    description,
    difficulty,
    entry_map,
    last_review_date,
    last_review_viz,
    name,
    nearbyShops,
    location_city,
    rating,
    num_reviews,
    max_depth,
    access,
    tides,
}) => {
    const [tidesArray, setTides] = React.useState(tides)

    React.useEffect(() => {
        setTides([...tidesArray]);
    }, [])

    return (
        <div className={styles.container}>
            <VizDepth date={last_review_date} difficulty={difficulty} viz={last_review_viz} max_depth={max_depth}></VizDepth>
            <SectionTitle text={`Snorkeling and Scuba Diving at ${name}`} />
            <div className={styles.description}>
                {description.length < 3
                    ? `${name} is a ${Math.round(rating * 100) / 100}-star rated scuba dive and snorkel destination in ${location_city} which is accessible from shore based on ${num_reviews} ratings. Visibility conditions were rated a ${last_review_viz} out of 5.`
                    : description}
            </div>
            {access && access.length ? <div className={styles.tagHeader}>Access</div> : <></>}
            {access && access.map(tag => (<Tag key={tag.id} text={tag.text} type={'entry'} />))}
            {entry_map && <EntryMap src={entry_map} />}
            <Selector tidesArray={tidesArray} nearbyShops={nearbyShops}/>
            {
                (area_two_id == 5 || area_two_id == 2 || area_two_id == 1)
                && area_two
                && area_one
                && <Patron areaPatronKey={[area_one.short_name, area_two.short_name]} name={name} />
            }
        </div>
    )
}

export default BeachInfo;
