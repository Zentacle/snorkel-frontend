import styles from "../BeachReviews/BeachReviews.module.css";
import { useRouter } from "next/router";
import IndividualReview from "./IndividualReview/IndividualReview";
import { rootDomain } from 'lib/constants';

async function getData() {
    
    fetch(`${rootDomain}/review/get?beach_id=`+ `1`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        console.log(response.json());
        
    })
  }
  
const BeachReviews = () => {
    const router = useRouter();
    const { beachid } = router.query

    return (
        <div>
            <div className={styles.reviewbuttoncontainer}>
                <div className={styles.reviewbutton} onClick={() => router.push(`./${beachid}/review`)}>Write a Review</div>
            </div>
            <br/>
            <IndividualReview review="the review"></IndividualReview>
        </div>
    )
}

export default BeachReviews;