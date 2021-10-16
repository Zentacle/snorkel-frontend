import React from "react";
import EditableBuddy from "./Buddy.js";


const DiveBuddies = (props) => {
    const ScubaSnorkel = props.ScubaSnorkel;
    const buddyEmails = props.buddyEmails;

    const ActivityType = () => {
        return ScubaSnorkel.toString() === 'snorkel' ? 'Snorkel Buddies' : 'Dive Buddies'
    }

    const update_email = (email, i) => {
        let newEmails = [];

        if (email !== '') { //updates within array
            newEmails = buddyEmails.map((current_email, index) => {
                return (index===i ? email : current_email);
            })
        } else { //removes from array
            newEmails = [...buddyEmails];
            newEmails.splice(i, 1);
        }
        props.addBuddyEmails(newEmails);
    }

    return (
        <div>
            <ActivityType></ActivityType>
            <div>
                { buddyEmails &&
                    buddyEmails.map((buddyEmail,i) => (<EditableBuddy index={i} key={i} email={buddyEmail} updateEmailFunc={update_email}></EditableBuddy>))
                }
            </div>
        </div>
    )
}

export default DiveBuddies;
