import styles from './styles.module.css'
import React from 'react';
import { useRouter } from 'next/router';
import { rootDomain } from 'lib/constants';

/***
 * https://medium.com/@svsh227/create-your-own-type-ahead-dropdown-in-react-599c96bebfa
 ***/

const TypeAheadDropDown = (props) => {
    const [suggestions, setSuggestions] = React.useState([])

    React.useEffect(() => {
        if(props.text.length) {
            const items = fetch(`${rootDomain}/search/typeahead?query=` + props.text, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json'
                }
              }).then(response => {
                return response.json();
              }).then(data => {
                setSuggestions(data.data)
              })
        } else {
            setSuggestions([])
        }
    }, [props.text])

    const router = useRouter();

    const suggestionSelected = (value) => {
        router.push(value.url)
    }

    if (suggestions.length === 0) {
        return null;
    }
    return (
        <div className={styles.TypeAheadDropDown}>
            {props.children}
            <ul>
                {suggestions.map(city => <li key={city.text} onClick={(e) => suggestionSelected(city)}>{city.text}</li>)}
            </ul>
        </div>
    )
}

export default TypeAheadDropDown;
