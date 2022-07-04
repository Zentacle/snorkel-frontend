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
import useAppleButton from 'hooks/useAppleButton';

interface Props {
  isShown: boolean;
  setIsShown(isShown: boolean): void;
}

const Banner = (props: Props) => {
  const [email, setEmail] = React.useState('');
  const [path, setPath] = React.useState('');

  const router = useRouter();

  React.useEffect(() => {
    setPath(window.location.pathname)
  }, [])

  React.useEffect(() => {
    sendEvent('bottom_banner_view');
  }, [])

  React.useEffect(useGoogleButton('/', {}), [])
  React.useEffect(useAppleButton('/', {}), [])

  const clickApp = () => {
    sendEvent('bottom_banner_success', {
      'type': 'app',
    });
  }

  const submitEmail = () => {
    sendEvent('bottom_banner_success', {
      'type': 'email',
    });
    router.push('/register');
    props.setIsShown(false);
  }

  const submitCancel = (type: string) => {
    sendEvent('bottom_banner_skip', {
      type,
    });
    Cookies.set('last_closed_banner', `${Date.now()}`, { expires: 7 });
    props.setIsShown(false);
  }

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const browserImg = isSafari
    ? '/safari.png'
    : '/chrome.png'


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
              onMouseDown={() => sendEvent('bottom_banner_success', {
                'type': 'google',
              })}
            >
            </div>
            <div
              id="appleid-signin"
              data-color="black"
              data-border="true"
              data-type="sign in"
              className={styles.appleButton}
              onMouseDown={() => sendEvent('bottom_banner_success', {
                'type': 'apple',
              })}
            />
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
              <Link href={`https://zentacle.app.link?$deeplink_path=${path}&utm_medium=xpromo&utm_source=xpromo&campaign=app_selector`}>
                <a onClick={clickApp}>
                  Open
                </a>
              </Link>
            </div>
          </div>
          <div className={styles.app}>
            <div className={styles.icon}>
              <Image
                src={browserImg}
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

    const last_closed_banner = parseInt(Cookies.get('last_closed_banner') || '0');
    const yesterday = Date.now() - (1000 * 60 * 60 * 24)
    const did_close_in_last_day = last_closed_banner && last_closed_banner > yesterday
    const never_seen_banner = !last_closed_banner;
    const isLoggedOut = !currentUser.id;
    const shouldShowBanner = (never_seen_banner || !did_close_in_last_day) && isLoggedOut;
    if (shouldShowBanner) {
      setTimeout(() => setIsShown(true), 30000);
    } else {
      sendEvent('bottom_banner_suppress');
    }
  }, [currentUser])

  React.useEffect(() => {
    if (isShown) {
      document.body.classList.add(styles.modalOpen)
    } else {
      document.body.classList.remove(styles.modalOpen)
    }
  }, [isShown])

  return (
    <>
      {isShown && <Banner isShown={isShown} setIsShown={setIsShown} />}
    </>
  )
}

export default EmailBannerContainer;
