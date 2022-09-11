import React, { useEffect } from "react";

import Layout from "components/Layout/Layout";
import MaxWidth from "components/MaxWidth";
import { rootDomain } from "lib/constants";

function Subsurface() {
  const [dives, setDives] = React.useState<any>([]);
  useEffect(() => {
    fetch(`${rootDomain}/subsurface`)
      .then(response => response.json())
      .then(result => setDives(result.dives))
      .catch(error => console.log('error', error));
  }, [])

  return (
    <Layout>
      <MaxWidth>
        { dives.map((dive:any) => <div key={dive.date}>{dive.date}</div>) }
      </MaxWidth>
    </Layout>
  );
}

export default Subsurface;
