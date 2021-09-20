import { useEffect, useState } from 'react';
import Error from 'next/error'

import Layout from "components/Layout/Layout";
import BeachPage from "components/BeachPage/BeachPage";
import { rootDomain } from 'lib/constants';
import Head from 'next/head';
import { sendEvent } from 'hooks/amplitude';
import { useCurrentUser } from 'context/usercontext';
import useGoogleOneTap from 'hooks/useGoogleOneTap';
import { useRouter } from 'next/router';
import MaxWidth from 'components/MaxWidth';
import Breadcrumbs from 'components/Breadcrumbs';

export async function getStaticProps(context) {
    const startTime = Date.now();
    const beachid = context.params.slug[0];
    const res = await fetch(`${rootDomain}/spots/get?beach_id=${beachid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (res.status == 404) {
        return {
            props: {
                errorCode: 404,
            }
        }
    }
    const beach_data = await res.json()

    let response = await fetch(`${rootDomain}/review/get?beach_id=${beachid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const review_data = await response.json();

    let stationData = null;
    if (beach_data.data.latitude) {
        response = await fetch(`https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/tidepredstations.json?lat=${beach_data.data.latitude}&lon=${beach_data.data.longitude}&radius=50`)
        console.log(`https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/tidepredstations.json?lat=${beach_data.data.latitude}&lon=${beach_data.data.longitude}&radius=50`)
        const stations_data = await response.json()
        if (stations_data.stationList && stations_data.stationList.length) {
            stationData = stations_data.stationList[0]
        }
    }

    let tides = []
    if (stationData && stationData.stationId) {
        var currentDate = new Date();
        var begin_date = currentDate.toISOString().slice(0,10).replace(/-/g,"");
        currentDate.setDate(currentDate.getDate() + 3); 
        var end_date = currentDate.toISOString().slice(0,10).replace(/-/g,"");
        response = await fetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&begin_date=${begin_date}&end_date=${end_date}&datum=MLLW&station=${stationData.stationId}&time_zone=GMT&units=english&interval=hilo&format=json&application=NOS.COOPS.TAC.TidePred`)
        const tideData = await response.json()
        if (tideData && tideData.predictions) {
            tides = tideData.predictions;
        }   
    }

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
            'tides': tides,
            'stationData': stationData,
        }, // will be passed to the page component as props
        revalidate: 3600,
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
        const beachid = props.beach.id;
        fetch(`${rootDomain}/spots/nearby?beach_id=${beachid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res =>
            res.json()
        ).then(beach_data => {
            if (beach_data.data) {
                setNearbyBeaches([...beach_data.data])
            }
        });
    }, [router.isReady, router.query.slug])

    const { state } = useCurrentUser();

    useEffect(useGoogleOneTap('/', state.user), [state])

    const [nearbyBeaches, setNearbyBeaches] = useState([])
    useEffect(() => setBeach(props.beach), [props.beach])

    if (props.errorCode) {
        return <Error statusCode={props.errorCode}/>
    }

    let siteName = props.isShorediving
        ? 'ShoreDiving.com'
        : 'Zentacle'

    let canonicalURL = props.isShorediving
        ? `https://www.zentacle.com${beach.url}`
        : `https://www.shorediving.com${beach.sd_url}`

    return (
        <Layout isShorediving={props.isShorediving}>
            <Head>
                <title key="title">{`${siteName} - ${beach.name} - Scuba Diving and Snorkel Reviews, Maps, and Photos`}</title>
                <meta property="og:title" content={`${siteName} - ${beach.name} - Scuba Diving and Snorkel Reviews, Maps, and Photos`} key="og-title" />
                <meta property="og:description" content={`${beach.name} is a ${beach.rating}-star rated scuba dive and snorkel destination in ${beach.location_city}. ${beach.description}`} key="og-description" />
                <meta property="og:image" content={beach.hero_img} key="og-image" />
                <meta property="og:url" content={canonicalURL} key="og-url" />
                <meta name="description" content={`${beach.name} is a ${beach.rating}-star rated scuba dive and snorkel destination in ${beach.location_city}. ${beach.description}`} key="description" />
                <link rel="canonical" href={canonicalURL} key="canonical"/>
                <link rel="preload" as="image" href={beach.hero_img} />
            </Head>
            <MaxWidth>
                <Breadcrumbs
                    country={beach.country}
                    area_one={beach.area_one}
                    area_two={beach.area_two}
                />
                <BeachPage
                    beach={beach}
                    beachid={beach.id}
                    reviews={props.reviews}
                    nearbyBeaches={nearbyBeaches}
                    tides={props.tides}
                    stationData={props.stationData}
                />
            </MaxWidth>
        </Layout>
    )
}

export default Beach;