import styled from 'styled-components';

import styles from "./Header.module.css";
import Image from 'next/image';
import Link from "next/link";
import React from "react";
import { useRouter } from 'next/router';
import { useCurrentUser } from 'context/usercontext';
import ProfilePic from "components/ProfilePic";
import SearchBar from 'components/SearchBar';
import {
    Dropdown,
    Item,
    Info,
    Trigger,
    Separator
} from 'controls/Dropdown';
import { sendEvent } from 'hooks/amplitude';
import { rootDomain } from 'lib/constants';

// main sections, in the header on desktop and in the menu on phones
const NAV_LINKS = [
    { href: '/directory', label: 'Dive sites', event: 'dive_sites' },
    { href: '/directory/shop', label: 'Dive shops', event: 'dive_shops' },
    { href: '/explore', label: 'Map', event: 'explore' },
    { href: '/buddy', label: 'Community', event: 'community' },
];

const Logo = ({ isShorediving = false }) => {
    return isShorediving
        ? (
            <a href='https://www.shorediving.com' className={styles.headertitlelink}>
                <Image src='/sdlogo.gif' height='32' width='78' alt="Shore Diving logo" />
            </a>
        )
        : (<Link prefetch={false} href='/'>
            <a className={styles.headertitlelink}>
                <Image src='/logo.png' height='32' width='32' alt="" />
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

const SearchIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
    </svg>
);

const MenuIcon = ({ open }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
);

const Header = (props) => {
    let { state } = useCurrentUser();
    const currentUser = state.user;
    const router = useRouter();
    const [path, setPath] = React.useState('');
    // phones: search and menu open below the bar
    const [searchOpen, setSearchOpen] = React.useState(false);
    const [menuOpen, setMenuOpen] = React.useState(false);

    const isShorediving = props.isShorediving;

    React.useEffect(() => {
        setPath(window.location.pathname)
    }, [])

    React.useEffect(() => {
        const close = () => {
            setSearchOpen(false);
            setMenuOpen(false);
        };
        router.events.on('routeChangeStart', close);
        return () => router.events.off('routeChangeStart', close);
    }, [router.events]);

    const appUrl = `https://zentacle.app.link${path}?$deeplink_path=${path}&utm_medium=xpromo&utm_source=xpromo&campaign=header_button`;
    const isHome = router.pathname === '/';
    const isActive = (href) => router.asPath === href || router.asPath.startsWith(`${href}/`);

    const navLinks = (className, activeClassName) => NAV_LINKS.map((link) => (
        <Link key={link.href} href={link.href}>
            <a
                className={`${className} ${isActive(link.href) ? activeClassName : ''}`}
                onClick={() => sendEvent(`header_nav__${link.event}_click`)}
            >
                {link.label}
            </a>
        </Link>
    ));

    const account = currentUser && currentUser.id
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
            <a className={styles.loginbutton}>Sign up</a>
        </Link>;

    return (
        <header className={styles.header}>
            <div className={styles.headercontainer}>
                <Logo isShorediving={isShorediving} />
                <nav className={styles.nav} aria-label="Main">
                    {navLinks(styles.navLink, styles.navLinkActive)}
                </nav>
                {/* the home page has its own big search box */}
                {!isHome && (
                    <div className={styles.search}>
                        <SearchBar largeSearchBar={false} compact />
                    </div>
                )}
                <div className={styles.actions}>
                    <Link href={appUrl}>
                        <a className={styles.appButton}>Get the app</a>
                    </Link>
                    {account}
                    {!isHome && <button
                        type="button"
                        className={`${styles.iconButton} ${styles.searchToggle}`}
                        aria-label="Search"
                        aria-expanded={searchOpen}
                        onClick={() => {
                            setSearchOpen(!searchOpen);
                            setMenuOpen(false);
                        }}
                    >
                        <SearchIcon />
                    </button>}
                    <button
                        type="button"
                        className={`${styles.iconButton} ${styles.menuToggle}`}
                        aria-label="Menu"
                        aria-expanded={menuOpen}
                        onClick={() => {
                            setMenuOpen(!menuOpen);
                            setSearchOpen(false);
                        }}
                    >
                        <MenuIcon open={menuOpen} />
                    </button>
                </div>
            </div>
            {searchOpen && (
                <div className={styles.mobileSearch}>
                    <SearchBar largeSearchBar={false} compact />
                </div>
            )}
            {menuOpen && (
                <nav className={styles.mobileMenu} aria-label="Main">
                    {navLinks(styles.mobileLink, styles.navLinkActive)}
                    <Link href={appUrl}>
                        <a className={styles.mobileLink}>Get the app</a>
                    </Link>
                </nav>
            )}
        </header>
    );
}

export default Header;
