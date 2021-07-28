import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Layout from "components/Layout/Layout";
import Location from "components/Carousel/Location/Location";
import { rootDomain } from 'lib/constants';
import SearchBar from 'components/SearchBar';
import Head from 'next/head';
import styles from './styles.module.css';
import Link from 'next/link';

export async function getServerSideProps(context) {
    const search_term = context.query.search_term;
    const res = await fetch(`${rootDomain}/spots/search?search_term=${search_term}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await res.json()

    if (!data) {
        return {
            notFound: true,
        }
    }

    return {
        props: data, // will be passed to the page component as props
    }
}

const SearchPage = (props) => {
    const router = useRouter()

    const [results, setResults] = useState(props.data);
    const [searchTerm, setSearchTerm] = useState(router.query.search_term);
    console.log(props.data);

    useEffect(() => {
        if (!router.isReady) { return; }

        fetch(`${rootDomain}/spots/search?search_term=${searchTerm}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            setResults(data.data);
        })
    }, [router.isReady])

    return (
        <Layout>
            <div className={ styles.searchContainer}>
                <SearchBar value={ searchTerm } onChange={ setSearchTerm }/>
                <div className={ styles.searchResultsContainer }>
                    { results.length
                        ? results.map(result => <div key={ result.id } className={styles.slide}><Location info={result}/></div>)
                        : <div>
                            No results found. We currently only support Maui locations, but would love to add more with your help.
                            <Link href='/add/spot'><a> Click here to request it be added.</a></Link>
                        </div>
                    }
                </div>
            </div>
        </Layout>
    )
}

export default SearchPage;