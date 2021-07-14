import React from "react";
import { useRouter } from "next/router";

import styles from "../BeachReviews/BeachReviews.module.css";
import IndividualReview from "./IndividualReview/IndividualReview";
import { rootDomain } from 'lib/constants';
import { useCurrentUser } from 'context/usercontext';
import { PrimaryLink } from 'components/PrimaryButton';

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
                    
                    setReviews(data.data);
                })
            }
        }, [router.isReady])
 
    const { state } = useCurrentUser();
    const link = state.user && state.user.id
        ? `./${beachid}/review`
        : '/Login'

    return (
        <div className={styles.reviewContainer}>
            <div className={styles.reviewbuttoncontainer}>
                <PrimaryLink className={styles.reviewbutton} href={ link }>Write a Review</PrimaryLink>
            </div>
            <br/>
            { reviews && reviews.length
                ? reviews.map(review => <IndividualReview key={ review.id } review={review}></IndividualReview>)
                : <div className={ styles.emptyState }>No reviews yet. Be the first!</div>
            }
        </div>
    )
}

export default BeachReviews;