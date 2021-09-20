import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Layout from "components/Layout/Layout";
import Location from "components/Carousel/Location/Location";
import { rootDomain } from 'lib/constants';
import SearchBar from 'components/SearchBar';
import styles from './styles.module.css';
import Link from 'next/link';

const SearchPage = () => {
    const router = useRouter()

    const [results, setResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!router.isReady) { return; }

        setSearchTerm(router.query.search_term)

        fetch(`${rootDomain}/spots/search?search_term=${router.query.search_term}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            setResults(data.data);
        })
    }, [router.isReady, router.query.search_term])

    return (
        <Layout>
            <div className={ styles.searchContainer}>
                <SearchBar value={ searchTerm } onChange={ setSearchTerm }/>
                <div className={ styles.searchResultsContainer }>
                    { results.length
                        ? results.map(result => <div key={ result.id } className={styles.slide}><Location info={result}/></div>)
                        : <div>
                            No results found. We would love to add more locations with your help. Make sure to create an account so you&apos;re on our email list.
                            <Link href={ `/add/spot?name=${searchTerm}` }><a className={styles.requestAdd}> Click here to submit a new location</a></Link>
                        </div>
                    }
                </div>
            </div>
        </Layout>
    )
}

export default SearchPage;
