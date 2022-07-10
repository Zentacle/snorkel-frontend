import styles from './styles.module.css';
import Image from 'next/image';

import {
  Dropdown,
  Item,
  Trigger,
} from 'controls/Dropdown';
import { sendEvent } from 'hooks/amplitude';

const FilterBar = () => {
  return (
    <div className={styles.filterContainer}>
      <Dropdown
        trigger={
          <Trigger>
            <div
              className={styles.filterPill}
              onClick={() => sendEvent('filter_difficulty')}
            >
              <span className={styles.filterPillText}>
                Difficulty
              </span>
              <Image src="/down_caret.png" height={16} width={16} />
            </div>
          </Trigger>
        }
      >
        <Item>
          Beginner
        </Item>
        <Item>
          Intermediate
        </Item>
        <Item>
          Advanced
        </Item>
      </Dropdown>
      <Dropdown
        trigger={
          <Trigger>
            <div
              className={styles.filterPill}
              onClick={() => sendEvent('filter_activity')}
            >
              <span className={styles.filterPillText}>
                Activity
              </span>
              <Image src="/down_caret.png" height={16} width={16} />
            </div>
          </Trigger>
        }
      >
        <Item>
          Snorkel
        </Item>
        <Item>
          Scuba
        </Item>
        <Item>
          Freedive
        </Item>
      </Dropdown>
      <Dropdown
        trigger={
          <Trigger>
            <div
              className={styles.filterPill}
              onClick={() => sendEvent('filter_entry')}
            >
              <span className={styles.filterPillText}>
                Entry
              </span>
              <Image src="/down_caret.png" height={16} width={16} />
            </div>
          </Trigger>
        }
      >
        <Item>
          Shore
        </Item>
        <Item>
          Boat
        </Item>
      </Dropdown>
    </div>
  )
}

export default FilterBar;
