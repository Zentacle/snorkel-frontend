import styles from "../ReviewSummary/ReviewSummary.module.css";
import Star from "@material-ui/icons/Star";
import ProgressBar from 'react-bootstrap/ProgressBar';
import Rating from "react-rating";
import 'bootstrap/dist/css/bootstrap.min.css';

const TotalReviews = () =>{
    return (
        <div className={styles.averagecontainer}>
            <div className={styles.averagerating}>4.5</div>
            <div className={styles.averagestars}>
            <Rating className={styles.rating}
                    fractions={10} 
                    initialRating={ 4.5 }
                    emptySymbol={(<Star className={styles.staremptysmall}></Star>)} 
                    fullSymbol={(<Star className={styles.starfullsmall}></Star>)}
                    readonly
                >
                </Rating>
            </div>
        </div>
    )
}

const ReviewSummary = () =>{
    return (
        <div className={styles.outerdiv}>
            <div className={styles.innergrid}>
                <div className={styles.one}>5</div>
                <div className={styles.star1}><Star className={styles.starempty}></Star></div>
                <div className={styles.bar1}><ProgressBar className={styles.progbar} variant="warning" now={90}></ProgressBar></div>
                <div className={styles.two}>4</div>
                <div className={styles.star2}><Star className={styles.starempty}></Star></div>
                <div className={styles.bar2}><ProgressBar className={styles.progbar} variant="warning" now={5}></ProgressBar></div>
                <div className={styles.three}>3</div>
                <div className={styles.star3}><Star className={styles.starempty}></Star></div>
                <div className={styles.bar3}><ProgressBar className={styles.progbar} variant="warning" now={3}></ProgressBar></div>

                <div className={styles.four}>2</div>
                <div className={styles.star4}><Star className={styles.starempty}></Star></div>
                <div className={styles.bar4}><div><ProgressBar className={styles.progbar} variant="warning" now={2}></ProgressBar></div></div>

                <div className={styles.five}>1</div>
                <div className={styles.star5}><Star className={styles.starempty}></Star></div>
                <div className={styles.bar5}><ProgressBar className={styles.progbar} variant="warning" now={1}></ProgressBar></div>

            </div>
        <TotalReviews></TotalReviews>
        </div>
    )

}

export default ReviewSummary;

