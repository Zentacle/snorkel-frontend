import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Layout from "components/Layout/Layout";
import BeachPage from "components/BeachPage/BeachPage";
import { rootDomain } from 'lib/constants';
import Head from 'next/head';

export async function getServerSideProps(context) {
    const beachid = context.params.beachid;
    const res = await fetch(`${rootDomain}/spots/get?beach_id=${beachid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await res.json()

    if (!data) {
        return {
            notFound: true,
        }
    }

    return {
        props: data.data, // will be passed to the page component as props
    }
}

const Beach = (props) => {
    const router = useRouter()
    const { beachid } = router.query

    const [beach, setBeach] = useState(props)

    useEffect(() => {
        if (!router.isReady) { return; }

        if (beach.notFound) {
            fetch(`${rootDomain}/spots/get?beach_id=${beachid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                return response.json();
            }).then(data => {
                setBeach(data.data);
            })
        }
    }, [router.isReady])

    return (
        <Layout>
            <Head>
                <meta property="og:title" content={`Zentacle - ${beach.name}`} key="title" />
                <meta property="og:description" content={ beach.description } key="description" />
                <meta property="og:image" content={ beach.hero_img } key="image" />
            </Head>
            <BeachPage beach={beach} beachid={beachid}></BeachPage>
        </Layout>
    )
}

export default Beach;