import Logo from '../../assets/logo.svg'
import styles from '../Header/Header.module.css'
import { Link } from "react-router-dom";
import ButtonSquish from '../Buttons/ButtonSquish'
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import ButtonAroundBorder from '../Buttons/ButtonAroundBorder';
interface HeaderProps {
  isBurgerOpen: boolean;
}
const Header:  React.FC<HeaderProps> = ({ isBurgerOpen }) => {
  const [cookies] = useCookies(['username','id']);
  const userId = cookies.id;

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


            <Link to={cookies.username ? `/profile/${userId}` : "/auth"} className={styles.link}>
      {cookies.username ? (
        isBurger ? (
          <ButtonAroundBorder>{cookies.username}</ButtonAroundBorder>
        ) : (
          <ButtonSquish className={styles.header_button}>{cookies.username}</ButtonSquish>
        )
      ) : (
        isBurger ? (
          <ButtonAroundBorder>Войти</ButtonAroundBorder>
        ) : (
          <ButtonSquish className={styles.header_button}>ВОЙТИ</ButtonSquish>
        )
      )}
    </Link>
        </div>
    </header>
  )
}

export default Header