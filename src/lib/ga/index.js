// https://mariestarck.com/add-google-analytics-to-your-next-js-application-in-5-easy-steps/

// log the pageview with their URL
export const pageview = (url) => {
  window.gtag('config', 'G-KSFQB9V1QD', {
    page_path: url,
  })
}

// log specific events happening.
export const event = ({ action, params }) => {
  console.log('logged ' + action)
  window.gtag('event', action, params)
}