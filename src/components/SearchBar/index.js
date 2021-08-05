import { useRouter } from 'next/router';
import SearchBar from "material-ui-search-bar"
import React from "react";

import styles from './styles.module.css';
import { sendEvent } from 'hooks/amplitude';

const Menu = (props) => {
  const router = useRouter();
  const [search, setSearch] = React.useState(props.value || '');
  React.useEffect(()=>{
      console.log(search);
  }, [search]);

  return (
      <div className={styles.innermenu}>
          <SearchBar
              value={search}
              className={styles.searchbar}
              onChange={ setSearch }
              onRequestSearch={() => {
                  sendEvent('submit_search', {
                      'query': search.toLowerCase(),
                  });
                  router.push(`/search?search_term=${search}`
              )}}
          />
      </div>
  )
}

export default Menu