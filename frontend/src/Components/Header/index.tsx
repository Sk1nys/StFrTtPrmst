import React, { useEffect, useState } from 'react';
import Logo from '../../assets/logo.svg';
import styles from '../Header/Header.module.css';
import { Link } from 'react-router-dom';
import ButtonSquish from '../Buttons/ButtonSquish';
import { useCookies } from 'react-cookie';
import ButtonAroundBorder from '../Buttons/ButtonAroundBorder';
import CryptoJS from 'crypto-js';

interface HeaderProps {
  isBurgerOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ isBurgerOpen }) => {
  const [cookies] = useCookies(['username', 'id']);
  const [decryptedUsername, setDecryptedUsername] = useState<string | null>(null);
  const [decryptedUserId, setDecryptedUserId] = useState<string | null>(null);

  const decrypt = (text: string) => {
    const bytes = CryptoJS.AES.decrypt(text, 'secret-key');
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  useEffect(() => {
    if (cookies.username && cookies.id) {
      setDecryptedUsername(decrypt(cookies.username));
      setDecryptedUserId(decrypt(cookies.id));
    }
  }, [cookies]);
  
  
  const [isBurger, setIsBurger] = useState(false);
  useEffect(() => {
    if (document.body.clientWidth < 1149) {
      setIsBurger(true);
    }
  }, []);
  return (
    <header
      className={`${styles.container_header} ${
        isBurgerOpen ? styles.headerOpen : styles.headerClosed
      }`}
    >
      <div className={styles.header}>
      {isBurger? <div className={styles.logocon}><div className={styles.logoMb}><img src={Logo} alt="" /> <h3>TESTIX</h3></div></div>:<div className={styles.logo}><img src={Logo} alt="" /> <h3>TESTIX</h3></div> }
      {isBurger? <div className={styles.altLinkis}>
        <Link to="/create" className={styles.link}>
        {isBurger? <ButtonAroundBorder children='Создать тест'/> :  <button className={styles.header_button}><span>СОЗДАТЬ ТЕСТ</span></button>}
        
        </Link>
        <Link to="/list" className={styles.link}>
            {isBurger? <ButtonAroundBorder children='Список тестов'/> :    <button className={styles.header_button}><span>СПИСОК ТЕСТОВ</span></button>}

            </Link>
            
             
            
            <Link to="/proftest" className={styles.link}>
            {isBurger? <ButtonAroundBorder children='Наш тест'/> :     <button className={styles.header_button}><span>НАШ ТЕСТ</span></button> }
            </Link>
      </div> : <div className={styles.linkisHead}>
        <Link to="/create" className={styles.link}>
        {isBurger? <ButtonAroundBorder children='Создать тест'/> :  <button className={styles.header_button}><span>СОЗДАТЬ ТЕСТ</span></button>}
        
        </Link>
        <Link to="/list" className={styles.link}>
            {isBurger? <ButtonAroundBorder children='Список тестов'/> :    <button className={styles.header_button}><span>СПИСОК ТЕСТОВ</span></button>}

            </Link>
            
             
            
            <Link to="/proftest" className={styles.link}>
            {isBurger? <ButtonAroundBorder children='Наш тест'/> :     <button className={styles.header_button}><span>НАШ ТЕСТ</span></button> }
            </Link>
            </div>}
            <Link to={decryptedUsername === 'admin' ? '/admin' : decryptedUsername ? `/profile` : '/auth'} className={styles.link}>
    {decryptedUsername === 'admin' ? (
        isBurger ? (
            <ButtonAroundBorder>admin</ButtonAroundBorder>
        ) : (
            <button className={styles.header_button}><span>АДМИНИСТРАЦИЯ</span></button>
        )
    ) : decryptedUsername ? (
        isBurger ? (
            <ButtonAroundBorder>{decryptedUsername}</ButtonAroundBorder>
        ) : (
            <button className={styles.header_button}><span>{decryptedUsername}</span></button>
        )
    ) : (
        isBurger ? (
            <ButtonAroundBorder>Войти</ButtonAroundBorder>
        ) : (
            <button className={styles.header_button}><span>ВОЙТИ</span></button>
        )
    )}
</Link>

      </div>
    </header>
  );
};

export default Header;
