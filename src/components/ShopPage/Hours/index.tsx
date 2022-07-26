import styles from "./styles.module.css";

export default function Hours(props: any) {


    function getDay(dayName: string) {
        return props.hours.filter((day: any) => {
            return day.shopDayName.toLowerCase() === dayName.toLowerCase()
        })
    }

    function convertTime(time: string): String {
        let finalTime = ''
        let timeValues = time.split(":")
        let milHours = parseInt(timeValues[0])
        let standardHours = milHours % 12


        finalTime = standardHours.toString().trimEnd() + ":" + timeValues[1].padStart(2, '0')
        if (milHours >= 12) {
            finalTime += " PM"
        } else {
            finalTime += " AM"
        }
        return finalTime;
    }

    let mondayHours = getDay("Monday")[0]
    let tuesdayHours = getDay("Tuesday")[0]
    let wednesdayHours = getDay("Wednesday")[0]
    let thursdayHours = getDay("Thursday")[0]
    let fridayHours = getDay("Friday")[0]
    let saturdayHours = getDay("Saturday")[0]
    let sundayHours = getDay("Sunday")[0]



    return (
        <div className={styles.container}>

            <div className={styles.daycontainer}>
                {mondayHours && <span>
                    Monday:
                </span>
                }
                {tuesdayHours && <span>
                    Tuesday:
                </span>}
                {wednesdayHours && <span>
                    Wednesday:
                </span>
                }
                {thursdayHours &&
                    <span>
                        Thursday:
                    </span>
                }
                {fridayHours &&
                    <span>
                        Friday:
                    </span>
                }
                {saturdayHours &&
                    <span>
                        Saturday:
                    </span>
                }
                {sundayHours && <span>
                    Sunday:
                </span>
                }
            </div>
            <div className={styles.hourscontainer}>
                {mondayHours &&
                    <span>
                        {`${convertTime(mondayHours.shopHourOpen)} - ${convertTime(mondayHours.shopHourClose)}`}
                    </span>
                }
                {tuesdayHours &&
                    <span>
                        {`${convertTime(tuesdayHours.shopHourOpen)} - ${convertTime(tuesdayHours.shopHourClose)}`}
                    </span>
                }
                {wednesdayHours &&
                    <span>
                        {`${convertTime(wednesdayHours.shopHourOpen)} - ${convertTime(wednesdayHours.shopHourClose)}`}
                    </span>
                }
                {thursdayHours &&
                    <span>
                        {`${convertTime(thursdayHours.shopHourOpen)} - ${convertTime(thursdayHours.shopHourClose)}`}
                    </span>
                }
                {fridayHours &&
                    <span>
                        {`${convertTime(fridayHours.shopHourOpen)} - ${convertTime(fridayHours.shopHourClose)}`}
                    </span>
                }
                {saturdayHours &&
                    <span>
                        {`${convertTime(saturdayHours.shopHourOpen)} - ${convertTime(saturdayHours.shopHourClose)}`}
                    </span>
                }
                {sundayHours &&
                    <span>
                        {`${convertTime(sundayHours.shopHourOpen)} - ${convertTime(sundayHours.shopHourClose)}`}
                    </span>
                }
            </div>

        </div>
    )
}