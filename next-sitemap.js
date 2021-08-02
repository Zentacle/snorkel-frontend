module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.zentacle.com',
  generateRobotsTxt: true, // (optional)
  exclude: [
    '/server-sitemap.xml',
    '/setpassword',
  ], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://www.zentacle.com/server-sitemap.xml', // <==== Add here
    ],
  },
}
