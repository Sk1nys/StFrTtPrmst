import Benefits from '../Components/Benefits';
import Header from '../Components/Header'
// import ButtonSquish from '../Components/Buttons/ButtonSquish'
import MainPageSlider from '../Components/MainPageSlider'
import styles from './styles/MainPage.module.css'
const MainPage = () => {

  const updateHeight = () => {
    const ScreenHeight = window.innerHeight;
    document.documentElement.style.setProperty(
      "--screen-height",
      `${ScreenHeight}px`
    );
  };

  updateHeight();

  return (
    <>
<Header/>
{/* <ButtonSquish>BOMB KYEV</ButtonSquish> */}
<div className={styles.main_container}>
  <div className={styles.grid_container}>
  <MainPageSlider ClassName={styles.slider} />
  <div className={styles.description}> 
    <h1 className={styles.descriptionHead}>Кто мы?</h1>
   <p className={styles.descriptionPar}>
   Мы небольшая группа программистов, которая хочет облегчить и усовершенствовать представление о тестах.
   Мы хотим чтобы проходить тесты было не скучно и их создание не занимало много времени.
    </p> </div>
  <div className={styles.bottom_block}>
    <h1 className={styles.BotBlockHead}>О проекте</h1>
<p className={styles.BotBlockPar}> Наш проект даёт возможность учителям, преподавателям, компаниям и т.п. облегчить работа с тестами. На сайте есть возможность не только создавать тесты в редакторе ну и загружать их из Word’а что облегчит работу по переносу старых тестов на наш более удобный и практичный проект. Но это ещё не все чтобы увидеть на что способен наш сайт вы можете пройти тест который создали мы и убедиться что мы не врём.</p>
  </div>
  </div>


  <Benefits/>
</div>

    </>
  )
}

export default MainPage