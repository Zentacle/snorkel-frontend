import styles from "../BeachReviews/BeachReviews.module.css";
import { useRouter } from "next/router";
const ReviewButton = () => {
    const router = useRouter();
    return (
        <div className={styles.reviewbuttoncontainer}>
        <div className={styles.reviewbutton} onClick={()=>router.push("/Review")}>Write a Review</div>
        </div>
    )
}

const BeachReviews = () => {
    return (
        <div>
            <ReviewButton>
            </ReviewButton>
        </div>
    )
}

export default BeachReviews;