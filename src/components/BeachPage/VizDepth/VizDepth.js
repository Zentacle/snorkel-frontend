import styles from "../VizDepth/VizDepth.module.css";
import Rating from "react-rating";
import { EmptyStar, FullStar } from "components/StarRating";

const VizDepth = ({
    date,
    max_depth,
    viz,
}) => {
    const lastDate = new Date(date);
    const now = new Date();
    let hours = parseInt(Math.abs(now - lastDate) / (60*60*1000));
    if (hours < 1) {
        hours = '<1'
    }

    return (
        <div className={styles.container}>
            <div className={styles.viz}>
                <div className={styles.vizinfo}>Viz {date && `(last reported ${hours}h ago)`}
                </div>
                <div className={styles.actualviz}>
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
            <div className={styles.depth}>
                <div className={styles.depthinfo}>Max Depth
                </div>
                <div className={styles.actualdepth}>{max_depth || '40ft (unconfirmed)'}</div>
            </div>
        </div>
    )
}

export default VizDepth;