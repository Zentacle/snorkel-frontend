import styles from "./ScubaSnorkel.module.css";
import React from "react";
const ScubaSnorkel = ({ value, onChange }) => {

    const handleToggle = (newType) => {
        onChange(newType);
    }

    return (
        <div>
            <button
                onClick={e => handleToggle('snorkel')}
                className={value === 'snorkel' ? styles.active : styles.pill}
            >
                Snorkel
            </button>
            <button
                onClick={e => handleToggle('scuba')}
                className={value === 'scuba' ? styles.active : styles.pill}
            >
                Scuba
            </button>
            <button
                onClick={e => handleToggle('freediving')}
                className={value === 'freediving' ? styles.active : styles.pill}
            >
                Freediving
            </button>
        </div>
    )
}

export default ScubaSnorkel;