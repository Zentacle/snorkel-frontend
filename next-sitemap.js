module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.zentacle.com',
  generateRobotsTxt: false, // (optional)
  exclude: [
    '/shorediving-sitemap.xml',
    '/server-sitemap.xml',
    '/sitemap-shop.xml',
    '/setpassword',
    '/setusername',
    '/404',
    '/500',
    // noindexed account/form/tool pages (see NOINDEX_ROUTES in _app.js)
    '/login',
    '/register',
    '/requestpassword',
    '/resetpassword',
    '/review',
    '/duplicates',
    '/search',
    '/add/spot',
    // duplicate of the home page
    '/sd',
  ], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://www.zentacle.com/server-sitemap.xml',
      'https://www.zentacle.com/sitemap-shop.xml',
       // <==== Add here
    ],
  },
}
