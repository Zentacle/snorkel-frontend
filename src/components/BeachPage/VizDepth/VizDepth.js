import styles from "../VizDepth/VizDepth.module.css";
import Rating from "react-rating";
import { EmptyStar, FullStar } from "components/StarRating";

const VizDepth = ({
    date,
    difficulty,
    max_depth,
    viz,
}) => {
    const lastDate = new Date(date);
    const now = new Date();
    let hours = parseInt(Math.abs(now - lastDate) / (60*60*1000));
    if (hours < 1) {
        hours = '<1'
    }

    let difficultyClassName = styles.undetermined
    switch (difficulty) {
        case 'advanced':
            difficultyClassName = styles.advanced;
            break;
        case 'intermediate':
            difficultyClassName = styles.intermediate;
            break;
        case 'beginner':
            difficultyClassName = styles.beginner;
            break;
    }

    return (
        <div className={styles.container}>
            <div className={styles.itemContainer}>
                <div className={styles.header}>Difficulty</div>
                <div className={styles.value}> <span className={difficultyClassName}>{difficulty || 'Not ranked yet'}</span></div>
            </div>
            <div className={styles.itemContainer}>
                <div className={styles.header}>Viz {date && `(last reported ${hours}h ago)`}
                </div>
                <div className={styles.value}>
                    { viz
                    ? <Rating
                            fractions={2}
                            emptySymbol={(<EmptyStar/>)}
                            fullSymbol={(<FullStar/>)}
                            initialRating={Math.min(viz, 5)}
                            readonly>
                        </Rating>
                    : 'N/A' }
                </div>
            </div>
            <div className={styles.itemContainer}>
                <div className={styles.header}>Max Depth
                </div>
                <div className={styles.value}>{max_depth || '40ft (unconfirmed)'}</div>
            </div>
        </div>
    )
}

export default VizDepth;