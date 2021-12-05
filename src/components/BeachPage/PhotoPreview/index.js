import React from 'react';
import { rootDomain } from 'lib/constants';
import { ReactPhotoCollage } from "react-photo-collage";

import styles from './styles.module.css';

const PhotoPreview = (props) => {
  const [photoArray, setPhotoArray] = props.photoState;

  const [settings1, setSettings1] = React.useState(null);

  React.useEffect(() => {
      if (photoArray.length > 0) {
          setSettings1({
              width: '320px',
              height: ['100px', '100px', '100px'],
              layout: [Math.min(3, photoArray.length)],
              photos: photoArray.map(photo => ({ source: photo.signedurl })),
              showNumOfRemainingPhotos: true
          })
      }

  }, [photoArray])

  React.useEffect(() => {
    if (!props.name) {
      fetch(`${rootDomain}/beachimages?beach_id=` + props.beach.id, {
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

  return (
    settings1 && setSettings1.photos && settings1.photos[0].source ? <div className={styles.photocontainer}>
      <ReactPhotoCollage {...settings1}></ReactPhotoCollage>
    </div> : <></>
  )
}

export default PhotoPreview;
