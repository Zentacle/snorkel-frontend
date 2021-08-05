import styles from "components/PhotoPage/PhotoPage.module.css"
import Layout from "components/Layout/Layout";
import BackgroundImageOnly from "components/BeachPage/BackgroundImage";
import { useRouter } from "next/router";
import { ReactPhotoCollage } from "react-photo-collage";
import React from "react";
import { rootDomain } from 'lib/constants';

const PhotoGrid = () =>{
    const [photoArray, setPhotoArray] = React.useState([]);
    const [signedUrls, setSignedUrls] = React.useState([]);
    React.useEffect(() => {
        

        
            fetch(`${rootDomain}/images`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                return response.json();
            }).then(data => {
                setPhotoArray([...data.data]);
                
                
            })
        

    }, [])
    console.log(photoArray)
    React.useEffect(()=>{
        if (signedUrls.length ){
        for (let i = 0; i < photoArray.length && i < 3; i++){
        fetch(`${rootDomain}/s3-download?file=` + 'reviews/' + photoArray[i].url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            console.log(response)
            return response.json();
        }).then(data => {
            
            const urls = signedUrls;
            urls.push(data.data)
            setSignedUrls([...urls])
            
        }).catch(err => {
            console.log(err)
        })
        }
    }
        
    }, [photoArray])
    console.log(signedUrls)
    const [photosArray, setPhotosArray] = React.useState([]);
    React.useEffect(()=>{
        setPhotosArray([])
        for (let i = 0; i < signedUrls.length; i++){
            photosArray.push({source: signedUrls[i]})
            setPhotosArray([...photosArray])
        }
    }, [signedUrls])
    console.log(photosArray)

    const setting = {
        width: '600px',
        height: ['250px', '170px'],
        layout: [1, 4],
        photos: [...photosArray],
        showNumOfRemainingPhotos: true
      };
      
      return (
          <div className={styles.gridcontainer}>
          {photosArray.length > 5 && <ReactPhotoCollage {...setting}/>}
          </div>
          
      )
}


const PhotoPage = () =>{
    const Router = useRouter();
    const {beach_id, hero_img, name, rating, location_city} = Router.query;
    return (
        <Layout>
            <BackgroundImageOnly hero_img={hero_img} name={name} rating={rating} location_city={location_city}></BackgroundImageOnly>
        <PhotoGrid></PhotoGrid>
        </Layout>
    )
}

export default PhotoPage;