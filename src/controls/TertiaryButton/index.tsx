import Link from 'next/link';
import styles from './styles.module.css';

const TertiaryButton = ({
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={`${styles.button} ${className}`} {...props} >
      {children}
    </button>
  )
}

export const TertiaryLink = ({
  children,
  href,
  onClick = () => { },
  className = ''
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <Link href={href!}>
    <a onClick={onClick} className={`${styles.button} ${className}`}>
      {children}
    </a>
  </Link>
)

export default TertiaryButton