import Logo from '../../assets/logo.svg'
import styles from '../Header/Header.module.css'
import { Link } from "react-router-dom";
import ButtonSquish from '../Buttons/ButtonSquish'
const Header = () => {
  return (
    <header className={styles.container_header}>
        <div className={styles.header}>
        <Link to="/" className={styles.link}>
        <ButtonSquish className={styles.header_button}>СОЗДАТЬ ТЕСТ</ButtonSquish>
        
        </Link>
            <Link to="/" className={styles.link}>
            <ButtonSquish className={styles.header_button}>СПИСОК ТЕСТОВ</ButtonSquish>

            </Link>
            <div className={styles.logo}><img src={Logo} alt="" /> <h3>TESTIX🎀</h3></div>
            <Link to="/" className={styles.link}>
            <ButtonSquish className={styles.header_button}>НАШ ТЕСТ</ButtonSquish> 
            </Link>
           <Link to="/auth" className={styles.link}>
          <ButtonSquish className={styles.header_button}>ВОЙТИ</ButtonSquish>
           </Link>
        </div>
    </header>
  )
}

export default Header