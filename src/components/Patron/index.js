import * as ga from 'lib/ga';
import SectionTitle from 'components/SectionTitle';
import styles from './styles.module.css';

const Patron = (props) => (
  <div>
      <SectionTitle text={`${props.name} Patrons`} />
      <div className={styles.description}>
          <a
              onClick={ () => { ga.event({ action: "purchase", params: { eventLabel: 'Kona Shore Divers' } })} }
              className={styles.patronName}
              href="https://www.konashoredivers.com"
          >Kone Shore Divers</a>
          <span> - Our goal is to give you the opportunity to share and explore the underwater world in and around the near shore waters of Kailua-Kona. We focus on small group sizes and strive to offer the best personalized service we can to our guests. From the first timer to the old timer come with us and see what the Kona Shore has to offer!</span>
      </div>
  </div>
)

export default Patron;