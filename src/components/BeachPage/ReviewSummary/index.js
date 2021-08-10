import styles from "../ReviewSummary/ReviewSummary.module.css";
import Star from "@material-ui/icons/Star";
import ProgressBar from 'react-bootstrap/ProgressBar';
import Rating from "react-rating";
import Head from 'next/head';

const TotalReviews = ({rating, num_reviews}) =>{
    
    return (
        <div className={styles.averagecontainer}>
            <div className={styles.averagerating}>{rating && (rating).toString().substr(0, 3)}</div>
            <div className={styles.averagestars}>
            <Rating className={styles.rating}
                    fractions={10} 
                    initialRating={ rating }
                    emptySymbol={(<Star className={styles.staremptysmall}></Star>)} 
                    fullSymbol={(<Star className={styles.starfullsmall}></Star>)}
                    readonly
                >
                </Rating>
                <div className={styles.totreviews}>({num_reviews})</div>
            </div>
        </div>
    )
}

const ReviewSummary = ({ratings, rating, num_reviews}) =>{
    
    let total = num_reviews
    
    return (
        <div className={styles.outerdiv}>
            <Head>
                <link rel="preload" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" as="style" onLoad="this.onload=null;this.rel='stylesheet'"/>
            </Head>
            <div className={styles.innergrid}>
                <div className={styles.one}>5</div>
                <div className={styles.star1}><Star className={styles.starempty}></Star></div>
                <div className={styles.bar1}><ProgressBar className={styles.progbar} variant="warning" now={(ratings[5]/total) * 100}></ProgressBar></div>
                <div className={styles.two}>4</div>
                <div className={styles.star2}><Star className={styles.starempty}></Star></div>
                <div className={styles.bar2}><ProgressBar className={styles.progbar} variant="warning" now={(ratings[4]/total) * 100}></ProgressBar></div>
                <div className={styles.three}>3</div>
                <div className={styles.star3}><Star className={styles.starempty}></Star></div>
                <div className={styles.bar3}><ProgressBar className={styles.progbar} variant="warning" now={(ratings[3]/total) * 100}></ProgressBar></div>

                <div className={styles.four}>2</div>
                <div className={styles.star4}><Star className={styles.starempty}></Star></div>
                <div className={styles.bar4}><div><ProgressBar className={styles.progbar} variant="warning" now={(ratings[2]/total) * 100}></ProgressBar></div></div>

                <div className={styles.five}>1</div>
                <div className={styles.star5}><Star className={styles.starempty}></Star></div>
                <div className={styles.bar5}><ProgressBar className={styles.progbar} variant="warning" now={(ratings[1]/total) * 100}></ProgressBar></div>

            </div>
        <TotalReviews 
        rating={rating}
        num_reviews={num_reviews}
        />
        </div>
    )

}

export default ReviewSummary;

