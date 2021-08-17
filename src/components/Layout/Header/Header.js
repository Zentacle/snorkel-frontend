import styles from "./Header.module.css";
import Image from 'next/image';
import Link from "next/link";
import React from "react";
import { useCurrentUser } from 'context/usercontext';
import ProfilePic from "components/ProfilePic";

const Profile = ({ user }) => {
    if (user) {
        return (
            <Link href={`/user/${user.username}`}>
                <a className={styles.outerprofile}>
                    {user.username}
                </a>
            </Link>
        )
    }
    else return null;
}


const Header = () => {
    let { state } = useCurrentUser();
    const currentUser = state.user;

    return (
        <div className={styles.header}>
            <div className={styles.headercontainer}>
                <div className={styles.headerbutton}>
                    <Link className={styles.innerheaderbutton} href='/'>
                        <a className={styles.headertitlelink}>
                            <Image src='/logo.png' height='32' width='32' alt="logo" />
                            <span className={styles.headertitle}>Zentacle</span>
                        </a>
                    </Link>
                </div>
                <div className={styles.spaceholder}>
                    <div>
                        {currentUser && currentUser.id && <Link href="/add/spot">
                            <a className={styles.addSpot}>Add New Spot</a>
                        </Link>}
                    </div>
                    <div className={styles.rightButton}>
                        {currentUser && currentUser.id
                            ? <Profile user={currentUser}></Profile>
                            : <Link href='/register'>
                                <a className={styles.loginbutton}>Create Account</a>
                            </Link>
                        }
                    </div>
                    {currentUser && currentUser.id && <ProfilePic user={currentUser} size={32}/> }
                </div>
            </div>
        </div>
    );
}

export default Header;