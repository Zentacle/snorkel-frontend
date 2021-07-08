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
    // const res = await fetch('https://snorkel-backend.herokuapp.com/spots/get')
    // const data =  await res.json()
    
    fetch(`https://snorkel-backend.herokuapp.com/review/get?beach_id=`+ `1`,{
        method: 'GET',
        
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        console.log(response.json());
        
    })
  }
  
const BeachReviews = () => {
    // getData();
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