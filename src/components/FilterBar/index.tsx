import styles from './styles.module.css';
import Image from 'next/image';

import {
  Dropdown,
  Item,
  Trigger,
} from 'controls/Dropdown';
import { sendEvent } from 'hooks/amplitude';

interface FilterPillProps {
  text: string;
}

const FilterPill = (props: FilterPillProps) => (
  <div
    className={styles.filterPill}
    onClick={() => sendEvent(`click__filter_${props.text.toLowerCase()}`)}
  >
    <span className={styles.filterPillText}>
      {props.text}
    </span>
    <Image src="/down_caret.png" height={16} width={16} />
  </div>
)

const FilterBar = () => {
  return (
    <div className={styles.filterContainer}>
      <Dropdown
        trigger={
          <Trigger>
            <FilterPill text='Difficulty' />
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
            <FilterPill text='Activity' />
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
            <FilterPill text='Entry' />
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
