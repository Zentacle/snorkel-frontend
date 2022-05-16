import React from 'react';

import { rootDomain } from 'lib/constants';
import { PhotoPage } from "components/PhotoPage";

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

const ThePhotoPage = (props) => {
    const beachImages = props.beachImages.map(beachImage => (
        {
            source: beachImage.signedurl,
            alt: beachImage.caption || props.beach.name,
        }
    ))

    return (
        <PhotoPage beach={props.beach} beachImages={beachImages}></PhotoPage>
    )
}

export default ThePhotoPage;