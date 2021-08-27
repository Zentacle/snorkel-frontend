import React, { useEffect } from 'react';
import Link from "next/link";
import { toaster } from 'evergreen-ui';

import styles from "../LoginPage/LoginPage.module.css";
//uses borrowed styling
import Layout from "../Layout/Layout";
import BackgroundCard from "../Layout/BackgroundCard/BackgroundCard";
import SignupInput from 'components/SignupInput';
import PrimaryButton from 'components/PrimaryButton';
import { rootDomain } from 'lib/constants';
import { sendEvent } from 'hooks/amplitude';
import useGoogleButton from 'hooks/useGoogleButton';
import * as ga from 'lib/ga';

const CreateAccount = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('')
    const [firstName, setFirstName] = React.useState('')
    const [lastName, setLastName] = React.useState('')
    const [username, setUsername] = React.useState('')

    const registerUser = () => {
        const body = {
            email,
            password,
            'first_name': firstName,
            'last_name': lastName,
            username,
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
                        ga.event({
                            action: "signup",
                        })
                        sendEvent('register_success');
                        window.location.href = "/";
                    } else {
                        sendEvent('register_error');
                    }
                } else {
                    sendEvent('register_error');
                    toaster.danger(data.msg);
                }
            })
        })
    }

    useEffect(() => {
        sendEvent('register_begin');
    }, [])

    useEffect(useGoogleButton('/', {}), [])

    return (
        <Layout>
            <BackgroundCard>
                <h1 className={styles.titlecontainer}>
                    Create your Free account
                </h1>
                <div
                    id="google_button"
                    className={styles.googleButton}
                >
                </div>
                <div className={styles.orSeparator}>OR</div>
                <form onSubmit={ e => {e.preventDefault();}}>
                    <SignupInput value={firstName} onChange={ setFirstName } id='first-name-input' type="First Name"></SignupInput>
                    <SignupInput value={lastName} onChange={ setLastName } id='last-name-input' type="Last Name"></SignupInput>
                    <SignupInput value={username} onChange={ setUsername} id='username-input' type="Username"></SignupInput>
                    <SignupInput value={email} onChange={ setEmail } id='email-input' type="Email"></SignupInput>
                    <SignupInput value={password} onChange={ setPassword } id='password-input' type="Password"></SignupInput>
                    <PrimaryButton onClick={ registerUser }>Create Account</PrimaryButton>
                </form>
                <div className={styles.bottominfo}>
                    Already have an account?&nbsp;
                    <Link href="/Login">
                        <a className={styles.createone}>
                            Login!
                        </a>
                    </Link>
                </div>
            </BackgroundCard>
        </Layout>
    )
}

export default CreateAccount;