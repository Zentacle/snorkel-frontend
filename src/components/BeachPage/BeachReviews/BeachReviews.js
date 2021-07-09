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
  
const BeachReviews = () => {
    const router = useRouter();
    const { beachid } = router.query
    const [reviews, setReviews] = React.useState(null);
   
        React.useEffect(() => {
            if(!router.isReady) return;
    
            if (!props.name) {
                fetch(`${rootDomain}/spots/get?beach_id=${beachid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    return response.json();
                }).then(data => {
                    setName(data.data.name);
                })
            }
        }, [router.isReady])
 
    
    return (
        <div>
            <div className={styles.reviewbuttoncontainer}>
                <div className={styles.reviewbutton} onClick={() => router.push(`./${beachid}/review`)}>Write a Review</div>
            </div>
            <br/>
            {reviews && <IndividualReview review={reviews[0]}></IndividualReview>}
        </div>
    )
}

export default BeachReviews;