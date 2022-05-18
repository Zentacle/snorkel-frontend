import styles from "../BackgroundCard/BackgroundCard.module.css";

const BackgroundCard = ({ children }) => {
    return (
        <div className={styles.outercard}>
            <div className={styles.innercard}>
                {children}
            </div>
        </div>
    )
}

export default BackgroundCard;