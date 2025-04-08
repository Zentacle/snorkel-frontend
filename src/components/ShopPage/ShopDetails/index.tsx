import SectionTitle from 'components/SectionTitle';
import styles from './styles.module.css';
import Map from 'icons/Map';
import Hours from '../Hours';
import Phone from 'icons/Phone';
import Calendar from 'icons/Calendar';

interface JsonData {
  coursesOffered?: string[];
  images?: string[];
  languages?: string[];
  rentals?: string[];
  diveTypes?: string[];
  features?: string[];
}

interface Props {
  name: string;
  email?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  hours: any;
  description: string;
  city?: string;
  state?: string;
  country?: string;
  full_address?: string;
  website?: string;
  json_data: JsonData;
}

function ShopDetails({ json_data = {}, ...props }: Props) {
  const renderHours = () => {
    let currentDay = new Date().getDay();
    let dayString = '';
    let currentHours = '';

    switch (currentDay) {
      case 0:
        dayString = 'Sunday';
        break;
      case 1:
        dayString = 'Monday';
        break;
      case 2:
        dayString = 'Tuesday';
        break;
      case 3:
        dayString = 'Wednesday';
        break;
      case 4:
        dayString = 'Thursday';
        break;
      case 5:
        dayString = 'Friday';
        break;
      case 6:
        dayString = 'Saturday';
        break;
    }
    for (let i = 0; i < 7; i++) {
      if (
        props.hours[i].shopDayName.toLowerCase() === dayString.toLowerCase()
      ) {
        currentHours = `${props.hours[i].shopDayName} ${props.hours[i].shopHourOpen} - ${props.hours[i].shopHourClose}`;
      }
    }
    return <div>{currentHours}</div>;
  };

  return (
    <div className={styles.container}>
      <div className={styles.shopHeader}>
        <div className={styles.shopInfo}>
          {!!json_data.features?.length && (
            <div className={styles.badge}>PADI 5 Star IDC</div>
          )}
          <div className={styles.shopAddress}>{props.full_address}</div>
          <div className={styles.shopContact}>
            <div className={styles.contactItem}>
              <span className={styles.icon}></span>
              <span>{props.phone}</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.icon}></span>
              <span>{props.email}</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.icon}></span>
              <a
                href={props.website}
                target="_blank"
                style={{ textDecoration: 'none' }}
              >
                {props.website}
              </a>
            </div>
          </div>
          {/* <div className={styles.socialLinks}>
            <a href="#" className={styles.socialIcon}>
              FB
            </a>
            <a href="#" className={styles.socialIcon}>
              IG
            </a>
            <a href="#" className={styles.socialIcon}>
              TW
            </a>
            <a href="#" className={styles.socialIcon}>
              TR
            </a>
          </div> */}
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.contentMain}>
          <div className={styles.aboutSection}>
            <h2 className={styles.sectionTitle}>About Us</h2>
            <p dangerouslySetInnerHTML={{ __html: props.description }} />

            <div style={{ marginTop: '20px' }}>
              <a href={props.website} className={styles.button}>
                Website
              </a>
              <a
                href={props.website}
                className={`${styles.button} ${styles.secondary}`}
                style={{ marginLeft: '10px' }}
              >
                Book a Dive
              </a>
            </div>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureTitle}>
                <div className={styles.featureIcon}>●</div>
                <h3>Equipment Rentals</h3>
              </div>
              <p>
                We offer a wide range of dive equipment rentals for divers of
                all levels.
              </p>
              <div className={styles.tagList}>
                {json_data.rentals?.map((rental) => (
                  <span key={rental} className={styles.tag}>
                    {rental}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureTitle}>
                <div className={styles.featureIcon}>●</div>
                <h3>Dive Sites</h3>
              </div>
              <p>
                Explore beautiful dive sites with our experienced instructors.
              </p>
              <div className={styles.tagList}>
                {json_data.diveTypes?.map((dive) => (
                  <span key={dive} className={styles.tag}>
                    {dive}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.sidebarSection}>
              <h3 className={styles.sectionTitle}>Location</h3>
              {/* <div className={styles.mapContainer}>
                <Map></Map>
              </div> */}
              <p style={{ marginTop: '15px' }}>
                <strong>Address:</strong>
                {props.full_address}
              </p>
            </div>

            <div className={styles.sidebarSection}>
              <h3 className={styles.sectionTitle}>Languages</h3>
              <div className={styles.tagList}>
                {json_data.languages?.map((language) => (
                  <span key={language} className={styles.tag}>
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className={styles.aboutSection}>
            <h2 className={styles.sectionTitle}>Gallery</h2>
            <div className="gallery">
              {json_data.images?.map((image) => (
                <div className="gallery-item">
                  <img
                    src="/api/placeholder/150/150"
                    alt="Dive shop gallery image"
                  />
                </div>
              ))}
            </div>
          </div>

          {!!json_data.coursesOffered && (
            <div className={styles.aboutSection}>
              <h2 className={styles.sectionTitle}>Our PADI Courses</h2>
              <div className={styles.coursesList}>
                {json_data.coursesOffered.map((course) => (
                  <div key={course} className={styles.courseItem}>
                    {course}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.sectioncontainer}>
          <div className={styles.icon}>
            <Calendar></Calendar>
          </div>
          <div className={styles.content}>
            <span className={styles.title}>Hours</span>
            <div className={styles.description}>
              <div>
                {props.hours ? (
                  <Hours hours={props.hours} />
                ) : (
                  <div>No hours reported</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopDetails;
