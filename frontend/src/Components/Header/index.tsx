import React from 'react'
import styles from '../Header/Header.module.css'
const Header = () => {
  return (
    <header className={styles.container_header}>
        <div className={styles.header}>
            <button className={styles.header_button}>obama</button>
            <button className={styles.header_button}>trump</button>
            <div className={styles.logo}></div>
            <button className={styles.header_button}>biden</button>
            <button className={styles.header_button}>kamala</button>
        </div>
    </header>
  )
}

export default Header