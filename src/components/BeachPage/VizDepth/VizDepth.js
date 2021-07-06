import styles from "../VizDepth/VizDepth.module.css";

const VizDepth = () => {
    return (
        <div className={styles.container}>
            <div className={styles.viz}>
                <div className={styles.vizinfo}>Viz (last reported 5h)
                
                </div>
                <div className={styles.actualviz}>20 - 40ft</div>
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