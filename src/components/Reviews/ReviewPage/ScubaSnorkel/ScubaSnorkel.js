import styles from "./ScubaSnorkel.module.css";
import { ButtonGroup, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
const ScubaSnorkel = () => {
    return (
        <div className={styles.container}>
           <ButtonGroup>  
               <Button className={styles.button} variant="secondary">Scuba</Button>
                <Button className={styles.button} variant="secondary">Snorkel</Button>
                </ButtonGroup>
            
        </div>
    )
}

export default ScubaSnorkel;