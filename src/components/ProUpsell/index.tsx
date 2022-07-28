import React from 'react';
import Image from 'next/image';

import styles from './styles.module.css';
import { PrimaryLink } from 'components/PrimaryButton';

export default function ProUpsell() {
  return (
    <div className={styles.overlay}>
      <div className={styles.outerContainer}>
        <div className={styles.heroImg}>
          <Image src={'/default_hero_background.png'} layout='fill' objectFit='cover' />
        </div>
        <div className={styles.content}>
          <div className={styles.headline}>Your first week&apos;s on us</div>
          <div className={styles.subtitle}>Get 1 week free, then only $5/month.</div>
          <div className={styles.headerRow}>
            <div className={styles.headerItem}>Features</div>
            <div className={styles.headerSection}>
              <div className={styles.headerItem}>Free</div>
              <div className={`${styles.headerItem} ${styles.proItem}`}>Pro</div>
            </div>
          </div>
          <div>
            <div className={styles.featureRow}>
              Log Dives Manually
              <div className={styles.checkContainer}>
                <div className={styles.check}>X</div>
                <div className={styles.check}>X</div>
              </div>
            </div>
            <div className={styles.featureRow}>
              Research 11k+ dive sites
              <div className={styles.checkContainer}>
                <div className={styles.check}>X</div>
                <div className={styles.check}>X</div>
              </div>
            </div>
            <div className={styles.featureRow}>
              Find nearby dive buddies
              <div className={styles.checkContainer}>
                <div className={styles.check}>X</div>
                <div className={styles.check}>X</div>
              </div>
            </div>
            <div className={styles.featureRow}>
              Unlimited photo uploads
              <div className={styles.checkContainer}>
                <div className={styles.check}>X</div>
                <div className={styles.check}>X</div>
              </div>
            </div>
            <div className={styles.featureRow}>
              Keep dive logs private
              <div className={styles.checkContainer}>
                <div className={styles.check}>X</div>
                <div className={styles.check}>X</div>
              </div>
            </div>
            <div className={styles.featureRow}>
              Download offline details
              <div className={styles.checkContainer}>
                <div className={styles.check}>X</div>
                <div className={styles.check}>X</div>
              </div>
            </div>
          </div>
          <PrimaryLink href='https://buy.stripe.com/00gcPhf2Octp3nOaEE'>Start trial</PrimaryLink>
          <div className={styles.disclaimer}>Cancel anytime. We&apos;ll send you a reminder one day before your trial ends</div>
        </div>
      </div>
    </div>
  );
}
