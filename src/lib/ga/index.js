// https://mariestarck.com/add-google-analytics-to-your-next-js-application-in-5-easy-steps/

// log the pageview with their URL
export const pageview = (url) => {
  window.gtag('config', 'G-WFH58XWN7D', {
    page_path: url,
  })
}

// log specific events happening.
export const event = ({ action, params }) => {
  console.log('logged ' + action)
  window.gtag('event', action, params)
}