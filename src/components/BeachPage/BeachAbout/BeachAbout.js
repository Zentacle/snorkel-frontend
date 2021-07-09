import styles from "../BeachAbout/BeachAbout.module.css";

const BeachAbout = ({ description }) => {
    return (
        <div className={styles.container}>
            <div className={styles.description}>
                { description }
            </div>
        </div>
    )
}

export default BeachAbout;