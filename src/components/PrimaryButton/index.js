import Link from 'next/link';
import styles from './styles.module.css';

const PrimaryButton = ({ children, onClick }) => {
  return (
    <button onClick={onClick} className={styles.button}>
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