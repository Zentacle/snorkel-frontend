
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      'snorkel.s3.amazonaws.com',
      'californiadiver.com',
      'cdn.mauiguidebook.com',
      'mauiguidebook.com',
      'www.islands.com',
      'scontent.fhnl3-1.fna.fbcdn.net',
      'scontent.fhnl3-2.fna.fbcdn.net',
      'lh3.googleusercontent.com',
      'www.lovebigisland.com',
      'www.mauidreamsdiveco.com',
      'i.ytimg.com',
      'fh-sites.imgix.net',
      'zentacle.com',
      'www.zentacle.com',
      'diveshopmedia.padiww.com',
      'pbs.twimg.com',
      'www.scubadiving.com',
      'd2p1cf6997m1ir.cloudfront.net',
      'maps.googleapis.com',
    ],
    minimumCacheTTL: 60,
  },
  async headers() {
    return [{
      "source": "/.well-known/apple-app-site-association",
      "headers": [{
        "key": "Content-Type",
        "value": "application/json"
      }]
    },
    {
      "source": "/apple-app-site-association",
      "headers": [{
        "key": "Content-Type",
        "value": "application/json"
      }]
    }
    ]
  }
}
