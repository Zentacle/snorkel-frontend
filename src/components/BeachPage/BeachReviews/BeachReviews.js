import React from 'react';
import Link from 'next/link';

import styles from '../BeachReviews/BeachReviews.module.css';
import IndividualReview from './IndividualReview/IndividualReview';
import { useCurrentUser } from 'context/usercontext';
import PrimaryButton, { PrimaryLink } from 'components/PrimaryButton';
import { sendEvent } from 'hooks/amplitude';

const BeachReviews = (props) => {
  const { beachid, url } = props;
  const [isCollapsed, setIsCollapse] = React.useState(true);

  const onReviewClick = () => {
    sendEvent('review_begin', {
      site_id: beachid,
    });
  };

  const { state } = useCurrentUser();
  const link =
    state.user && state.user.id
      ? `${url}/review`
      : `https://zentacle.app.link/Log?beach_id=${beachid}&$deeplink_path=Log?beach_id=${beachid}&utm_medium=xpromo&utm_source=xpromo&campaign=review`;

  const onViewAllClick = () => {
    setIsCollapse(false);
    sendEvent('click__view_all_reviews');
  };

  return (
    <div className={styles.reviewContainer}>
      <div className={styles.reviewbuttoncontainer}>
        <PrimaryLink
          onClick={onReviewClick}
          className={styles.reviewbutton}
          href={link}
        >
          Write a Review
        </PrimaryLink>
      </div>
      {props.isSingularReview ? (
        <div>
          Currently viewing a specific review.&nbsp;
          <Link href={url}>
            <a className={styles.viewAll}>View all reviews</a>
          </Link>
        </div>
      ) : (
        <></>
      )}
      <div
        className={`${styles.reviewsContainer} ${
          isCollapsed && styles.isCollapsed
        }`}
      >
        {props.reviews && props.reviews.length ? (
          props.reviews.map((review) => (
            <IndividualReview
              key={review.id}
              review={review}
              user={review.user}
            />
          ))
        ) : (
          <div className={styles.emptyState}>No reviews yet. Be the first!</div>
        )}
      </div>
      {isCollapsed && props.reviews.length ? (
        <PrimaryButton onClick={onViewAllClick}>
          View all {props.reviews.length} reviews
        </PrimaryButton>
      ) : (
        <></>
      )}
    </div>
  );
};

export default BeachReviews;
