import Logo from '../../assets/logo.svg'
import styles from '../Header/Header.module.css'
import { Link } from "react-router-dom";
import ButtonSquish from '../Buttons/ButtonSquish'
import { useEffect, useState } from 'react';
import ButtonAroundBorder from '../Buttons/ButtonAroundBorder';
interface HeaderProps {
  isBurgerOpen: boolean;
}
const Header:  React.FC<HeaderProps> = ({ isBurgerOpen }) => {
  const [isBurger, setIsBurger] = useState(false);
  useEffect(() => {
    return () => {
       if(document.body.clientWidth<1149){
      setIsBurger(true)
    }
    }
  },[])
  return (
    <header className={`${styles.container_header} ${
      isBurgerOpen ? styles.headerOpen : styles.headerClosed
    }`}>
        <div className={styles.header}>
        <Link to="/create" className={styles.link}>
        {isBurger? <ButtonAroundBorder children='Создать тест'/> :  <ButtonSquish className={styles.header_button}>СОЗДАТЬ ТЕСТ</ButtonSquish>}
        
        </Link>
            <Link to="/list" className={styles.link}>
            {isBurger? <ButtonAroundBorder children='Список тестов'/> :    <ButtonSquish className={styles.header_button}>СПИСОК ТЕСТОВ</ButtonSquish>}

            </Link>
            {isBurger? <div className={styles.logocon}><div className={styles.logoMb}><img src={Logo} alt="" /> <h3>TESTIX🎀</h3></div></div>:<div className={styles.logo}><img src={Logo} alt="" /> <h3>TESTIX🎀</h3></div> }
             
            
            <Link to="/proftest" className={styles.link}>
            {isBurger? <ButtonAroundBorder children='Наш тест'/> :     <ButtonSquish className={styles.header_button}>НАШ ТЕСТ</ButtonSquish> }
            </Link>
           <Link to="/auth" className={styles.link}>
           {isBurger? <ButtonAroundBorder children='Войти'/> :    <ButtonSquish className={styles.header_button}>ВОЙТИ</ButtonSquish> }
           </Link>
        </div>
    </header>
  )
}

export default Header