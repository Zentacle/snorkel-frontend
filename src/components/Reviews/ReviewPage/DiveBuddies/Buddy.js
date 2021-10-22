import React, { useEffect } from "react";
import styles from "./DiveBuddies.module.css";
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';


const EditableBuddy = (props) => {

  const [email, setEmail] = React.useState('');
  const [isEditing, setEditing] = React.useState(false);

  useEffect(() => {
    if (props.email) {
      setEmail(props.email)
    }
  }, [props.email])

  const updateEmail = () => {
    setEditing(false);
    props.updateEmailFunc(email, props.index)
  }

  return (
    <section>
      {isEditing ? (

      //edit field
        <div className={styles.enter_email_div} 
          onKeyPress={(e) => {e.key === 'Enter' ? updateEmail() : ''}}
          >
          <input
            autoFocus
            onBlur={() => updateEmail()} 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className={styles.email_input} 
            placeholder={email.toString()}
          />
          <button className={styles.btn}>
              <CheckIcon fontSize="small" onClick={() => {updateEmail()}}></CheckIcon>
          </button>
        </div> 

      ) : (

      //display field
        <div className={styles.display_email_div}>
          <AccountCircleOutlinedIcon color="disabled"/>
          <div className={styles.buddyEmail}>
            {email}
          </div>  
          <button className={styles.btn} onClick={() => setEditing(true)}>
            <EditIcon className={styles.icon} fontSize='small'/>
          </button>
        </div>

      )}
    </section>
  );
};

export default EditableBuddy;