import styles from "./Header.module.css";
import Image from 'next/image';
import Link from "next/link";
import React from "react";
import { useCurrentUser } from '../../../context/usercontext'

const Profile = ({ user }) => {
    if (user) {
        return <div className={styles.outerprofile}>{user.username}</div>
    }
    else return null;
}


const Header = () => {

    let currentuser = useCurrentUser().state;


    return (
        <div className={styles.header}>
            <div className={styles.headercontainer}>
                <div className={styles.headerbutton}>
                    <Link className={styles.innerheaderbutton} href='/'>
                        <a className={styles.headertitlelink}>
                            <Image src='/logo.png' height='32' width='32'/>
                            <span className={styles.headertitle}>Zentacle</span>
                        </a>
                    </Link>
                </div>
                <div className={styles.spaceholder}>
                    {currentuser.user && currentuser.user.msg ? <Link href='/register'>
                        <a className={styles.loginbutton}>Create Account</a>
                    </Link> : <Profile user={currentuser.user}></Profile>}
                </div>
            </div>
        </div>
    );
}

export default Header;