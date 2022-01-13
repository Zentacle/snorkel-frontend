import styles from './styles.module.css'
import React from 'react';
import { useRouter } from 'next/router';

const TypeAheadDropDown = (props) => {
    const [suggestions, setSuggestions] = React.useState([])

    React.useEffect(() => {
        const items = [
            { text: 'maui', url: '/loc/us/hi/maui' },
            { text: 'big island', url: '/loc/us/hi/big-island' },
        ];
        let newSuggestions = [];
        const value = props.text.length
        if (value > 0) {
            const regex = new RegExp(`^${props.text}`, `i`);
            newSuggestions = items.sort().filter(v => regex.test(v.text));
        }

        setSuggestions(newSuggestions);
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
