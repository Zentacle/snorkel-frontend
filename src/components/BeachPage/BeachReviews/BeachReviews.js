import React from "react";
import {
    AutoSizer,
    WindowScroller,
    List,
    CellMeasurerCache,
    CellMeasurer,
} from 'react-virtualized';

import styles from "../BeachReviews/BeachReviews.module.css";
import IndividualReview from "./IndividualReview/IndividualReview";
import { useCurrentUser } from 'context/usercontext';
import { PrimaryLink } from 'components/PrimaryButton';
import { sendEvent } from 'hooks/amplitude';

const cache = new CellMeasurerCache({
    defaultHeight: 150,
    fixedWidth: true,
});

const BeachReviews = (props) => {
    const { beachid } = props;
    const [reviews, setReviews] = React.useState(props.reviews);

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
            { reviews && reviews.length
                ? <WindowScroller>
                    {({ height, isScrolling, onChildScroll, scrollTop }) => (
                    <AutoSizer disableHeight>
                        {({width}) => <List
                            autoHeight
                            height={height}
                            isScrolling={isScrolling}
                            onScroll={onChildScroll}
                            scrollTop={scrollTop}
                            rowCount={reviews.length}
                            deferredMeasurementCache={cache}
                            rowHeight={cache.rowHeight}
                            width={width}
                            rowRenderer={({ index, parent, style }) => (
                                <CellMeasurer
                                    cache={cache}
                                    columnIndex={0}
                                    key={reviews[index].id}
                                    parent={parent}
                                    rowIndex={index}
                                >
                                    <IndividualReview
                                        key={ reviews[index].id }
                                        review={reviews[index]}
                                        user={reviews[index].user}
                                        style={style}
                                    />
                                </CellMeasurer>
                            )}
                        />}
                    </AutoSizer>)}
                </WindowScroller>
                : <div className={ styles.emptyState }>No reviews yet. Be the first!</div>
            }
        </div>
    )
}

export default BeachReviews;