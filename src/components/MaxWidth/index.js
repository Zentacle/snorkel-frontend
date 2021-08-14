import styles from './styles.module.css';

const MaxWidth = ({children}) => (
  <div className={styles.container}>
    { children }
  </div>
)

export default MaxWidth;
