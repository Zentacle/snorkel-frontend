module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.zentacle.com',
  generateRobotsTxt: true, // (optional)
  exclude: [
    '/shorediving-sitemap.xml',
    '/server-sitemap.xml',
    '/setpassword',
    '/setusername',
  ], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://www.zentacle.com/server-sitemap.xml', // <==== Add here
    ],
  },
}
