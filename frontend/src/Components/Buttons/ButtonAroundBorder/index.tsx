import React from 'react'
import styles from './ButtonAroundBorder.module.css'
interface ButtonAroundBorderProps{
  children?: string;
}
const ButtonAroundBorder: React.FC<ButtonAroundBorderProps> = ({children}) => {
  return (
    <button className={styles.btnAround}><span>
      {children}
      </span></button>
  )
}

export default ButtonAroundBorder