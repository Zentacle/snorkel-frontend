import styles from "./ScubaSnorkel.module.css";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import React from "react";
const ScubaSnorkel = () => {
    const [activityType, setType] = React.useState('');

    const handleToggle = (event, newType) => {
        setType(newType);
    }

    return (
        <div className={styles.container}>
            <ToggleButtonGroup value={activityType} onChange={handleToggle} exclusive style={{ width: "100%" }}>
                <ToggleButton className={styles.button} value="snorkel">
                    <div className={styles.button}>
                        Snorkel
                    </div>
                </ToggleButton>
                <ToggleButton className={styles.button} value="scuba">
                    <div className={styles.button}>
                        Scuba
                    </div>
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    )
}

export default ScubaSnorkel;