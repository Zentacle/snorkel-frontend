import Link from "next/link";
import React from 'react';

import Layout from "../Layout/Layout";
import BackgroundCard from "../Layout/BackgroundCard/BackgroundCard";
import styles from "../LoginPage/LoginPage.module.css";

const rootDomain = 'http://127.0.0.1:3000/api'

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

const LoginButton = ({ email, password }) => {
    return (
        <div className={styles.buttonwrapper}>
            <button onClick={loginUser(email, password)} className={styles.loginbutton}>
                Login
            </button>
        </div>
    )
}

const InputArea = ({ value, onChange, type }) => {
    return (
        <div className={styles.outerinput}>
            <input
                value={value}
                onChange={onChange}
                className={styles.inputs}
                placeholder={type}
                type={type}
            />
        </div>
    )
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
                <Title>
                </Title>
                <br />
                <br />
                <InputArea value={email} onChange={e => setEmail(e.target.value)} type="Email"></InputArea>
                <br />

                <InputArea value={password} onChange={e => setPassword(e.target.value)} type="Password"></InputArea>
                <br />
                <LoginButton email={email} password={password}></LoginButton>
                <br />
                <div className={styles.bottominfo}>
                    Don't have an account?&nbsp;
                    <Link href="/createaccount">
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