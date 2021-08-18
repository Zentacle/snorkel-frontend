import { useRouter } from 'next/router';
import SearchBar from "material-ui-search-bar"
import React from "react";
import { Popover, Pane, Text } from 'evergreen-ui';

import styles from './styles.module.css';
import { sendEvent } from 'hooks/amplitude';
import {rootDomain} from 'lib/constants';

const Menu = (props) => {
    const router = useRouter();
    const [search, setSearch] = React.useState(props.value || '');
    const [autocompleteResults, setAutocompleteResults] = React.useState([]);

    React.useEffect(() => {
        fetch(`${rootDomain}/search/autocomplete?q=${search}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            setAutocompleteResults([...data.data]);
        })
    }, [search])

    React.useEffect(() => setSearch(props.value), [props.value])

    return (
        <div className={styles.innermenu}>
            <Popover
                content={
                    <Pane width={240} height={240} display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                        <Text>PopoverContent</Text>
                    </Pane>
                }
            >
                <SearchBar
                    value={search}
                    className={styles.searchbar}
                    onChange={setSearch}
                    onRequestSearch={() => {
                        if (!search) { return }
                        sendEvent('submit_search', {
                            'query': search.toLowerCase(),
                        });
                        router.push(`/search?search_term=${search}`
                        )
                    }}
                />
            </Popover>
        </div>
    )
}

export default Menu