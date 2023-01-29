import React, { InputHTMLAttributes } from "react";
import styles from "./styles.module.css";

interface Props {
  onChange: (value: string) => void;
  type?: string;
  value: string;
}

const InputArea = ({ value, onChange, type }: Props) => {
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