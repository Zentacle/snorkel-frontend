import Head from "next/head";
import React from "react";
import { useRouter } from "next/router";

import ReviewPage from "components/Reviews/ReviewPage/ReviewPage";
import Layout from "components/Layout/Layout";
import { rootDomain } from 'lib/constants';


const Review = () => {
    const router = useRouter()
    const { beachid } = router.query
    const [beach, setBeach] = React.useState({});
    React.useEffect(() => {
        if (!router.isReady) return;

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
    }, [router.isReady, beachid])

    return (
        <Layout>
            <Head>
                <title key="title">Leave a review for {beach.name}!</title>
                <meta property="og:title" content={`Leave a review for ${beach.name}`} key="og-title" />
                <link rel="canonical" href={`https://www.zentacle.com${beach.url}`} />
            </Head>
            <ReviewPage
                name={beach.name}
                url={beach.url}
                id={beach.id}
            />
        </Layout>
    )
}

export default Review;