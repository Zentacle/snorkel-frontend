import CreateAccount from "components/CreateAccount/CreateAccount"
import Head from 'next/head';

export default function createaccount() {
    return (
        <>
            <Head>
                <meta
                    name="description"
                    content="Sign up for a Zentacle account to view and rate your favorite scuba dive and snorkel locations"
                    key="description"
                />
                <meta
                    property="og:description"
                    content="Sign up for a Zentacle account to view and rate your favorite scuba dive and snorkel locations"
                    key="og:description"
                />
            </Head>
            <CreateAccount></CreateAccount>
        </>
    )
}