import styles from './styles.module.css';
import Image from 'next/image';

import {
  Dropdown,
  Item,
  Trigger,
} from 'controls/Dropdown';
import { sendEvent } from 'hooks/amplitude';

interface FilterPillProps {
  children: React.ReactNode;
  text: string;
}

const FilterPill = (props: FilterPillProps) => (
  <Dropdown
    align="start"
    trigger={
      <Trigger>
        <div
          className={styles.filterPill}
        >
          <span className={styles.filterPillText}>
            {props.text}
          </span>
          <Image src="/down_caret.png" height={16} width={16} />
        </div>
      </Trigger>
    }
    onOpenChange={(open) => {
      if (open) {
        sendEvent(`click__filter_${props.text.toLowerCase()}`)
      }
    }}
  >
    {props.children}
  </Dropdown>
)

const FilterBar = () => {
  return (
    <div className={styles.filterContainer}>
      <FilterPill text='Difficulty'>
        <>
          <Item>
            Beginner
          </Item>
          <Item>
            Intermediate
          </Item>
          <Item>
            Advanced
          </Item>
        </>
      </FilterPill>
      <FilterPill text='Activity'>
        <>
          <Item>
            Snorkel
          </Item>
          <Item>
            Scuba
          </Item>
          <Item>
            Freedive
          </Item>
        </>
      </FilterPill>
      <FilterPill text='Entry'>
        <>
          <Item>
            Shore
          </Item>
          <Item>
            Boat
          </Item>
        </>
      </FilterPill>
    </div >
  )
}

export default FilterBar;
