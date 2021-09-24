import styles from "./styles.module.css";

const SectionTitle = (props) => (
  <h2 className={styles.sectionTitle}>{props.text}</h2>
)

export default SectionTitle;
