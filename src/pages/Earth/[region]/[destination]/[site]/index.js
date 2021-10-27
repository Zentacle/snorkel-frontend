export async function getServerSideProps(context) {
  const region = context.params.region;
  const destination = context.params.destination;
  const site = context.params.site;
  return {
    redirect: {
        destination: `/Earth/${region}/${destination}/${site}/index.htm`,
        permanent: true,
    }
  }
}

const Page = () => {
  return <div></div>
}

export default Page;
