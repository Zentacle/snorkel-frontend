import React from "react";

import styles from "./styles.module.css"
import { ReactPhotoCollage } from "react-photo-collage";

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

export default PhotoGrid;
