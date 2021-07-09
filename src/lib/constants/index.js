import React from 'react';

export const rootDomain = process.env.NODE_ENV !== 'production'
  ? 'http://localhost:3000/api'
  : 'https://divebriefing.vercel.app/api';
export const test = 'test';
