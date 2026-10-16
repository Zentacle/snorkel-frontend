# Location map renderer

Renders the annotated map image for each location page (`/loc/...`): the base
map, numbered pins matching the page's ranked list, a title with the Zentacle
logo, and a key with each site's star rating and review count. Images are
public, indexable by Google Images, and used as the page's map and `og:image`.

- **Base map:** OpenStreetMap data from the newest [Protomaps](https://protomaps.com)
  daily build, rendered with MapLibre Native. No API key, no per-image fee;
  the image must show "© OpenStreetMap contributors" (it does).
- **Same numbers as the page:** the spots come from the same API query the page
  uses, and pin placement uses the page's own `src/lib/mapProjection.ts`.
- **Output:** `s3://snorkel/loc-map/<level>/<path>.png` (served as
  `https://www.zentacle.com/image/loc-map/...png`, the URLs the old location
  maps used) plus a `.json` with pin positions for the page, an `_index.json`
  of all rendered maps, and `_render-state.json` used to detect changes.

## Running

The GitHub Action `.github/workflows/render-location-maps.yml` runs daily and
re-renders only locations whose top spots, ratings or reviews changed. Run it
manually (Actions → Render location maps → Run workflow) with **force** after
changing the design, or with **only** for a single page. **dry run** renders
(10 by default) without uploading and attaches the images to the run, which
also works before the AWS secrets are set.

Locally (macOS works without xvfb):

```
cd map-renderer
npm ci
npm run render -- --only /loc/us/hi/maui/wailea-makena   # dry run: images in ./out
npm run render -- --apply --limit 50                      # upload (needs AWS credentials)
```

Changing the design: edit `src/compose.ts`, then bump `RENDER_VERSION` in
`src/config.ts` so every map is re-rendered on the next run.

## Setup (once)

Repository secrets `MAP_RENDERER_AWS_ACCESS_KEY_ID` and
`MAP_RENDERER_AWS_SECRET_ACCESS_KEY`, for an IAM user limited to:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:PutObjectAcl"],
      "Resource": "arn:aws:s3:::snorkel/loc-map/*"
    }
  ]
}
```
