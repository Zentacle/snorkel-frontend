import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Layout from "components/Layout/Layout";
import Carousel from 'components/Carousel/Carousel';
import { rootDomain } from 'lib/constants';
import SearchBar from 'components/SearchBar';
import styles from './styles.module.css';
import Link from 'next/link';

const ExplorePage = () => {
  const router = useRouter()

  const [results, setResults] = useState([]);
  const [mapCenter, setMapCenter] = useState([20.83674343601845, -156.4178040410507])

  useEffect(() => {
    if (!router.isReady) { return; }

    const initializeMap = () => {
      window.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        center: new google.maps.LatLng(mapCenter[0], mapCenter[1]),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      map.addListener("idle", () => {
        var center = window.map.getCenter()
        setMapCenter([center.lat(), center.lng()])
      });
      fetch(`${rootDomain}/spots/nearby?lat=${mapCenter[0]}&lng=${mapCenter[1]}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res =>
        res.json()
      ).then(beach_data => {
        if (beach_data.data) {
          setResults(beach_data.data);
        } else {
          return [];
        }
      });
    }
    const script = document.createElement('script')
    script.src = 'https://maps.google.com/maps/api/js?key=AIzaSyAPbvPcOMVp6qdWP59cML7kmYd2ShEGu_Y'
    script.onload = setTimeout(initializeMap, 1000)
    script.async = true;
    document.querySelector('body').appendChild(script)
  }, [router.isReady])

  useEffect(() => {
    fetch(`${rootDomain}/spots/nearby?lat=${mapCenter[0]}&lng=${mapCenter[1]}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res =>
      res.json()
    ).then(beach_data => {
      if (beach_data.data) {
        setResults(beach_data.data);
      } else {
        return [];
      }
    });
  }, [mapCenter])

  useEffect(() => {
    if (!window.google) { return }
    results.map(location => {
      var center = new google.maps.LatLng(location.latitude, location.longitude);
      const marker = new google.maps.Marker({
        position: center,
        map: window.map,
      });
      var infowindow = new google.maps.InfoWindow({
        content: location.name,
        map: window.map,
        position: center,
      });
      infowindow.close()
      marker.addListener('mouseover', function () {
        infowindow.open(map, this);
      });

      // assuming you also want to hide the infowindow when user mouses-out
      marker.addListener('mouseout', function () {
        infowindow.close();
      });
    })
  }, [results])

  return (
    <Layout>
      <div className={styles.exploreContainer}>
        <div className={styles.menu}>
          <Carousel data={results} allowVertical />
        </div>
        <div id="map" className={styles.googleMap}></div>
      </div>
    </Layout>
  )
}

export default ExplorePage;
