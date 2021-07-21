import Link from 'next/link';
import styles from './styles.module.css';

const PrimaryButton = ({ children, disabled, onClick }) => {
  return (
    <button onClick={onClick} className={styles.button} disabled={disabled}>
      {children}
    </button>
  )
}

export const PrimaryLink = ({ children, href }) => (
  <Link href={href}>
    <a className={styles.button}>
      {children}
    </a>
  </Link>
)

export default PrimaryButton