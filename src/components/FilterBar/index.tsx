import styles from './styles.module.css';
import Image from 'next/image';
import React from 'react';

import {
  Dropdown,
  Item,
  Trigger,
} from 'controls/Dropdown';
import { sendEvent } from 'hooks/amplitude';

interface FilterPillProps {
  children: React.ReactNode;
  text: string;
  selected?: boolean;
}

const FilterPill = (props: FilterPillProps) => (
  <Dropdown
    align="start"
    trigger={
      <Trigger>
        <div
          className={`${styles.filterPill} ${props.selected ? styles.selected : ''}`}
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

interface Props {
  onSelect: (difficulty?: string, access?: string) => void;
}

const FilterBar = (props: Props) => {
  const [difficulty, setDifficulty] = React.useState<string | undefined>(undefined);
  const [access, setAccess] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    props.onSelect(difficulty, access)
  }, [difficulty, access])

  return (
    <div className={styles.filterContainer}>
      <FilterPill text='Difficulty' selected={!!difficulty}>
        <>
          <Item onClick={() => setDifficulty('beginner')}>
            Beginner
          </Item>
          <Item onClick={() => setDifficulty('intermediate')}>
            Intermediate
          </Item>
          <Item onClick={() => setDifficulty('advanced')}>
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
      <FilterPill text='Entry' selected={!!access}>
        <>
          <Item onClick={() => setAccess('shore')}>
            Shore
          </Item>
          <Item onClick={() => setAccess('boat')}>
            Boat
          </Item>
        </>
      </FilterPill>
    </div >
  )
}

export default FilterBar;
