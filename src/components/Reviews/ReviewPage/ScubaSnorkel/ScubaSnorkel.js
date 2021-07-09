import styles from "./ScubaSnorkel.module.css";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import React from "react";
const ScubaSnorkel = ({ value, onChange }) => {

    const handleToggle = (event, newType) => {
        onChange(newType);
    }

    return (
        <ToggleButtonGroup value={value} onChange={handleToggle} exclusive style={{ width: "100%" }}>
            <ToggleButton className={styles.button} value="snorkel">
                Snorkel
            </ToggleButton>
            <ToggleButton className={styles.button} value="scuba">
                Scuba
            </ToggleButton>
        </ToggleButtonGroup>
    )
}

export default ScubaSnorkel;