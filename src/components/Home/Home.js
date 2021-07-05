import Image from "next/image"
import styles from "./Home.module.css"


const Menu = () => {
    return (
        <div>hello</div>
    )
}

const BackImage = () => {
    return (
        <div className={styles.image}>
                <div className={styles.imageinner}>
                
                <Image height='1223' width='3000' objectFit="contain" alt="here" src="/homepageimg.jpeg"/>
                </div>
                <div className={styles.menu}>
                    <Menu></Menu>
                </div>
            </div>
    )
}

const Home1 = () => {
    return(
        <div style={{height: '100%'}}>
            <BackImage></BackImage>

        </div>
    )
}

export default Home1;