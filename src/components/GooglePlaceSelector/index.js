import React from 'react';
import styles from './styles.module.css';

const GooglePlaceSelector = ({
  setSelected,
  selectedGooglePlace,
  googlePlaceCandidates,
  setLatLng,
}) => {
  React.useEffect(() => {
    const initializeMap = () => {
      window.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        center: new google.maps.LatLng(20.83674343601845, -156.4178040410507),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      // https://developers.google.com/maps/documentation/javascript/examples/event-click-latlng
      let infoWindow = null;
      map.addListener("rightclick", (mapsMouseEvent) => {
        // Close the current InfoWindow.
        if (infoWindow) {
          infoWindow.close();
        }

        // Create a new InfoWindow.
        infoWindow = new google.maps.InfoWindow({
          position: mapsMouseEvent.latLng,
        });
        infoWindow.setContent(
          'The lat/lng of this pin will be submitted. The lat/lng of the selected named location will be ignored'
        );
        // https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
        setLatLng(mapsMouseEvent.latLng.lat(), mapsMouseEvent.latLng.lng())
        infoWindow.open(map);
      });
    }
    const script = document.createElement('script')
    script.src = 'https://maps.google.com/maps/api/js?key=AIzaSyAPbvPcOMVp6qdWP59cML7kmYd2ShEGu_Y'
    script.onload = setTimeout(initializeMap, 1000)
    script.async = true;
    document.querySelector('body').appendChild(script)
  }, [])

  React.useEffect(() => {
    if (!window.google || !selectedGooglePlace) { return }
    const location = selectedGooglePlace.geometry.location;
    var center = new google.maps.LatLng(location.lat, location.lng);
    window.map.panTo(center);
    const marker = new google.maps.Marker({
      position: center,
      map: map
    });
  }, [selectedGooglePlace, googlePlaceCandidates])

  return <>
    {
      googlePlaceCandidates && googlePlaceCandidates.length ? (
        <div>
          <div className={styles.helper}>Is it one of the following locations?</div>
          <div className={styles.placeContainer}>
            {googlePlaceCandidates.map((place, index) => (
              <div
                className={`${styles.placeSelection} ${selectedGooglePlace && selectedGooglePlace.place_id === place.place_id && styles.active}`}
                onClick={setSelected(index)}
                key={place.place_id}
              >
                {place.name} - {place.formatted_address}
              </div>
            ))}
            <div className={styles.placeSelection} onClick={setSelected(null)}>None of the above</div>
          </div>
        </div>
      ) : (<div>Nothing found! Please enter the rest of the info below</div>)
    }
    <div id="map" className={styles.googleMap}></div>
  </>
}

export default GooglePlaceSelector;
