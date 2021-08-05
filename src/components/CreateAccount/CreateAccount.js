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

    const initializeGSI = () => {
        google.accounts.id.initialize({
            client_id: '609299692665-bl3secuu5i4v1iumjm0kje0db1lge1ec.apps.googleusercontent.com',
        });
        google.accounts.id.prompt(notification => {
            if (notification.isNotDisplayed()) {
                console.log(notification.getNotDisplayedReason())
            } else if (notification.isSkippedMoment()) {
                console.log(notification.getSkippedReason())
            } else if(notification.isDismissedMoment()) {
                console.log(notification.getDismissedReason())
            }
            console.log(notification)
            fetch(`${rootDomain}/register/google_register`, {
                method: 'POST',
                body: notification,
            })
        });
     }

    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.onload = initializeGSI()
        script.async = true;
        document.querySelector('body').appendChild(script)
    }, [])

    return (
        <Layout>
            <BackgroundCard>
                <div className={styles.titlecontainer}>
                    Create your Free account
                </div>
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