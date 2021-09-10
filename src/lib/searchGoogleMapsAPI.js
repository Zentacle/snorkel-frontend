import { rootDomain } from 'lib/constants';

const searchGoogleMapsAPI = (location) => {
  return fetch(`${rootDomain}/search/location?input=${location}`)
    .then(response => response.json())
    .then(data => {
      return data.results;
    });
}

export default searchGoogleMapsAPI;
