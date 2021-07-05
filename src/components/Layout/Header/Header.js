import styles from "./Header.module.css";
import Image from "next/image";
import  NavSidebar from "../../NavSidebar/NavSidebar";
const Header = () => {
    return (
        <div>
            <div className={styles.header}>
                <div className={styles.headerbutton}>
                    <div className={styles.innerheaderbutton}>
                <Image src="/../public/Vector.png" alt="Menu Button" height='12px' width='18px'></Image>
                <NavSidebar/>
                </div>
                </div>
                <div className={styles.headertitle}>
                <span>DiveBriefing</span>
                </div>
                <div className={styles.spaceholder}>
                
                </div>
            
        </div>
        </div>
    );
}

export default Header;