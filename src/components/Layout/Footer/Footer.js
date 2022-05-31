import React from 'react';
import Image from 'next/image';

import Rating from "react-rating";
import { EmptyStar, FullStar } from "components/StarRating";
import styles from "./Footer.module.css";
import Link from 'next/link';

const Footer = () => {
  const onClick = () => {
    ga.event({
      action: "add_to_cart",
      params: {
        eventLabel: 'iOS App',
        items: [{
          item_list_name: `Footer - ${window.location.url}`,
          item_name: 'iOS App',
          item_category: 'iOS App',
        }]
      }
    })
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.emailContainer}>
        <div className={styles.emailTitle}>
          Get the Zentacle app!
        </div>
        <div className={styles.emailSubtitle}>
          Full dive log with 15k+ locations, reviews, and photos
        </div>
        <div className={styles.emailSubtitle}>
          <span className={styles.emailSubtitleText}>
            5.0
          </span>
          <Rating
            fractions={2}
            emptySymbol={(<EmptyStar />)}
            fullSymbol={(<FullStar />)}
            initialRating={5}
            readonly>
          </Rating></div>
        <Link href="https://zentacle.app.link?utm_medium=xpromo&utm_source=xpromo&campaign=footer">
          <a onClick={onClick}>
            <Image
              src="/app_store_badge.png"
              height="44"
              width="150"
            />
          </a>
        </Link>
      </div>
      <div className={styles.footerLinksContainer}>
        <div className={styles.leftColumn}>
          <div className={styles.logoContainer}>
            <Image src='/logo.png' height='32' width='32' alt="logo" />
            <span className={styles.headertitle}>Zentacle</span>
          </div>
          <div className={styles.footerLinkContainer}>
            <Link href='/directory' prefetch={false}><a className={styles.footerLink}>Dive Spot Directory</a></Link>
            <Link href='/directory/loc' prefetch={false}><a className={styles.footerLink}>Region Directory</a></Link>
            <Link href='/add/spot' prefetch={false}><a className={styles.footerLink}>Add a new location</a></Link>
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
              <Link href="https://www.zentacle.com/Beach/142/bahia-honda-state-park" prefetch={false}>Bahia Honda State Park</Link>
              <Link href="https://www.zentacle.com/Beach/300/devils-den" prefetch={false}>Devil&apos;s Den</Link>
              <Link href="https://www.zentacle.com/Beach/1251/possum-kingdom-lake" prefetch={false}>Possum Kingdom Lake</Link>
              <Link href="https://www.zentacle.com/Beach/84/tunnels-beach" prefetch={false}>Tunnels Beach</Link>
              <Link href="https://www.zentacle.com/Beach/407/homestead-crater" prefetch={false}>Homestead Crater</Link>
              <Link href="https://www.zentacle.com/Beach/1576/sharks-cove" prefetch={false}>Sharks Cove</Link>
              <Link href="https://www.zentacle.com/Beach/1645/wailea-beach" prefetch={false}>Wailea Beach</Link>
              <Link href="https://www.zentacle.com/Beach/109/alexander-springs" prefetch={false}>Alexander Springs</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;