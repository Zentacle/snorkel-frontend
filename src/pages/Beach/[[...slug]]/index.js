import { useEffect, useState } from 'react';
import Link from 'next/link';

import Layout from "components/Layout/Layout";
import BeachPage from "components/BeachPage/BeachPage";
import { rootDomain } from 'lib/constants';
import Head from 'next/head';
import { sendEvent } from 'hooks/amplitude';
import { useCurrentUser } from 'context/usercontext';
import useGoogleOneTap from 'hooks/useGoogleOneTap';
import { useRouter } from 'next/router';
import MaxWidth from 'components/MaxWidth';
import styles from './styles.module.css';

export async function getStaticProps(context) {
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
        revalidate: 600,
    }
}

export async function getStaticPaths() {
    const res = await fetch(`${rootDomain}/spots/get?limit=100&ssg=true`)
    const data = await res.json()
    return {
        paths: data.data.map(beach => ({
            params: {
                slug: [`${beach.id}`, beach.beach_name_for_url]
            }
        })),
        fallback: 'blocking',
    }
}

const Beach = (props) => {
    const [beach, setBeach] = useState(props.beach)

    const router = useRouter();

    useEffect(() => {
        sendEvent('beach_view', { site_id: beach.id });
    }, [])

    useEffect(() => {
        if (!router.isReady) { return }
        const beachid = router.query.slug[0];
        fetch(`${rootDomain}/spots/nearby?beach_id=${beachid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res =>
            res.json()
        ).then(beach_data => {
            //setNearbyBeaches([...beach_data.data])
        });
    }, [router.isReady, router.query.slug])

    const { state } = useCurrentUser();

    useEffect(useGoogleOneTap('/', state.user), [state])

    const [nearbyBeaches, setNearbyBeaches] = useState([])
    useEffect(() => setBeach(props.beach), [props.beach])

    return (
        <Layout>
            <Head>
                <title key="title">{`Zentacle - ${beach.name} - Scuba Diving and Snorkel Reviews, Maps, and Photos`}</title>
                <meta property="og:title" content={`Zentacle - ${beach.name} - Scuba Diving and Snorkel Reviews, Maps, and Photos`} key="og-title" />
                <meta property="og:description" content={`${beach.name} is a ${beach.rating}-star rated scuba dive and snorkel destination in ${beach.location_city}. ${beach.description}`} key="og-description" />
                <meta property="og:image" content={beach.hero_img} key="og-image" />
                <meta property="og:url" content={`https://www.zentacle.com${beach.url}`} key="og-url" />
                <meta name="description" content={`${beach.name} is a ${beach.rating}-star rated scuba dive and snorkel destination in ${beach.location_city}. ${beach.description}`} key="description" />
                <link rel="canonical" href={`https://www.zentacle.com${beach.url}`} />
                <link rel="preload" as="image" href={beach.hero_img} />
            </Head>
            <MaxWidth>
                {
                    beach.country_id && beach.area_one_id && beach.area_two_id && <div className={styles.locBreadcrumbContainer}>
                        <Link href={`/loc/${beach.country.short_name}`}>
                            <a className={styles.locBreadcrumb}>
                                {beach.country.name}
                            </a>
                        </Link>
                        <span className={styles.locBreadcrumb}>›</span>
                        <Link href={`/loc/${beach.country.short_name}/${beach.area_one.short_name}`}>
                            <a className={styles.locBreadcrumb}>
                                {beach.area_one.name}
                            </a>
                        </Link>
                        <span className={styles.locBreadcrumb}>›</span>
                        <Link href={`/loc/${beach.country.short_name}/${beach.area_one.short_name}/${beach.area_two.short_name}`}>
                            <a className={styles.locBreadcrumb}>
                                {beach.area_two.name}
                            </a>
                        </Link>
                    </div>
                }
                <BeachPage beach={beach} beachid={beach.id} reviews={props.reviews} nearbyBeaches={nearbyBeaches}></BeachPage>
            </MaxWidth>
        </Layout>
    )
}

export default Beach;