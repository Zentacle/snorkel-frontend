import Cookies from 'js-cookie'
import React, { useEffect } from 'react';
import { toaster } from 'evergreen-ui';

import styles from "components/LoginPage/LoginPage.module.css";
//uses borrowed styling
import Layout from "components/Layout/Layout";
import BackgroundCard from "components/Layout/BackgroundCard/BackgroundCard";
import SignupInput from 'components/SignupInput';
import PrimaryButton from 'components/PrimaryButton';
import { clientSideDomain } from 'lib/constants';

const CreateAccount = (props) => {
  const [username, setUsername] = React.useState('')

  const patchUser = () => {
    const body = {
      username,
    }
    fetch(`${clientSideDomain}/user/patch`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': Cookies.get('csrf_access_token'),
      }
    }).then(response => {
      response.json().then(data => {
        if (response.ok) {
          window.location.href = "/";
        } else {
          toaster.danger(data.msg);
        }
      })
    })
  }

  return (
    <Layout>
      <BackgroundCard>
        <h1 className={styles.titlecontainer}>
          Set up your profile by choosing a username!
        </h1>
        <form onSubmit={e => { e.preventDefault(); }}>
          <SignupInput value={username} onChange={setUsername} id='username-input' type="Username"></SignupInput>
          <PrimaryButton onClick={patchUser}>Set Username</PrimaryButton>
        </form>
      </BackgroundCard>
    </Layout>
  )
}

export default CreateAccount;