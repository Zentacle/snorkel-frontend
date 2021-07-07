import styles from "./Header.module.css";
import Image from "next/image";
import router from "next/router";
import  NavSidebar from "../../NavSidebar/NavSidebar";
const Header = () => {
    
    return (
        <div>
            <div className={styles.header}>
                <div className={styles.headerbutton}>
                    <div className={styles.innerheaderbutton} onClick={() => router.push("/")}>
                <Image src="/../public/Vector.png" alt="Menu Button" height='12px' width='18px'></Image>
                <NavSidebar/>
                </div>
                </div>
                <div className={styles.headertitle}>
                <span>DiveBriefing</span>
                </div>
                <div className={styles.spaceholder}>
                <div className={styles.loginbutton} onClick={()=>router.push('/Login')}>
                    Login
                    </div>
                </div>
            
        </div>
        </div>
    );
}

export default Header;