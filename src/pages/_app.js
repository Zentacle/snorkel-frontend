import React from 'react';
import '../styles/globals.css'
import { UserProvider, useCurrentUser } from 'src/context/usercontext';
import useUser from 'lib/useUser';
import { rootDomain } from "src/lib/constants";
function MyApp({ Component, pageProps }) {


  React.useEffect(() => {
    console.log('here')
  }, []);

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
      method: 'POST',
      //body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      return response.json()
    }).then(data => {
     
      dispatch(data)
     
    }).catch((err) => {
      dispatch("hello")
      console.log(err)

    })
    

  }, [])
  console.log(useCurrentUser());
  return null;

}

export default MyApp
