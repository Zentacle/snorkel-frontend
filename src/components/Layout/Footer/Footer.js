import React from 'react';

import { sendEvent } from "hooks/amplitude";
import styles from "./Footer.module.css";
import Link from 'next/link';

const Footer = () =>{
    const [email, setEmail] = React.useState('');
    const [hasSubmitted, setHasSubmitted] = React.useState(false);

    const onClick = () => {
      sendEvent('submit_email', {
        email,
      });
    }

    return (
        <footer className={styles.footer}>
          <div className={ styles.emailContainer }>
            <div>Sign up to get updates on local conditions</div>
            <div className={ styles.formContainer }>
              <input value={email} onChange={e=>setEmail(e.target.value)} className={ styles.emailBox } placeholder="email"/>
              {
                hasSubmitted
                  ? <div>Submitted!</div>
                  : <button className={ styles.emailSubmit } type="submit" onClick={ onClick }>Submit</button>
              }
            </div>
          </div>
          <h3 className={styles.footertext}>
            Snorkel and Scuba Diving Reviews
          </h3>
          <div>
            Zentacle encourages the use of reef safe sunscreen that doesn&apos;t contain oxybenzone and octinoxate. Learn&nbsp;more&nbsp;at&nbsp;<Link href="https://vimeo.com/442787740">Reefs at Risk</Link>.
          </div>
          <div className={ styles.footerLinkContainer }>
            <a style={{ display: 'block' }} className={ styles.footerLink } href="mailto:mjmayank@gmail.com">Report an issue</a>
            <a style={{ display: 'block' }} className={ styles.footerLink } href="mailto:mjmayank@gmail.com">Suggest an edit</a>
            <Link href='/add/spot'><a className={ styles.footerLink }>Add a new location</a></Link>
            <Link href='/directory'><a className={ styles.footerLink }>Directory</a></Link>
          </div>
        </footer>
    )
}

export default Footer;