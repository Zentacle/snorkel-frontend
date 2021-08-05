import { useEffect, useState } from 'react';

import Layout from "components/Layout/Layout";
import BeachPage from "components/BeachPage/BeachPage";
import { rootDomain } from 'lib/constants';
import Head from 'next/head';
import { sendEvent } from 'hooks/amplitude';
import { useCurrentUser } from 'context/usercontext';

export async function getServerSideProps(context) {
    const startTime = Date.now();
    const beachid = context.params.slug[0];
    const res = await fetch(`${rootDomain}/spots/get?beach_id=${beachid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const beach_data = await res.json()

    const response = await fetch(`${rootDomain}/review/get?beach_id=${beachid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const review_data = await response.json();

    if (!beach_data) {
        return {
            notFound: true,
        }
    }

    console.log(`beach_api_timing: ${Date.now() - startTime}ms`)
    return {
        props: {
            'beach': beach_data.data,
            'reviews': review_data.data,
        }, // will be passed to the page component as props
    }
}

const Beach = (props) => {
    const [beach, setBeach] = useState(props.beach)

    useEffect(() => {
        sendEvent('beach_view', { site_id: beach.id });
    }, [])

    const { state } = useCurrentUser();

    useEffect(() => {
        if (state.user && state.user.id) { return }
        const handleLogin = (response) => {
            if (response.credential) {
                sendEvent('google_register_success');
                fetch(`${rootDomain}/user/google_register`, {
                    method: 'POST',
                    body: JSON.stringify(response),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(() => {
                    window.location.reload()
                })
            } else {
                sendEvent('google_register_error');
            }
        }

        const initializeGSI = () => {
            if (google) {
                google.accounts.id.initialize({
                    client_id: '609299692665-bl3secuu5i4v1iumjm0kje0db1lge1ec.apps.googleusercontent.com',
                    callback: handleLogin,
                });
                google.accounts.id.prompt(notification => {
                    if (notification.isNotDisplayed()) {
                        console.log(notification.getNotDisplayedReason())
                    } else if (notification.isSkippedMoment()) {
                        console.log(notification.getSkippedReason())
                    } else if (notification.isDismissedMoment()) {
                        console.log(notification.getDismissedReason())
                    }
                });
            }
        }
        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.onload = setTimeout(initializeGSI, 3000)
        script.async = true;
        document.querySelector('body').appendChild(script)
    }, [])

    return (
        <Layout>
            <Head>
                <title key="title">{`Zentacle - ${beach.name}`}</title>
                <meta property="og:title" content={`Zentacle - ${beach.name} - Scuba and Snorkel reviews`} key="og-title" />
                <meta property="og:description" content={beach.description} key="og-description" />
                <meta property="og:image" content={beach.hero_img} key="og-image" />
                <meta name="description" content={`${beach.name} is a ${beach.rating}-star rated scuba dive and snorkel destination in ${beach.location_city}`} key="description" />
                <link rel="canonical" href={`https://www.zentacle.com${beach.url}`} />
                <link rel="preload" as="image" href={beach.hero_img} />
            </Head>
            <BeachPage beach={beach} beachid={beach.id} reviews={props.reviews}></BeachPage>
        </Layout>
    )
}

export default Beach;