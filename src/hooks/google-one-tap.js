import { sendEvent } from 'hooks/amplitude';
import { rootDomain } from "src/lib/constants";

const googleOneTap = (redirectURL, user) => () => {
  if (!user) { return }
  if (user && user.id) { return }
  const handleLogin = (response) => {
    if (response.credential) {
      sendEvent('google_register_success');
      fetch(`${rootDomain}/user/google_register`, {
        method: 'POST',
        body: JSON.stringify(response),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(() => {
        window.location.href = redirectURL
      })
    } else {
      sendEvent('google_register_error');
    }
  }

  const initializeGSI = () => {
    if (google) {
      google.accounts.id.initialize({
        client_id: '609299692665-bl3secuu5i4v1iumjm0kje0db1lge1ec.apps.googleusercontent.com',
        callback: handleLogin,
      });
      google.accounts.id.prompt(notification => {
        if (notification.isNotDisplayed()) {
          console.log(notification.getNotDisplayedReason())
        } else if (notification.isSkippedMoment()) {
          console.log(notification.getSkippedReason())
        } else if (notification.isDismissedMoment()) {
          console.log(notification.getDismissedReason())
        }
      });
    }
  }
  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.onload = setTimeout(initializeGSI, 3000)
  script.async = true;
  document.querySelector('body').appendChild(script)
}

export default googleOneTap;