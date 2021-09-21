import React from 'react';

export const rootDomain = process.env.NODE_ENV !== 'production'
  ? 'http://localhost:3000/api'
  : 'https://www.zentacle.com/api'
export const clientSideDomain = '/api';
export const test = 'test';
