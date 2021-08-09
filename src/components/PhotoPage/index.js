import styles from "components/PhotoPage/PhotoPage.module.css"
import Layout from "components/Layout/Layout";
import BackgroundImageOnly from "components/BeachPage/BackgroundImage";
import { useRouter } from "next/router";
import { ReactPhotoCollage } from "react-photo-collage";
import React from "react";
import { rootDomain } from 'lib/constants';

const PhotoGrid = ({ isReview, beach_id, review_id }) => {
    const [photoArray, setPhotoArray] = React.useState([]);

    React.useEffect(() => {
        if (beach_id != -1)
            fetch(`${rootDomain}/beachimages?beach_id=` + beach_id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                return response.json();
            }).then(data => {
                setPhotoArray([...data.data]);
                

            })
        else {
            fetch(`${rootDomain}/reviewimages?review_id=` + review_id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                return response.json();
            }).then(data => {
                setPhotoArray([...data.data]);

            })
        }
    }, [])


    //this is the array that will be used as the settings for the collage
    const [photosArray, setPhotosArray] = React.useState([]);
    React.useEffect(() => {
        
        if (photosArray.length < 1) {
            
            setPhotosArray([])
            for (let i = 0; i < photoArray.length; i++) {
                photosArray.push({ source: photoArray[i].signedurl.data })
                setPhotosArray([...photosArray])
            }
            
        }
    }, [photoArray])

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
    if (isReview) {
        if (photoslen == 1) {
            width = '50px';
            heightArray = ['50px']
            layoutArray = [1]
        }
        else if (photoslen == 2) {
            width = '100px';
            heightArray = ["50px"]
            layoutArray = [2]
        }
        else if (photoslen == 3) {
            width = '150px';
            heightArray = ["50px"]
            layoutArray = [3]
        }
        else {
            width = '200px'
            heightArray = ["50px"]
            layoutArray = [4]
        }
    }
    const setting = {
        width: width,
        height: heightArray,
        layout: layoutArray,
        photos: [...photosArray],
        showNumOfRemainingPhotos: true
    };

    return (
        <div className={styles.gridcontainer}>
            {photosArray.length > 0 && <ReactPhotoCollage {...setting} />}
        </div>

    )
}


const PhotoPage = () => {
    const Router = useRouter();
    const { beach_id, hero_img, name, rating, location_city } = Router.query;
    return (
        <Layout>
            <BackgroundImageOnly
                beach_id={beach_id}
                hero_img={hero_img}
                name={name}
                rating={rating}
                location_city={location_city}
            />
            <PhotoGrid
                beach_id={beach_id}
                isReview={false}
            />

        </Layout>
    )
}

export { PhotoPage, PhotoGrid };