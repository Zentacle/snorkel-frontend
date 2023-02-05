module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.zentacle.com',
  generateRobotsTxt: false, // (optional)
  exclude: [
    '/shorediving-sitemap.xml',
    '/server-sitemap.xml',
    '/setpassword',
    '/setusername',
    '/404',
    '/500',
  ], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://www.zentacle.com/server-sitemap.xml',
      'https://www.zentacle.com/sitemap-shop.xml',
       // <==== Add here
    ],
  },
}
