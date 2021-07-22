import { useRouter } from 'next/router';
import React from "react";

import styles from './styles.module.css';
import { sendEvent } from 'hooks/amplitude';
import SearchIcon from '@material-ui/icons/Search';

const Menu = (props) => {
  const router = useRouter();
  const [search, setSearch] = React.useState(props.value || '');

  const conductSearch = () => {
    sendEvent('submit_search', {
        'query': search,
    });
    router.push(`/search?search_term=${search}`)
  }

  return (
    <div className={ styles.container }>
        <div className={ styles.inputContainer }>
            <input
                placeholder="Search"
                value={search}
                className={styles.searchbar}
                onChange={ e => setSearch(e.target.value) }
                handleKeyDown={ () => {
                    if (e.key === 'Enter') {
                        conductSearch()
                    }
                }}
            />
        </div>
        <button className={ styles.searchButton } onClick={ conductSearch }>
            <SearchIcon className={ styles.icon }/>
        </button>
    </div>
  )
}

export default Menu