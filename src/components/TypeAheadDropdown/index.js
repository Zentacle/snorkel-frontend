import styles from './styles.module.css'
import React from 'react';
import { useRouter } from 'next/router';
import { rootDomain } from 'lib/constants';
import { sendEvent } from 'hooks/amplitude';
import Flag from 'icons/Flag';
import Pin from 'icons/Pin';
import debounce from 'lodash/debounce';

/***
 * https://medium.com/@svsh227/create-your-own-type-ahead-dropdown-in-react-599c96bebfa
 ***/

const TypeAheadDropDown = (props) => {
    const [suggestions, setSuggestions] = React.useState([])

    const fetchTypeahead = React.useCallback(debounce(
        (query) => fetch(`${rootDomain}/search/typeahead?query=${query}`)
            .then(response => {
                return response.json();
            }).then(data => {
                setSuggestions(data.data)
            }), 500
    ), [])

    React.useEffect(() => {
        if (props.text.length) {
            fetchTypeahead(props.text)
        } else {
            setSuggestions([])
        }
    }, [props.text])

    const router = useRouter();

    const suggestionSelected = (value) => {
        sendEvent('select_typeahead', {
            'query': value.text,
        });
        router.push(value.url)
        setSuggestions([])
    }

    if (suggestions.length === 0) {
        return null;
    }
    return (
        <div className={styles.TypeAheadDropDown}>
            {props.children}
            <ul>
                {suggestions.map(city =>
                    <li
                        className={styles.item}
                        key={`${city.url}_${city.id}`}
                        onClick={(e) => suggestionSelected(city)}
                    >
                        <div>{city.type === 'location' ? <Flag /> : <Pin />}</div>
                        <div className={styles.textContainer}>
                            <div className={styles.text}>{city.text}</div>
                            <div className={styles.subtext}>{city.subtext}</div>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    )
}

export default TypeAheadDropDown;
