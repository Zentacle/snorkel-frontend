import Image from "next/image"
import styles from "./Home.module.css"
import SearchBar from "material-ui-search-bar"
import React from "react";
import MyCarousel from "../Carousel/Carousel"

const Menu = () => {
    const [search, setSearch] = React.useState('');
    React.useEffect(()=>{
        console.log(search);
    }, [search]);

    return (
        <div className={styles.innermenu}>
            <SearchBar value={search} className={styles.searchbar} onChange={(change) => setSearch(change)}/>
        </div>
    )
}

const BackImage = () => {
    return (
        <div className={styles.image}>
                <div className={styles.imageinner}>
                
                <Image className={styles.actualimage} height='1223' width='3000' objectFit="contain" alt="here" src="/homepageimg.jpeg">
                    
                </Image>
                
                </div>
                <div className={styles.pagetitle}>Whats the viz?</div>
                <div className={styles.menu}>
                    
                    <Menu></Menu>
                </div>
            </div>
    )
}
const CarouselTitle = () => {
    return (
        <div className={styles.carouseltitle}>Local Favorites in Maui</div>
    )
}
const Home1 = () => {
    return(
        <div style={{height: '100vh'}}>
            <BackImage></BackImage>
            <CarouselTitle></CarouselTitle>
            <MyCarousel></MyCarousel>
        </div>
    )
}

export default Home1;