import styles from "../BeachAbout/BeachAbout.module.css";

const BeachAbout = ({ description }) => {
    return (
            <div className={styles.description}>
                { description }
            </div>
    )
}

export default BeachAbout;