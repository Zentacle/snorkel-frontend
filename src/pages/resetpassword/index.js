import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
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
    const router = useRouter();
    const [password, setPassword] = React.useState('')
    const [token, setToken] = React.useState('')

    const resetPassword = () => {
        const body = {
            password,
            token,
        }
        fetch(`${clientSideDomain}/password/reset`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            response.json().then(data => {
                if (response.ok) {
                    if (data.auth_token) {
                        sendEvent('reset_password_success');
                        toaster.success(data.msg);
                        window.location.href = "/";
                    } else {
                        sendEvent('reset_password_error');
                    }
                } else {
                    sendEvent('reset_password_error');
                    toaster.danger(data.msg);
                }
            })
        })
    }

    useEffect(() => {
        sendEvent('reset_password_begin');
    }, [])

    useEffect(() => {
      const { token } = router.query
      setToken(token)
    }, [router.isReady])

    return (
        <Layout>
            <BackgroundCard>
                <div className={styles.titlecontainer}>
                    Set a new password for your account
                </div>
                <form onSubmit={ e => {e.preventDefault();}}>
                    <SignupInput value={password} onChange={ setPassword } id='password-input' type="Password"></SignupInput>
                    <PrimaryButton onClick={ resetPassword }>Update Password</PrimaryButton>
                </form>
            </BackgroundCard>
        </Layout>
    )
}

export default ResetPassword;