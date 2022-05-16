import React from 'react';
import Link from 'next/link';

import styles from './styles.module.css';
import { rootDomain } from 'lib/constants';
import Head from "next/head";
import Layout from "components/Layout/Layout";
import BeachPageHero from "components/BeachPageHero";
import PhotoGrid from "components/PhotoGrid";
import MaxWidth from 'components/MaxWidth';

export async function getServerSideProps(context) {
    const beach_id = context.query.beachid;
    const beach = await fetch(`${rootDomain}/spots/get?beach_id=${beach_id}`)
        .then(response => {
            return response.json();
        }).then(data => {
            return data.data;
        })

    const beachImages = await fetch(`${rootDomain}/beachimages?beach_id=${beach_id}`)
        .then(response => {
            return response.json();
        }).then(data => {
            return data.data;
        })

    return {
        props: { beach, beachImages }, // will be passed to the page component as props
    }
}

const PhotoPage = (props) => {
    const {
        hero_img,
        name,
        location_city,
        description,
        url,
    } = props.beach;

    const beachImages = props.beachImages.map(beachImage => (
        {
            source: beachImage.signedurl,
            alt: beachImage.caption || props.beach.name,
        }
    ))

    const pageTitle = `Photos of ${name} in ${location_city} | Zentacle`

    return (
        <Layout>
            <Head>
                <title key="title">{pageTitle}</title>
                <meta property="og:title" content={pageTitle} key="og-title" />
                <meta property="og:description" content={description} key="og-description" />
                <meta property="og:image" content={hero_img} key="og-image" />
                <meta name="description" content={description} key="description" />
                <script async defer data-pin-hover="true" src="//assets.pinterest.com/js/pinit.js"></script>
            </Head>
            <MaxWidth>
                <BeachPageHero beach={props.beach} />
                <Link href={url}>
                    <a className={styles.backTo}>
                        <svg className={styles.backIcon} width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.13069 12.7147L1.61035 7.00042L7.13069 1.28613" stroke="#0B0B0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        Back to site details
                    </a>
                </Link>
                <PhotoGrid
                    beachImages={beachImages}
                />
            </MaxWidth>
        </Layout>
    )
}

export default PhotoPage;