import styles from "./styles.module.css";

const InputArea = ({ value, onChange, type }) => {
  return (
          <input
              value={value}
              onChange={ e => onChange(e.target.value) }
              className={styles.inputs}
              placeholder={type}
              type={type}
          />
  )
}

export default InputArea