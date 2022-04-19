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
              : <button className={styles.emailSubmit} type="submit" onClick={onClick}>
                <span className={styles.emailSubmitText}>
                  Submit
                </span>
              </button>
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
            <Link href='/directory'><a className={styles.footerLink}>Dive Spot Directory</a></Link>
            <Link href='/directory/loc'><a className={styles.footerLink}>Region Directory</a></Link>
            <Link href='/add/spot'><a className={styles.footerLink}>Add a new location</a></Link>
            <a style={{ display: 'block' }} className={styles.footerLink} href="mailto:mayank@zentacle.com">Report an issue</a>
            <a style={{ display: 'block' }} className={styles.footerLink} href="mailto:mayank@zentacle.com">Suggest an edit</a>
            <Link href='https://www.shorediving.com'><a className={styles.footerLink}>ShoreDiving.com</a></Link>
            <Link href='https://www.patreon.com/ShoreDiving'><a className={styles.footerLink}>Donate</a></Link>
            <Link href='https://www.shorediving.com/content/dive_clubs.htm'><a className={styles.footerLink}>Dive Clubs</a></Link>
          </div>
        </div>
        <div className={styles.rightColumn}>
          <h3 className={styles.footertext}>
            Snorkel, Scuba Diving, Shore Diving, and Free Diving Reviews, Reef Maps, and Photos
          </h3>
          <div>
            Zentacle encourages the use of reef safe sunscreen that doesn&apos;t contain oxybenzone and octinoxate. Learn&nbsp;more&nbsp;at&nbsp;<Link href="https://vimeo.com/442787740">Reefs at Risk</Link>.
          </div>
          <div>
            <div className={styles.popularSearchesTitle}>Popularly Searched Destinations</div>
            <div className={styles.popularSearches}>
              <Link href="https://www.zentacle.com/Beach/142/bahia-honda-state-park">Bahia Honda State Park</Link>
              <Link href="https://www.zentacle.com/Beach/300/devils-den">Devil&apos;s Den</Link>
              <Link href="https://www.zentacle.com/Beach/1251/possum-kingdom-lake">Possum Kingdom Lake</Link>
              <Link href="https://www.zentacle.com/Beach/84/tunnels-beach">Tunnels Beach</Link>
              <Link href="https://www.zentacle.com/Beach/407/homestead-crater">Homestead Crater</Link>
              <Link href="https://www.zentacle.com/Beach/1576/sharks-cove">Sharks Cove</Link>
              <Link href="https://www.zentacle.com/Beach/1645/wailea-beach">Wailea Beach</Link>
              <Link href="https://www.zentacle.com/Beach/109/alexander-springs">Alexander Springs</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;