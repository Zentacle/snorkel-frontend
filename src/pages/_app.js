import React, { useEffect } from 'react';
import { initAmplitude } from 'hooks/amplitude';
import Head from 'next/head';

import '../styles/globals.css'
import { UserProvider, useCurrentUser } from 'src/context/usercontext';
import { rootDomain } from "src/lib/constants";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <UserProvider>
        <SetUser></SetUser>
        <Component {...pageProps} />
      </UserProvider>
    </>
  )
}

function SetUser() {
  const { dispatch } = useCurrentUser();

  React.useEffect(() => {
    fetch(`${rootDomain}/user/me`, {
      method: 'GET',
      
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      return response.json()
    }).then(data => {
      initAmplitude(data.id);
      dispatch(data)

    }).catch((err) => {

      console.log(err)

    })

  }, [])

  return null;

}

export default MyApp
