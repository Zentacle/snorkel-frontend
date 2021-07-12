import React from 'react';
import '../styles/globals.css'
import { UserProvider, useCurrentUser } from 'src/context/usercontext';
import { rootDomain } from "src/lib/constants";
function MyApp({ Component, pageProps }) {

  return (
    <UserProvider>
      <SetUser></SetUser>
      <Component {...pageProps} />
    </UserProvider>
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

      dispatch(data)

    }).catch((err) => {

      console.log(err)

    })

  }, [])

  return null;

}

export default MyApp
