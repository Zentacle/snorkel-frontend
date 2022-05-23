import Link from 'next/link';
import styles from './styles.module.css';

const PrimaryButton = ({
  children,
  disabled = false,
  onClick = () => { },
  className = '',
  type='button',
}) => {
  return (
    <button onClick={onClick} className={`${styles.button} ${className}`} disabled={disabled} type={type}>
      {children}
    </button>
  )
}

export const PrimaryLink = ({
  children,
  href,
  onClick = () => { },
  className = ''
}) => (
  <Link href={href}>
    <a onClick={onClick} className={`${styles.button} ${className}`}>
      {children}
    </a>
  </Link>
)

export default PrimaryButton