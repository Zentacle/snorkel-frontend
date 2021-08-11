import React from "react";

import styles from "../BeachReviews/BeachReviews.module.css";
import IndividualReview from "./IndividualReview/IndividualReview";
import { useCurrentUser } from 'context/usercontext';
import { PrimaryLink } from 'components/PrimaryButton';
import { sendEvent } from 'hooks/amplitude';
  
const BeachReviews = (props) => {
    const { beachid } = props;
    
    
    const onReviewClick = () => {
        sendEvent('review_begin', {
            'site_id': beachid,
        })
    }
 
    const { state } = useCurrentUser();
    const link = state.user && state.user.id
        ? `./${beachid}/review`
        : '/Login'

    return (
        <div className={styles.reviewContainer}>
            <div className={styles.reviewbuttoncontainer}>
                <PrimaryLink onClick={ onReviewClick } className={styles.reviewbutton} href={ link }>Write a Review</PrimaryLink>
            </div>
            { props.reviews && props.reviews.length
                ? props.reviews.map((review) => <IndividualReview key={ review.id } review={review} user={review.user}></IndividualReview>)
                : <div className={ styles.emptyState }>No reviews yet. Be the first!</div>
            }
        </div>
    )
}

export default BeachReviews;