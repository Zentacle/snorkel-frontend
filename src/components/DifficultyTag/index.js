import styles from './styles.module.css';

const DifficultyTag = ({difficulty}) => {
  let difficultyClassName = styles.undetermined
    switch (difficulty) {
        case 'advanced':
            difficultyClassName = styles.advanced;
            break;
        case 'intermediate':
            difficultyClassName = styles.intermediate;
            break;
        case 'beginner':
            difficultyClassName = styles.beginner;
            break;
    }
  return (
    <span className={difficultyClassName}>{difficulty || 'Not ranked yet'}</span>
  )
}

export default DifficultyTag;
