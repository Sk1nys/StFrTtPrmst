import InputAuth from '../Components/InputAuth'
import styles from './styles/AuthPage.module.css'
const AuthPage = () => {
  return (
    
    <div className={styles.formContainer}>
      <h1>РЕГИСТРАЦИЯ</h1>
    <form className={styles.formAuth} method='post'>
        {/* Имя */}
        <InputAuth></InputAuth>
        {/* Фамилия */}
        <InputAuth></InputAuth>
        {/* Никнейм */}
        <InputAuth></InputAuth>
        {/* Емаил */}
        <InputAuth></InputAuth>
        {/* Пароль */}
        <InputAuth></InputAuth>
        {/* Повтор пароля */}
        <InputAuth></InputAuth>
        <input type="submit" className={styles.subb}/>
    </form>
    </div>
  )
}

export default AuthPage