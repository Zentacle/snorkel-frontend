import styles from "../BackgroundCard/BackgroundCard.module.css";
import { Card } from "@material-ui/core";
const BackgroundCard = ({children}) => {
    return (
    <div className={styles.outercard}>
        <Card><div className={styles.innercard}>{children}</div></Card>
    </div>
    )
}

export default BackgroundCard;