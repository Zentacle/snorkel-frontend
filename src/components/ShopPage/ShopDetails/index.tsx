import SectionTitle from "components/SectionTitle";
import styles from "./styles.module.css";
import Map from "icons/Map";
import Hours from "../Hours";
import Phone from "icons/Phone";
import Calendar from "icons/Calendar";

interface Hours {
    hours: any,
    phone: string,
    address1: string,
    address2: string,
    description: string,
    city: string,
    state: string,
    country: string,
    full_address: string
}

function ShopDetails(props: any) {


    const renderHours = () => {
        let currentDay = new Date().getDay();
        let dayString = ""
        let currentHours = ""

        switch (currentDay) {
            case 0:
                dayString = "Sunday"
                break;
            case 1:
                dayString = "Monday"
                break;
            case 2:
                dayString = "Tuesday"
                break;
            case 3:
                dayString = "Wednesday"
                break;
            case 4:
                dayString = "Thursday"
                break;
            case 5:
                dayString = "Friday"
                break;
            case 6:
                dayString = "Saturday"
                break;
        }
        for (let i = 0; i < 7; i++) {
            if (props.hours[i].shopDayName.toLowerCase() === dayString.toLowerCase()) {
                currentHours = `${props.hours[i].shopDayName} ${props.hours[i].shopHourOpen} - ${props.hours[i].shopHourClose}`
            }
        }
        return (
            <div>{currentHours}</div>
        )
    }


    return (
        <div className={styles.container}>
            <div className={styles.sectioncontainer}>
                <div className={styles.icon}>
                    <Calendar></Calendar>
                </div>
                <div className={styles.content}>
                    <span className={styles.title}>
                        Hours
                    </span>
                    <div className={styles.description}>
                        {/* {props.hours ? renderHours() : "no hours available"} */}
                        <div>
                            {props.hours ?
                                <Hours hours={props.hours}></Hours> :
                                <div>No hours reported
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.sectioncontainer}>
                <div className={styles.icon}>
                    <Phone></Phone>
                </div>
                <div className={styles.content}>
                    <span className={styles.title}>Phone</span>

                    <div className={styles.description}>
                        {props.phone}
                    </div>
                </div>
            </div>
            <div className={styles.sectioncontainer}>
                <div className={styles.icon}>
                    <Map></Map>
                </div>
                <div className={styles.content}>
                    <span className={styles.title}>
                        Address
                    </span>
                    <div className={styles.location}>
                        <span>
                           {props.full_address}
                        </span>
                    </div>
                </div>
            </div>

            <div className={styles.shopinfo}>
                {props.description}
            </div>
        </div>


    )
}

export default ShopDetails;

