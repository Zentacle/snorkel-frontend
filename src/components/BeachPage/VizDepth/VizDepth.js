import styles from "../VizDepth/VizDepth.module.css";

const VizDepth = ({ date, viz }) => {
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
                <div className={styles.actualviz}>{ `${viz}ft` || 'N/A' }</div>
            </div>
            <div className={styles.depth}>
                <div className={styles.depthinfo}>Max Depth
                </div>
                <div className={styles.actualdepth}>40ft</div>
            </div>
        </div>
    )
}

export default VizDepth;