import Beach from 'pages/Beach/[[...slug]]'
import { rootDomain } from 'lib/constants';

export async function getStaticProps(context) {
    const startTime = Date.now();
    const region = context.params.region;
    const destination = context.params.destination;
    const site = context.params.site;
    const review_url = context.params.review_id;
    const review_id = review_url.split(/[^A-Za-z0-9]/)[1];
    const res = await fetch(`${rootDomain}/spots/get?region=${region}&destination=${destination}&site=${site}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const beach_data = await res.json()

    const response = await fetch(`${rootDomain}/review/get?sd_review_id=${review_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const review_data = await response.json();

    if (!beach_data) {
        return {
            notFound: true,
        }
    }

    console.log(`beach_api_timing: ${Date.now() - startTime}ms`)
    return {
        props: {
            'beach': beach_data.data,
            'reviews': review_data.data,
            'tides': [],
            'isShorediving': true,
            'isSingularReview': true,
        }, // will be passed to the page component as props
        revalidate: 10,
    }

    // return {
    //     redirect: {
    //         destination: beach_data.data.url,
    //         permanent: false,
    //     }
    // }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

// export async function getStaticPaths() {
//     const res = await fetch(`${rootDomain}/spots/get?limit=100&ssg=true`)
//     const data = await res.json()
//     return {
//         paths: data.data.map(beach => ({
//             params: {
//                 region: [`${beach.id}`, beach.beach_name_for_url]
//             }
//         })),
//         fallback: 'blocking',
//     }
// }

export default Beach;