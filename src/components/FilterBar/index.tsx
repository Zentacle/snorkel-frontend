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
  access?: string;
  activity?: string;
  difficulty?: string;
  setAccess: (access: string) => void;
  setActivity: (activity: string) => void;
  setDifficulty: (difficulty: string) => void;
}

const FilterBar = ({
  access,
  activity,
  difficulty,
  setAccess,
  setActivity,
  setDifficulty,
}: Props) => (
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
    <FilterPill text='Activity' selected={!!activity}>
      <>
        <Item onClick={() => setActivity('snorkel')}>
          Snorkel
        </Item>
        <Item onClick={() => setActivity('scuba')}>
          Scuba
        </Item>
        <Item onClick={() => setActivity('freedive')}>
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

export default FilterBar;
