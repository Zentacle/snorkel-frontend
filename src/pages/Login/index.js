import LoginPage from "../../components/LoginPage/LoginPage"
import Head from 'next/head';

export default function Login() {

    return (
        <>
            <Head>
                <meta
                    name="description"
                    content="Log in to your Zentacle account to view and rate your favorite scuba dive and snorkel locations"
                    key="description"
                />
                <meta
                    property="og:description"
                    content="Log in to your Zentacle account to view and rate your favorite scuba dive and snorkel locations"
                    key="og:description"
                />
            </Head>
            <LoginPage></LoginPage>
        </>
    )
}