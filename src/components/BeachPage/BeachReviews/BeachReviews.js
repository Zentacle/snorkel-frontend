import styles from "../BeachReviews/BeachReviews.module.css";
import { useRouter } from "next/router";
import IndividualReview from "./IndividualReview/IndividualReview";
const ReviewButton = () => {
    const router = useRouter();
    return (
        <div className={styles.reviewbuttoncontainer}>
            <div className={styles.reviewbutton} onClick={() => router.push("/Review")}>Write a Review</div>
        </div>
    )
}

async function getData() {
    const res = await fetch(`${rootDomain}/spots/get`)
    const data =  await res.json()
    console.log(data);
    return data.data;
  }
  
const BeachReviews = () => {
    getData();
    return (
        <div>
            <ReviewButton>
            </ReviewButton>
            <br/>
            <IndividualReview review="the review"></IndividualReview>
        </div>
    )
}

export default BeachReviews;