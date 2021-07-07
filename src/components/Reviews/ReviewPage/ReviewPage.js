import styles from "../ReviewPage/ReviewPage.module.css";
import ScubaSnorkel from "./ScubaSnorkel/ScubaSnorkel";
import StarRate from "./StarRate/StarRate";
import Layout from "../../Layout/Layout";
import Router from "next/router";
const Review = () => {
    
    return (
        <div className={styles.paragraphwrapper}>
            <div className={styles.reviewtitle}>
                Review
            </div>
            <textarea className={styles.paragraphreview} cols="50" rows="10">
            </textarea>
            <br />
            <br />
            <div className={styles.vizwrapper}>
                <div className={styles.reviewtitle}>
                    Visibility
                </div>
                <div className={styles.vizreview}>
                    <input placeholder="visibility (ft)"></input>
                </div>
            </div>
            <br />
            <div className={styles.buttonwrapper}>
                <div className={styles.nextbutton} onClick={() => Router.push('/')}>
                    Next
                </div>
            </div>
        </div>
    )
}
const ReviewPage = () => {
    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.beachtitle}>Mala Wharf</div>
                <br />
                <ScubaSnorkel></ScubaSnorkel>
                <br />
                <StarRate></StarRate>
                <br />
                <Review></Review>
            </div>
        </Layout>
    )
}

export default ReviewPage;