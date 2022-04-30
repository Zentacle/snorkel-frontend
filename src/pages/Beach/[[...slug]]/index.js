import { useEffect, useState } from 'react';
import Error from 'next/error'
import Cookies from 'js-cookie';

import { rootDomain } from 'lib/constants';
import { sendEvent } from 'hooks/amplitude';
import { useCurrentUser } from 'context/usercontext';
import BeachInfo from "components/BeachPage/BeachInfo/BeachInfo";
import BeachPageHero from 'components/BeachPageHero';
import BeachReviews from "components/BeachPage/BeachReviews/BeachReviews";
import Breadcrumbs from 'components/Breadcrumbs';
import Carousel from 'components/Carousel/Carousel';
import EmailBanner from 'components/EmailBanner';
import Head from 'next/head';
import Layout from "components/Layout/Layout";
import MaxWidth from 'components/MaxWidth';
import PhotoPreview from 'components/BeachPage/PhotoPreview';
import ReviewSummary from 'components/BeachPage/ReviewSummary';
import styles from "./styles.module.css";
import useGoogleOneTap from 'hooks/useGoogleOneTap';

export async function getStaticProps(context) {
    const startTime = Date.now();
    const beachid = context.params.slug[0];
    const beachNameFromURL = context.params.slug[1];

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

    // if (!beach_data.country) {
    //     fetch(`${rootDomain}/spot/geocode?id=${beachid}`)
    // }

    if (`/Beach/${beachid}/${beachNameFromURL}` != beach_data.data.url) {
        return {
            redirect: {
                destination: beach_data.data.url,
                permanent: true,
            }
        }
    }

    let response = await fetch(`${rootDomain}/reviews/get?beach_id=${beachid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const review_data = await response.json();

    let stationId = null;
    if (beach_data.data.noaa_station_id) {
        stationId = beach_data.data.noaa_station_id;
    }
    // else {
    //     if (beach_data.data.latitude) {
    //         try {
    //             response = await fetch(`https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/tidepredstations.json?lat=${beach_data.data.latitude}&lon=${beach_data.data.longitude}&radius=50`)
    //             console.log(`https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/tidepredstations.json?lat=${beach_data.data.latitude}&lon=${beach_data.data.longitude}&radius=50`)
    //             const stations_data = await response.json()
    //             if (stations_data.stationList && stations_data.stationList.length) {
    //                 stationId = stations_data.stationList[0].stationId
    //                 response = await fetch(`${rootDomain}/spot/setStationId`, {
    //                     method: 'POST',
    //                     body: JSON.stringify({
    //                         'spotId': beachid,
    //                         'stationId': stationId
    //                     }),
    //                     headers: {
    //                         'Content-Type': 'application/json'
    //                     }
    //                 })
    //             } else {
    //                 response = await fetch(`${rootDomain}/spot/setStationId`, {
    //                     method: 'POST',
    //                     body: JSON.stringify({
    //                         'spotId': beachid,
    //                         'stationId': '-1'
    //                     }),
    //                     headers: {
    //                         'Content-Type': 'application/json'
    //                     }
    //                 })
    //             }
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }
    // }

    let tides = []
    if (stationId && stationId !== '-1') {
        var currentDate = new Date();
        var begin_date = currentDate.toISOString().slice(0, 10).replace(/-/g, "");
        currentDate.setDate(currentDate.getDate() + 3);
        var end_date = currentDate.toISOString().slice(0, 10).replace(/-/g, "");
        response = await fetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&begin_date=${begin_date}&end_date=${end_date}&datum=MLLW&station=${stationId}&time_zone=GMT&units=english&interval=hilo&format=json&application=NOS.COOPS.TAC.TidePred`)
        const tideData = await response.json()
        if (tideData && tideData.predictions) {
            tides = tideData.predictions;
        }
    }

    const nearbyBeaches = await fetch(`${rootDomain}/spots/nearby?beach_id=${beachid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res =>
        res.json()
    ).then(beach_data => {
        if (beach_data.data) {
            return beach_data.data;
        } else {
            return [];
        }
    });

    if (!beach_data) {
        return {
            notFound: true,
        }
    }

    console.log(`beach_api_timing: ${Date.now() - startTime}ms, id: ${beachid}`)
    return {
        props: {
            'beach': beach_data.data,
            'reviews': review_data.data,
            'tides': tides,
            'nearbyBeaches': nearbyBeaches,
        }, // will be passed to the page component as props
        revalidate: 60,
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
    const [beach, setBeach] = useState(props.beach);
    const [nearbyBeaches, setNearbyBeaches] = useState(props.nearbyBeaches)
    const [isShown, setIsShown] = useState(false);
    const photoState = useState([]);

    let { state } = useCurrentUser();
    const currentUser = state.user;

    useEffect(() => {
        var ads = document.getElementsByClassName("adsbygoogle").length;
        for (var i = 0; i < ads; i++) {
            try {
                (adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) { }
        }
    }, [beach.id]);

    useEffect(() => {
        if (currentUser) {
            sendEvent('beach_view', {
                site_id: beach.id,
                site_name: beach.name,
            });
            sendEvent('page_view', {
                type: 'beach',
                site_id: beach.id,
                site_name: beach.name,
            });
        }
    }, [state, currentUser, beach.id, beach.name])

    useEffect(() => {
        if (!currentUser) {
            return;
        }
        if (!Cookies.get('has_seen_banner') && !currentUser.id) {
            setTimeout(() => setIsShown(true), 30000);
        }
    }, [currentUser])

    useEffect(useGoogleOneTap(beach.url, currentUser), [state])
    useEffect(() => setNearbyBeaches(props.nearbyBeaches), [props.nearbyBeaches])
    useEffect(() => setBeach(props.beach), [props.beach])

    if (props.errorCode) {
        return <Error statusCode={props.errorCode} />
    }

    let siteName = props.isShorediving
        ? 'ShoreDiving.com'
        : 'Zentacle'

    let canonicalURL = `https://www.zentacle.com${beach.url}`

    const description = beach.description
        ? `${beach.description} ${beach.name} is a ${Math.round(beach.rating * 100) / 100}-star rated scuba dive and snorkel site in ${beach.location_city}.`
        : `${beach.name} is a ${Math.round(beach.rating * 100) / 100}-star rated scuba dive and snorkel site in ${beach.location_city}.`

    const pageTitle = `${beach.name} in ${beach.location_city} | ${siteName} - Scuba Diving and Snorkel Reviews, Maps, and Photos`

    return (
        <Layout isShorediving={props.isShorediving}>
            <Head>
                <title key="title">{pageTitle}</title>
                <meta property="og:title" content={pageTitle} key="og-title" />
                <meta property="og:description" content={description} key="og-description" />
                <meta property="og:image" content={beach.hero_img} key="og-image" />
                <meta property="og:url" content={canonicalURL} key="og-url" />
                <meta name="description" content={description} key="description" />
                <link rel="canonical" href={canonicalURL} key="canonical" />
                {beach.hero_img && <link rel="preload" as="image" href={beach.hero_img} />}
            </Head>
            <MaxWidth>
                <div className={styles.ad} key={beach.id}>
                    <ins className="adsbygoogle"
                        style={{
                            display: 'block',
                            minWidth: '300px',
                            maxWidth: '970px',
                            width: '100%',
                            height: '90px',
                        }}
                        data-ad-client="ca-pub-7099980041278313"
                        data-ad-slot="9831586937"></ins>
                </div>
                <Breadcrumbs
                    country={beach.country}
                    area_one={beach.area_one}
                    area_two={beach.area_two}
                    locality={beach.locality}
                />
                <BeachPageHero beach={beach} photoState={photoState} />
                <div className={styles.container}>
                    <div className={styles.innerContainer}>
                        <BeachInfo
                            {...beach}
                            isSingularReview={props.isSingularReview}
                            tides={props.tides}
                            reviews={props.reviews}
                        />
                        <PhotoPreview
                            photoState={photoState}
                            beach={beach}
                        />
                        <ReviewSummary
                            ratings={beach.ratings}
                            rating={beach.rating}
                            num_reviews={beach.num_reviews}
                        />
                        <BeachReviews
                            beachid={beach.id}
                            url={beach.url}
                            reviews={props.reviews}
                            isSingularReview={props.isSingularReview}
                        />
                    </div>
                    {nearbyBeaches.length
                        ? <div className={styles.carouselSpacer}>
                            <div className={`${styles.ad} ${styles.adTop}`} key={beach.id}>
                                <ins className="adsbygoogle"
                                    style={{
                                        display: 'inline-block',
                                        width: '268px',
                                        height: '250px',
                                    }}
                                    data-ad-client="ca-pub-7099980041278313"
                                    data-ad-slot="9878800345"></ins>
                            </div>
                            <div className={styles.carouseltitle}>Other Locations Nearby</div>
                            <Carousel data={nearbyBeaches} allowVertical />
                            {
                                //<!-- below recommended -->
                            }
                            <div className={styles.ad} key={beach.id}>
                                <ins className="adsbygoogle"
                                    style={{ display: 'block' }}
                                    data-ad-client="ca-pub-7099980041278313"
                                    data-ad-slot="4115340371"
                                    data-ad-format="auto"
                                    data-full-width-responsive="true"></ins>
                            </div>
                            <div id="312754558">
                                <script
                                    type="text/javascript"
                                    dangerouslySetInnerHTML={{
                                        __html: `
                                        try {
                                            window._mNHandle.queue.push(function () {
                                                window._mNDetails.loadTag("312754558", "300x250", "312754558");
                                            });
                                        }
                                        catch (error) { }
                                    `
                                    }}
                                />
                            </div>
                        </div> : <></>
                    }
                </div>
            </MaxWidth>
            {isShown && <EmailBanner setIsShown={setIsShown} />}
        </Layout>
    )
}

export default Beach;
