import React from 'react';
import { Pane, Dialog, toaster } from 'evergreen-ui';
import Link from 'next/link';

import styles from './styles.module.css';
import { sendEvent } from 'hooks/amplitude';
import Cookies from 'js-cookie';
import { rootDomain } from 'lib/constants';

const Banner = (props) => {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [diveRegion, setDiveRegion] = React.useState('');
  const [isShown, setIsShown] = React.useState(props.isShown)

  const submitEmail = () => {
    const body = {
      email,
      'first_name': firstName,
      'last_name': lastName,
    }
    fetch(`${rootDomain}/user/register`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      response.json().then(data => {
        if (response.ok) {
          if (data.auth_token) {
            Cookies.set('has_seen_banner', true, { expires: 7 });
            setIsShown(false);
            sendEvent('partial_register_success', { 'dive_location': diveRegion });
            window.location.href = "/";
          } else {
            sendEvent('partial_register_error');
          }
        } else {
          sendEvent('partial_register_error');
          toaster.danger(data.msg);
        }
      })
    })
  }

  const submitCancel = () => {
    sendEvent('partial_register_skip');
    Cookies.set('has_seen_banner', true, { expires: 7 });
    setIsShown(false);
  }

  return (
    <Pane>
      <Dialog
        isShown={isShown}
        title='Zentacle is currently in testing in the Maui region and we need your help!'
        cancelLabel='Skip'
        onConfirm={submitEmail}
        onCancel={submitCancel}
      >
        <div className={styles.subtitle}>
          If you love scuba/snorkeling, sign up to get early access, be notified of new features, and give feedback. I would really appreciate your support!
        </div>
        <div className={styles.formContainer}>
          <div className={styles.spacer}>
            <div className={styles.formLabel}>First Name</div>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} className={styles.input} placeholder='First Name' />
          </div>
          <div className={styles.spacer}>
            <div className={styles.formLabel}>Last Name</div>
            <input value={lastName} onChange={e => setLastName(e.target.value)} className={styles.input} placeholder='Last Name' />
          </div>
          <div className={styles.spacer}>
            <div className={styles.formLabel}>Email</div>
            <input value={email} onChange={e => setEmail(e.target.value)} className={styles.input} placeholder='Email' />
          </div>
          <div className={styles.spacer}>
            <div className={styles.formLabel}>Favorite Dive Region</div>
            <input value={diveRegion} onChange={e => setDiveRegion(e.target.value)} className={styles.input} placeholder='Favorite dive region' />
          </div>
        </div>
        <div className={styles.bottominfo}>
          Already have an account?&nbsp;
          <Link href="/login">
            <a className={styles.createone}>
              Login!
            </a>
          </Link>
        </div>
      </Dialog>
    </Pane >
  )
}

export default Banner;
