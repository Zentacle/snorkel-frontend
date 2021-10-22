import React from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

import styles from './styles.module.css';
import { sendEvent } from 'hooks/amplitude';
import MaxWidth from 'components/MaxWidth';
import useGoogleButton from 'hooks/useGoogleButton';
import PrimaryButton from 'components/PrimaryButton';

const Banner = (props) => {
  const [email, setEmail] = React.useState('');
  const router = useRouter();

  React.useEffect(useGoogleButton('/', {}), [])

  const submitEmail = () => {
    sendEvent('bottom_banner_email');
    router.push('/register');
  }

  const submitCancel = () => {
    sendEvent('bottom_banner_skip');
    Cookies.set('has_seen_banner', true, { expires: 7 });
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
            <button onClick={submitCancel} className={styles.notNow}>Not now</button>
          </div>
        </div>
      </MaxWidth>
    </div>
  )
}

export default Banner;
