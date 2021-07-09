import Image from "next/image"
import styles from "./Home.module.css"
import SearchBar from "components/SearchBar"
import React from "react";
import MyCarousel from "../Carousel/Carousel"

const BackImage = () => {
    return (
        <div className={styles.image}>
                <div className={styles.imageinner}>
                
                <Image className={styles.actualimage} height='1223' width='3000' objectFit="contain" alt="here" src="/homepageimg.jpeg">
                    
                </Image>
                
                </div>
                <div className={styles.pagetitle}>Whats the viz?</div>
                <div className={styles.menu}>
                    
                    <SearchBar></SearchBar>
                </div>
            </div>
    )
}

const Home1 = () => {
    return(
        <div className={styles.container}>
            <BackImage></BackImage>
            <div className={styles.carouseltitle}>Local Favorites in Maui</div>
            <MyCarousel></MyCarousel>
            <div className={styles.carouseltitle}>Viz Reported Recently</div>
            <MyCarousel></MyCarousel>
            <div className={styles.carouseltitle}>Top Rated in Maui</div>
            <MyCarousel></MyCarousel>
        </div>
    )
}

export default Home1;