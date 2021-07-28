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
    const [name, setName] = React.useState('')
    const [username, setUsername] = React.useState('')

    const registerUser = (email, password, name, username) => () => {
        const body = {
            email,
            password,
            'display_name': name,
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

    return (
        <Layout>
            <BackgroundCard>
                <div className={styles.titlecontainer}>
                    Create your Free account
                </div>
                <form onSubmit={ e => {e.preventDefault();}}>
                    <SignupInput value={name} onChange={ setName } id='name-input' type="Name"></SignupInput>
                    <SignupInput value={username} onChange={ setUsername} id='username-input' type="Username"></SignupInput>
                    <SignupInput value={email} onChange={ setEmail } id='email-input' type="Email"></SignupInput>
                    <SignupInput value={password} onChange={ setPassword } id='passowrd-input' type="Password"></SignupInput>
                    <PrimaryButton onClick={ registerUser(email, password, name, username) }>Create Account</PrimaryButton>
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