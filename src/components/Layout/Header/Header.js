import styled from 'styled-components';

import styles from "./Header.module.css";
import Image from 'next/image';
import Link from "next/link";
import React from "react";
import { useCurrentUser } from 'context/usercontext';
import ProfilePic from "components/ProfilePic";
import {
    Dropdown,
    Item,
    Info,
    Trigger,
    Separator
} from 'controls/Dropdown';
import { rootDomain } from 'lib/constants';

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

const Name = styled.div`
  color: #888;
  font-weight: 600;
`;

const Email = styled.div`
  color: #888;
  margin-top: 4px;
`;

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
                <div>
                    <Link href="/explore">
                        <a className={styles.explore}>
                            Explore
                        </a>
                    </Link>
                </div>
                <div className={styles.spaceholder}>
                    <div className={styles.rightButton}>
                        <Link href='https://zentacle.app.link?utm_medium=xpromo&utm_source=xpromo&campaign=header_button'>
                            <a className={styles.appButton}>
                                Use App
                            </a>
                        </Link>
                        {currentUser && currentUser.id
                            ? <Dropdown
                                trigger={
                                    <Trigger>
                                        <div className={styles.profile}>
                                            <ProfilePic user={currentUser} size={32} />
                                            <div className={styles.outerprofile}>
                                                {currentUser.username}
                                            </div>
                                        </div>
                                    </Trigger>
                                }
                            >
                                <Info>
                                    <Name>
                                        {currentUser.display_name}
                                    </Name>
                                    <Email>{currentUser.username}</Email>
                                </Info>
                                <Separator />
                                <Item>
                                    <Link href={`/user/${currentUser.username}`}>
                                        View Profile
                                    </Link>
                                </Item>
                                <Item>
                                    <Link href='https://buy.stripe.com/00gcPhf2Octp3nOaEE'>
                                        Zentacle Pro
                                    </Link>
                                </Item>
                                <Item
                                    onClick={() => {
                                        fetch(`${rootDomain}/user/logout`).then(res => window.location.reload());
                                    }}
                                >
                                    Logout
                                </Item>
                            </Dropdown>
                            : <Link prefetch={false} href='/register'>
                                <a className={styles.loginbutton}>Sign Up</a>
                            </Link>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;