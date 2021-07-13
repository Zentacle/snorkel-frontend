import Link from "next/link";
import React from 'react';
import { useRouter } from 'next/router';

import Layout from "../Layout/Layout";
import BackgroundCard from "../Layout/BackgroundCard/BackgroundCard";
import styles from "../LoginPage/LoginPage.module.css";
import SignupInput from 'components/SignupInput';
import PrimaryButton from 'components/PrimaryButton';
import { rootDomain } from 'lib/constants';
import { useCurrentUser } from '../../context/usercontext'
import router from "next/router";

const Title = () => {
    return (
        <div className={styles.titlecontainer}>
            Login to your account
        </div>
        
    )
}

const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('')
    const {dispatch} = useCurrentUser()
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
        }).then(({data, user}) => {
            if (data.auth_token) {
                router.push('/')
            }
            dispatch(user);
        })
    }
 
   
    return (
        <Layout>
            <BackgroundCard>
                <Title></Title>
                <SignupInput value={email} onChange={ setEmail } type="Email"></SignupInput>
                <SignupInput value={password} onChange={ setPassword } type="Password"></SignupInput>
                <PrimaryButton onClick={ loginUser(email, password) }>Log In</PrimaryButton>
                <div className={styles.bottominfo}>
                    Don&apos;t have an account?&nbsp;
                    <Link href="/register">
                        <a className={styles.createone}>
                            Create one!
                        </a>
                    </Link>
                </div>
            </BackgroundCard>
        </Layout>
    )
}

export default LoginPage;