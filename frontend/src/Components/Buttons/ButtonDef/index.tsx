import React from 'react'
import styles from './ButtonDef.module.css'
interface ButtonDefProps{
  children?: string;
}
const ButtonDef: React.FC<ButtonDefProps> = ({children}) => {
  return (
    <button className={styles.btnDef}>
      {children}
      </button>
  )
}

export default ButtonDef