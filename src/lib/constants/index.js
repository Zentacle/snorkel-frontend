import React from 'react';

export const rootDomain = process.env.NODE_ENV !== 'production'
  ? 'http://localhost:3000/api'
  : process.env.VERCEL_ENV === 'production'
    ? 'https://www.zentacle.com/api'
    : `${process.env.VERCEL_URL}/api`
export const test = 'test';
