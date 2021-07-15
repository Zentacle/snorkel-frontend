import styles from "./Footer.module.css"
const Footer = () =>{
    return (
        <footer className={styles.footer}>
          <div className={styles.footertext}>
            Find your next underwater adventure
          </div>
          <a className={ styles.footerLink } href="mailto:mjmayank@gmail.com">Report an issue</a>
          <a className={ styles.footerLink } href="mailto:mjmayank@gmail.com">Suggest an edit</a>
          <a className={ styles.footerLink } href="mailto:mjmayank@gmail.com">Add a new location</a>
        </footer>
    )
}

export default Footer;