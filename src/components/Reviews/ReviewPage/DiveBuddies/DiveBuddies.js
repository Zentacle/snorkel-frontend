import styles from "./DiveBuddies.module.css";
import CheckIcon from '@material-ui/icons/Check';
import React from "react";
import EditableBuddy from "./Buddy.js";



const DiveBuddies = (props) => {
    const ScubaSnorkel = props.ScubaSnorkel;
    const [buddyEmails, setBuddyEmails] = React.useState([]);
    const [email, setEmail] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    
    const ActivityType = () => {
        return ScubaSnorkel.toString() === 'snorkel' ? 'Snorkel Buddies' : 'Dive Buddies'
    }

    const validate_email = (email) => {
        //if contains '@' and a '.' with stuff in between
    }

    const save_email = (input_email) => {
        if (input_email !== '') {
            setBuddyEmails([...buddyEmails, input_email]);
            props.addBuddyEmails([...buddyEmails, input_email]);
        }
        setEmail('');
    }

    const update_email = (new_email, i) => {
        setLoading(true);
        let newEmails = [];

        if (new_email !== '') { //updates within array
            newEmails = buddyEmails.map((email, index) => {
                return (index===i ? new_email : email);
            })
        } else { //removes from array
            newEmails = [...buddyEmails];
            newEmails.splice(i, 1);
        }
        setLoading(false);
        setBuddyEmails(newEmails);
        props.addBuddyEmails(newEmails);
    }

    const handleChange = (e) => {
        setEmail(e.target.value);
    }

    const EmailInput = () => { 
        return (
            <section>
                {buddyEmails.length < 5 ? (         
                    //input field
                    <div className={styles.enter_email_div} onKeyPress={(e) => {e.key === 'Enter' ? save_email(email) : ''}}>
                        {/* {FilterInputs()} */}
                        <input 
                            value={email} 
                            onChange={handleChange} 
                            className={styles.email_input}
                            autoFocus={true}
                            placeholder="email"
                        />
                        <button className={styles.btn}>
                            <CheckIcon fontSize="small" onClick={() => {save_email(email)}}></CheckIcon>
                        </button>
                    </div>
                ) : (
                    //no more inputs available
                    <div className={styles.buddyEmail}>
                        Sorry, you can only list 5 buddies
                    </div>
                )}
            </section>
        )
    }

    return (
        <div>
            <ActivityType></ActivityType>
            <div>
                { buddyEmails && !loading &&
                    buddyEmails.map((buddyEmail,i) => (<EditableBuddy index={i} key={i} email={buddyEmail} updateEmailFunc={update_email}></EditableBuddy>))
                }
            </div>
            <EmailInput></EmailInput>
        </div>
    )
}

export default DiveBuddies;