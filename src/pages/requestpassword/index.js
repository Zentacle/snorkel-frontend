import React, { useEffect } from 'react';
import Link from "next/link";
import { toaster } from 'evergreen-ui';

import styles from "components/LoginPage/LoginPage.module.css";
//uses borrowed styling
import Layout from "components/Layout/Layout";
import BackgroundCard from "components/Layout/BackgroundCard/BackgroundCard";
import SignupInput from 'components/SignupInput';
import PrimaryButton from 'components/PrimaryButton';
import { clientSideDomain } from 'lib/constants';
import { sendEvent } from 'hooks/amplitude';

const ResetPassword = () => {
  const [email, setEmail] = React.useState('')

  const requestPassword = () => {
    const body = {
      email,
    }
    fetch(`${clientSideDomain}/password/request`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      response.json().then(data => {
        if (response.ok) {
          sendEvent('request_password_success');
          toaster.success(data.msg);
        } else {
          sendEvent('request_password_error');
          toaster.danger(data.msg);
        }
      })
    })
  }

  useEffect(() => {
    sendEvent('request_password_begin');
  }, [])

  return (
    <Layout>
      <BackgroundCard>
        <div className={styles.titlecontainer}>
          Request a password reset for your account
        </div>
        <form onSubmit={e => { e.preventDefault(); }}>
          <SignupInput value={email} onChange={setEmail} id='email-input' type="email"></SignupInput>
          <PrimaryButton onClick={requestPassword}>Rest Password Reset</PrimaryButton>
        </form>
      </BackgroundCard>
    </Layout>
  )
}

export default ResetPassword;