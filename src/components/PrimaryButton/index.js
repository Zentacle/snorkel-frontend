import styles from './styles.module.css';

export default ({ children, onClick }) => {
  return (
    <button onClick={ onClick } className={styles.button}>
        { children }
    </button>
  )
}