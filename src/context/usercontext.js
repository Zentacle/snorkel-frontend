import * as React from "react";
import { rootDomain } from 'lib/constants';

const UserContext = React.createContext();

function userReducer(state, user) {
    if (user == null) {
        console.log(rootDomain);
        fetch(`${rootDomain}/user/me`, {
            method: 'POST',
            //body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json()
        }).then(data => {

            user = data;

        }).catch((err) => {

            console.log(err)

        })
    }

    return { user };
}


function UserProvider({ children }) {
    const [state, dispatch] = React.useReducer(userReducer, { user: null })
    // NOTE: you *might* need to memoize this value
    // Learn more in http://kcd.im/optimize-context
    const value = { state, dispatch }
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

function useCurrentUser() {
    const context = React.useContext(UserContext)
    if (context === undefined) {
        throw new Error('useCurrentUser must be used within a UserProvider')
    }


    return context
}
export { UserProvider, useCurrentUser }