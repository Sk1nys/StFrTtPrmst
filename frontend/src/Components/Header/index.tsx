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
        <Link to={decryptedUsername ? '/create' : '/auth'} className={styles.link}>
          {decryptedUsername ? (
            isBurger ? (
              <ButtonAroundBorder>СОЗДАТЬ ТЕСТ</ButtonAroundBorder>
            ) : (
              <ButtonSquish className={styles.header_button}>СОЗДАТЬ ТЕСТ</ButtonSquish>
            )
          ) : (
            isBurger ? (
              <ButtonAroundBorder>СОЗДАТЬ ТЕСТ</ButtonAroundBorder>
            ) : (
              <ButtonSquish className={styles.header_button}>СОЗДАТЬ ТЕСТ</ButtonSquish>
            )
          )}
        </Link>
        <Link to={decryptedUsername ? '/list' : '/auth'} className={styles.link}>
          {decryptedUsername ? (
            isBurger ? (
              <ButtonAroundBorder>СПИСОК ТЕСТОВ</ButtonAroundBorder>
            ) : (
              <ButtonSquish className={styles.header_button}>СПИСОК ТЕСТОВ</ButtonSquish>
            )
          ) : (
            isBurger ? (
              <ButtonAroundBorder>СПИСОК ТЕСТОВ</ButtonAroundBorder>
            ) : (
              <ButtonSquish className={styles.header_button}>СПИСОК ТЕСТОВ</ButtonSquish>
            )
          )}
        </Link>

        {isBurger ? (
          <div className={styles.logocon}>
            <div className={styles.logoMb}>
              <img src={Logo} alt="" /> <h3>TESTIX🎀</h3>
            </div>
          </div>
        ) : (
          <div className={styles.logo}>
            <img src={Logo} alt="" /> <h3>TESTIX🎀</h3>
          </div>
        )}

        <Link to={decryptedUsername ? '/proftest' : '/auth'} className={styles.link}>
          {decryptedUsername ? (
            isBurger ? (
              <ButtonAroundBorder>НАШ ТЕСТ</ButtonAroundBorder>
            ) : (
              <ButtonSquish className={styles.header_button}>НАШ ТЕСТ</ButtonSquish>
            )
          ) : (
            isBurger ? (
              <ButtonAroundBorder>НАШ ТЕСТ</ButtonAroundBorder>
            ) : (
              <ButtonSquish className={styles.header_button}>НАШ ТЕСТ</ButtonSquish>
            )
          )}
        </Link>

        <Link to={decryptedUsername ? `/profile/${decryptedUserId}` : '/auth'} className={styles.link}>
          {decryptedUsername ? (
            isBurger ? (
              <ButtonAroundBorder>{decryptedUsername}</ButtonAroundBorder>
            ) : (
              <ButtonSquish className={styles.header_button}>{decryptedUsername}</ButtonSquish>
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
  );
};

export default Header;
