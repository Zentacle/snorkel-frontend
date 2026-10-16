import React from 'react';

export const rootDomain = process.env.NODE_ENV !== 'production'
  ? 'http://localhost:3000/api'
  : 'https://www.zentacle.com/api'
export const clientSideDomain = '/api';
// browser key for the Maps JavaScript API (restricted by HTTP referrer)
export const googleMapsKey = 'AIzaSyAPbvPcOMVp6qdWP59cML7kmYd2ShEGu_Y';
export const test = 'test';
