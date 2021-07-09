import styles from './styles.module.css';

const PrimaryButton = ({ children, onClick }) => {
  return (
    <button onClick={ onClick } className={styles.button}>
        { children }
    </button>
  )
}

export default PrimaryButton