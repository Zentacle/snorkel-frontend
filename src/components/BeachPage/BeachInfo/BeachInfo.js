import styles from "../BeachInfo/BeachInfo.module.css";
import VizDepth from "../VizDepth/VizDepth";
import BeachAbout from "../BeachAbout/BeachAbout";
import BeachReviews from "../BeachReviews/BeachReviews";
const BeachInfo = ({ description, viz, depth, reviews }) => {
    return (
        <div className={styles.container}>
            <VizDepth></VizDepth>
            <BeachAbout description={ description }></BeachAbout>
            <BeachReviews></BeachReviews>
        </div>
    )
}

export default BeachInfo;