import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Cookies from 'js-cookie';

import styles from './styles.module.css';
import { sendEvent } from 'hooks/amplitude';
import MaxWidth from 'components/MaxWidth';
import PrimaryButton from 'components/PrimaryButton';
import { useCurrentUser } from 'context/usercontext';
import useGoogleButton from 'hooks/useGoogleButton';

interface Props {
  isShown: boolean;
  setIsShown(isShown: boolean): void;
}

const Banner = (props: Props) => {
  const [email, setEmail] = React.useState('');
  const router = useRouter();

  React.useEffect(() => {
    sendEvent('bottom_banner_view');
  }, [])

  React.useEffect(useGoogleButton('/', {}), [])

  const clickApp = () => {
    sendEvent('bottom_banner_app');
  }

  const submitEmail = () => {
    sendEvent('bottom_banner_email');
    router.push('/register');
  }

  const submitCancel = (type: string) => {
    sendEvent('bottom_banner_skip', {
      type,
    });
    Cookies.set('has_seen_banner', 'true', { expires: 7 });
    props.setIsShown(false);
  }

  return (
    <div className={styles.overlay}>
      <MaxWidth>
        <div className={styles.container}>
          <div className={styles.title}>
            Sign up for a free account!
          </div>
          <div className={styles.subtitle}>
            Leave reviews, save your favorite spots, and&nbsp;more
          </div>
          <div className={styles.formContainer}>
            <div
              id="google_button"
              className={styles.googleButton}
            >
            </div>
            <div className={styles.orSpacer}>
              OR
            </div>
            <div className={styles.spacer}>
              <input value={email} onChange={e => setEmail(e.target.value)} className={styles.input} placeholder='Email' />
            </div>
            <PrimaryButton className={styles.emailSubmit} type="submit" onClick={submitEmail}>
              Submit
            </PrimaryButton>
          </div>
          <div className={styles.center}>
            <button onClick={() => submitCancel('email')} className={styles.notNow}>Not now</button>
          </div>
        </div>
        <div className={styles.mobileContainer}>
          <div className={styles.top}>See this page in...</div>
          <div className={styles.appRow}>
            <div className={styles.app}>
              <div className={styles.icon}>
                <Image
                  src='/logo.png'
                  height='44'
                  width='44'
                />
              </div>
              <div className={styles.appName}>
                Zentacle App
              </div>
            </div>
            <div className={`${styles.button} ${styles.active}`}>
              <Link href='https://zentacle.app.link?utm_medium=xpromo&utm_source=xpromo&campaign=app_selector'>
                <a onClick={clickApp}>
                  Open
                </a>
              </Link>
            </div>
          </div>
          <div className={styles.app}>
            <div className={styles.icon}>
              <Image
                src='/safari.png'
                height='44'
                width='44'
              />
            </div>
            <div className={styles.appName}>
              Browser
            </div>
            <div className={styles.button} onClick={() => submitCancel('app')}>
              Continue
            </div>
          </div>
        </div>
      </MaxWidth>
    </div>
  )
}

const EmailBannerContainer = () => {
  const [isShown, setIsShown] = React.useState(false);
  let { state } = useCurrentUser();
  const currentUser = state.user;

  React.useEffect(() => {
    if (!currentUser) {
      return;
    }

    if (!Cookies.get('has_seen_banner') && !currentUser.id) {
      setTimeout(() => setIsShown(true), 30000);
    }
  }, [currentUser])

  return (
    <>
      {isShown && <Banner isShown={isShown} setIsShown={setIsShown} />}
    </>
  )
}

export default EmailBannerContainer;
