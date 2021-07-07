import styles from "../BeachAbout/BeachAbout.module.css";

const BeachAbout = () => {
    return (
        <div className={styles.container}>
            <div className={styles.description}>
                Mala wharf was once a fully-functioning pier which served as a shipping
                facility for the island’s pineapple and agriculture. In 1992, however, 30 ft.
                surf came marching into Lahaina as a result of Hurricane Iniki, and the end of
                the dock was completely destroyed. Today, the pilings from the old dock lie scattered
                along the ocean floor, and what was once a shipping facility above water is now a healthy
                artificial reef which is home to a vast array of marine life.
            </div>
        </div>
    )
}

export default BeachAbout;