import Link from "next/link";
import React from 'react';

import Layout from "../Layout/Layout";
import BackgroundCard from "../Layout/BackgroundCard/BackgroundCard";
import styles from "../LoginPage/LoginPage.module.css";
import SignupInput from 'components/SignupInput';
import PrimaryButton from 'components/PrimaryButton';
import { rootDomain } from 'constants';

const loginUser = (email, password) => () => {
    const body = {
        email,
        password,
    }
    fetch(`${rootDomain}/user/login`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        return response.json()
    }).then(data => {
        if (data.auth_token) {
            window.location.href = "/";
        }
    })
}

const Title = () => {
    return (
        <div className={styles.titlecontainer}>
            Login to your account
        </div>
    )
}

const LoginPage = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('')

    return (
        <Layout>
            <BackgroundCard>
                <Title></Title>
                <SignupInput value={email} onChange={ setEmail } type="Email"></SignupInput>
                <SignupInput value={password} onChange={ setPassword } type="Password"></SignupInput>
                <PrimaryButton onClick={ () => loginUser(email, password) }>Log In</PrimaryButton>
                <div className={styles.bottominfo}>
                    Don't have an account?&nbsp;
                    <Link href="/register">
                        <span className={styles.createone}>
                            Create one!
                        </span>
                    </Link>
                </div>
            </BackgroundCard>
        </Layout>
    )
}

export default LoginPage;