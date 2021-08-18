import React from 'react';
import Image from 'next/image';

import { sendEvent } from "hooks/amplitude";
import styles from "./Footer.module.css";
import Link from 'next/link';
import { useRouter } from 'next/router';

const Footer = () => {
  const [email, setEmail] = React.useState('');
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const router = useRouter();

  const onClick = () => {
    sendEvent('submit_email', {
      email,
    });
    router.push('/register');
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.emailContainer}>
        <div className={styles.emailTitle}>Sign up to get updates on local conditions</div>
        <div className={styles.formContainer}>
          <input value={email} onChange={e => setEmail(e.target.value)} className={styles.emailBox} placeholder="email" />
          {
            hasSubmitted
              ? <div>Submitted!</div>
              : <button className={styles.emailSubmit} type="submit" onClick={onClick}>Submit</button>
          }
        </div>
      </div>
      <div className={styles.footerLinksContainer}>
        <div className={styles.leftColumn}>
          <div className={styles.logoContainer}>
            <Image src='/logo.png' height='32' width='32' alt="logo" />
            <span className={styles.headertitle}>Zentacle</span>
          </div>
          <div className={styles.footerLinkContainer}>
            <a style={{ display: 'block' }} className={styles.footerLink} href="mailto:mjmayank@gmail.com">Report an issue</a>
            <a style={{ display: 'block' }} className={styles.footerLink} href="mailto:mjmayank@gmail.com">Suggest an edit</a>
            <Link href='/add/spot'><a className={styles.footerLink}>Add a new location</a></Link>
            <Link href='/directory'><a className={styles.footerLink}>Directory</a></Link>
          </div>
        </div>
        <div className={styles.rightColumn}>
          <h3 className={styles.footertext}>
            Snorkel and Scuba Diving Reviews, Reef Maps, and Photos
          </h3>
          <div>
            Zentacle encourages the use of reef safe sunscreen that doesn&apos;t contain oxybenzone and octinoxate. Learn&nbsp;more&nbsp;at&nbsp;<Link href="https://vimeo.com/442787740">Reefs at Risk</Link>.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;