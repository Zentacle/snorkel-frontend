import styles from "../BeachReviews/BeachReviews.module.css";
import { useRouter } from "next/router";
import IndividualReview from "./IndividualReview/IndividualReview";
import { rootDomain } from 'lib/constants';
import React from "react";
async function getData(id) {
    
    fetch(`${rootDomain}/review/get?beach_id=`+ id,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        return response.json();
        
    })
  }
  
const BeachReviews = (props) => {
    const router = useRouter();
    const { beachid } = router.query
    const [reviews, setReviews] = React.useState(null);
   
        React.useEffect(() => {
            if(!router.isReady) return;
    
            if (!props.name) {
                fetch(`${rootDomain}/review/get?beach_id=${beachid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    return response.json();
                }).then(data => {
                    console.log(data.data);
                    setReviews(data.data);
                })
            }
        }, [router.isReady])
 
    
    return (
        <div>
            <div className={styles.reviewbuttoncontainer}>
                <div className={styles.reviewbutton} onClick={() => router.push(`./${beachid}/review`)}>Write a Review</div>
            </div>
            <br/>
            { reviews && reviews.length
                ? reviews.map(review => <IndividualReview review={review}></IndividualReview>)
                : <div>No reviews yet. Be the first!</div>
            }
        </div>
    )
}

export default BeachReviews;