import React from 'react';

export const rootDomain = process.env.NODE_ENV !== 'production'
  ? 'http://localhost:3000/apibackend'
  : process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? 'https://www.zentacle.com/api'
    : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`
export const test = 'test';
