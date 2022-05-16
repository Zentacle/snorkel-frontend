import styles from "./Header.module.css";
import Image from 'next/image';
import Link from "next/link";
import React from "react";
import { useCurrentUser } from 'context/usercontext';
import ProfilePic from "components/ProfilePic";
import { useRouter } from "next/router";

const Profile = ({ user }) => {
    if (user) {
        return (
            <Link prefetch={false} href={`/user/${user.username}`}>
                <a className={styles.outerprofile}>
                    {user.username}
                </a>
            </Link>
        )
    }
    else return null;
}

const Logo = ({ isShorediving = false }) => {
    return isShorediving
        ? (
            <a href='https://www.shorediving.com' className={styles.headertitlelink}>
                <Image src='/sdlogo.gif' height='32' width='78' alt="Shore Diving logo" />
            </a>
        )
        : (<Link prefetch={false} href='/'>
            <a className={styles.headertitlelink}>
                <Image src='/logo.png' height='32' width='32' alt="Zentacle logo" />
                <span className={styles.headertitle}>Zentacle</span>
            </a>
        </Link>
        )
}


const Header = (props) => {
    let { state } = useCurrentUser();
    const currentUser = state.user;

    const isShorediving = props.isShorediving;

    return (
        <div className={styles.header}>
            <div className={styles.headercontainer}>
                <div className={styles.headerbutton}>
                    <Logo isShorediving={isShorediving} />
                </div>
                <div className={styles.spaceholder}>
                    <div>
                        {currentUser && currentUser.id && <Link prefetch={false} href="/add/spot">
                            <a className={styles.addSpot}>Add New Spot</a>
                        </Link>}
                    </div>
                    {currentUser && currentUser.id && <ProfilePic user={currentUser} size={32} />}
                    <div className={styles.rightButton}>
                        {currentUser && currentUser.id
                            ? <Profile user={currentUser}></Profile>
                            : <Link prefetch={false} href='/register'>
                                <a className={styles.loginbutton}>Create Account</a>
                            </Link>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;