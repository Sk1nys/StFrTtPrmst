import InputAuth from '../Components/InputAuth'
import styles from './styles/AuthPage.module.css'

const AuthPage = () => {
  return (
    <form className={styles.formAuth}>
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
        <input type="submit"/>
    </form>
  )
}

export default AuthPage