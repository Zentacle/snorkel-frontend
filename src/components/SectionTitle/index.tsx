import styles from "./styles.module.css";

interface Props {
  className?: string;
  text: string;
}

const SectionTitle = (props: Props) => (
  <h2 className={`${styles.sectionTitle} ${props.className}`}>{props.text}</h2>
)

export default SectionTitle;
