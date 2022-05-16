import styles from "components/PhotoPage/PhotoPage.module.css"
import Layout from "components/Layout/Layout";
import BackgroundImageOnly from "components/BeachPage/BackgroundImage";
import { ReactPhotoCollage } from "react-photo-collage";
import React from "react";
import Head from "next/head";

const PhotoGrid = ({ beachImages }) => {
    //this is the array that will be used as the settings for the collage
    const [photosArray, setPhotosArray] = React.useState(beachImages);

    let layoutArray = [];
    let heightArray = [];
    let photoslen = photosArray.length;
    if (photoslen > 0) {
        layoutArray.push(2)
        heightArray.push('250px')
    }
    if (photoslen > 4) {
        layoutArray.push(4)
        heightArray.push('200px')
    }
    if (photoslen > 8) {
        layoutArray.push(3)
        heightArray.push('200px')
    }
    if (photoslen > 14) {
        layoutArray.push(5)
        heightArray.push('150px')
    }
    if (photoslen > 20) {
        layoutArray.push(2);
        heightArray.push('200px')

    }
    if (photoslen > 25) {
        heightArray = ['250px', '200px', '200px', '150px', '200px', '250px', '100px']
        layoutArray = [2, 4, 3, 5, 2, 1, 3]
    }
    let width = '600px';

    let setting = {
        width: width,
        height: heightArray,
        layout: layoutArray,
        photos: photosArray,
        showNumOfRemainingPhotos: true
    };

    return (
        <div className={styles.gridcontainer}>
            {setting && photosArray && photosArray.length > 0 && <ReactPhotoCollage {...setting} />}
        </div>
    )
}


const PhotoPage = (props) => {
    const {
        id,
        hero_img,
        name,
        rating,
        location_city,
        description,
    } = props.beach;

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
            <BackgroundImageOnly
                beach_id={id}
                hero_img={hero_img}
                name={name}
                rating={rating}
                location_city={location_city}
            />
            <PhotoGrid
                beachImages={props.beachImages}
            />
        </Layout>
    )
}

export { PhotoPage, PhotoGrid };