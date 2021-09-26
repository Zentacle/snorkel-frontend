import { useRouter } from 'next/router';
import React from "react";

import styles from './styles.module.css';
import { sendEvent } from 'hooks/amplitude';
import SearchIcon from '@material-ui/icons/Search';

const SearchBar = (props) => {
  const router = useRouter();
  const [search, setSearch] = React.useState(props.value || '');
  const largeSearchBar = props.largeSearchBar;
  const barSize = largeSearchBar ? styles.lgBar : ''; 
    
  const conductSearch = () => {
    sendEvent('submit_search', {
        'query': search,
    });
    router.push(`/search?search_term=${search}`)
}

  return (
<div className={ `${barSize} ${styles.container}` }>
            <div className={ styles.inputContainer }>
                <input
                    placeholder="Search"
                    value={search}
                    className={styles.searchbar}
                    onChange={ e => setSearch(e.target.value) }
                    onKeyPress={ (e) => {
                        if (e.key === 'Enter') {
                            conductSearch()
                        }
                    }}
                />
            </div>
            <button className={ `${barSize} ${styles.searchButton}` } onClick={ conductSearch }>
                <SearchIcon className={ styles.icon }/>
            </button>
        </div>
    )
}

export default SearchBar