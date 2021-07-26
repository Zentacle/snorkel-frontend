import { sendEvent } from "hooks/amplitude"
import styles from "./Footer.module.css"


const Footer = () =>{
    const onClick = () => {
      sendEvent('submit_email');
    }

    return (
        <footer className={styles.footer}>
          <div className={ styles.emailContainer }>
            <div>Sign up to get updates on local conditions</div>
            <div className={ styles.formContainer }>
              <input className={ styles.emailBox } placeholder="email"/>
              <button className={ styles.emailSubmit } type="submit" onClick={ onClick }>Submit</button>
            </div>
          </div>
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