import Image from "next/image"
import styles from "./Home.module.css"
import SearchBar from "material-ui-search-bar"
import React from "react";

const Menu = () => {
    const [search, setSearch] = React.useState('');
    React.useEffect(()=>{
        console.log(search);
    }, [search]);

    return (
        <div>
            <div className={styles.innermenu}>
            <SearchBar className={styles.searchbar} onChange={(change) => setSearch(change)}/>
            </div>
        </div>
    )
}

const BackImage = () => {
    return (
        <div className={styles.image}>
                <div className={styles.imageinner}>
                
                <Image className={styles.actualimage} height='1223' width='3000' objectFit="contain" alt="here" src="/homepageimg.jpeg"/>
                </div>
                <div className={styles.pagetitle}>Whats the viz?</div>
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