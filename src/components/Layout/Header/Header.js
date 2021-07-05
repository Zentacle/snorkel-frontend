import styles from "./Header.module.css";
import Image from "next/image";
const Header = () => {
    return (
        <div>
            <div className={styles.header}>
                <div className={styles.headerbutton}>
                <Image src="/../public/Vector.png" alt="Menu Button" height='12px' width='18px'></Image>
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