// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json({
    "applinks": {
      "apps": [],
      "details": [
        {
          "appID": "1611242564.org.reactjs.native.example.Zentacle",
          "paths": ["/Beach/*/*"]
        }
      ]
    }
  })
}
