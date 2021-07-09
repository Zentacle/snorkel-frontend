import styles from "./Header.module.css";
import Image from "next/image";
import router from "next/router";
import NavSidebar from "../../NavSidebar/NavSidebar";
import Link from "next/link";
const Header = () => {

    return (
        <div className={styles.header}>
            <div className={styles.headercontainer}>
                <div className={styles.headerbutton}>
                    <Link className={styles.innerheaderbutton} href='/'>
                        <a className={styles.headertitle}>
                            <span>DiveBriefing</span>
                        </a>
                    </Link>
                </div>
                <div className={styles.spaceholder}>
                    <Link href='/register'>
                        <a className={styles.loginbutton}>Create Account</a>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Header;