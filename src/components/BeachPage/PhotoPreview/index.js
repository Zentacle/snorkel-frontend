import React from 'react';
import { ReactPhotoCollage } from "react-photo-collage";

import { rootDomain } from 'lib/constants';
import { sendEvent } from 'hooks/amplitude';

import styles from './styles.module.css';

const PhotoPreview = (props) => {
  const [photoArray, setPhotoArray] = props.photoState;

  const [settings, setSettings] = React.useState(null);

  React.useEffect(() => {
    if (photoArray.length > 0) {
      setSettings({
        width: '320px',
        height: ['100px', '100px', '100px'],
        layout: [Math.min(3, photoArray.length)],
        photos: photoArray.map(photo => ({
          source: photo.signedurl,
          alt: photo.caption || props.beach.name,
        })),
        showNumOfRemainingPhotos: true
      })
    }
  }, [photoArray])

  React.useEffect(() => {
    fetch(`${rootDomain}/beachimages?beach_id=${props.beach.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      return response.json();
    }).then(data => {
      setPhotoArray([...data.data]);
    })
  }, [props.beach.id])

  return (
    settings && settings.photos && settings.photos[0].source
    ? <div className={styles.photocontainer} onClick={() => sendEvent('click__photo_preview')}>
      <ReactPhotoCollage {...settings}></ReactPhotoCollage>
    </div> : <></>
  )
}

export default PhotoPreview;
