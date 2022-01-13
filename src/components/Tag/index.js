import styles from "./styles.module.css";

const Tag = ({
    text,
    type,
}) => {
    return (
        <div className={styles.container}>
            { text }
        </div>
    )
}

export default Tag;
