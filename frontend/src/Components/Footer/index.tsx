import React from 'react'
import Logo from '../../assets/logo.svg'
import styles from "../Footer/Footer.module.css"
import { Link } from "react-router-dom";
const Footer = () => {
  const handlerScrollUp = () => {
		if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
			window.scrollBy(0, -15000);
			
		}
	}
  return (
    <div className={styles.footer}>
        <div className={styles.logo}><img src={Logo} alt="" /> <h3>TESTIX🎀</h3></div>
        <ul>
          <h3>НАВИГАЦИЯ</h3>
          <ul>
          <li><Link to="/create" className={styles.link}>СОЗДАТЬ ТЕСТ</Link></li>
          <li><Link to="/list" className={styles.link}>СЕПИСОК ТЕСТОВ</Link></li>
          <li><Link to="/auth" className={styles.link}>ВОЙТИ</Link></li>
          <li><Link to="/proftest" className={styles.link}>НАШ ТЕСТ</Link></li></ul>
        </ul>
        <ul>
          <h3>ОБРАТНАЯ СВЯЗЬ</h3>
          <ul>
          <li>УЛ.ЧЁРНАЯ Д.1 КВ.1</li>
          <li>+7 (999) 420-44-20</li>
          <li>TESTIXOFF@GMAIL.COM</li>
          <li>©2021-2025 TESTIX. ВСЕ ПРАВА ЗАЩИЩЕНЫ</li></ul>
        </ul>
        <div className={styles.linkis}>
          <div className={styles.vk}></div>
          <div className={styles.tg}></div>
        </div>
        <div className={styles.ups} onClick={handlerScrollUp}></div>
    </div>
  )
}

export default Footer