import Logo from '../../assets/logo.svg'
import styles from '../Header/Header.module.css'
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <header className={styles.container_header}>
        <div className={styles.header}>
            <a className={styles.header_button}>Создать тест</a>
            <a className={styles.header_button}>Список тестов</a>
            <div className={styles.logo}><img src={Logo} alt="" /> <h3>TESTIX🎀</h3></div>
            <a className={styles.header_button}>Пройти наш тест</a>
           <Link to="/auth" className={styles.header_button}>
           <a className={styles.header_button}>Войти</a>
           </Link>
        </div>
    </header>
  )
}

export default Header