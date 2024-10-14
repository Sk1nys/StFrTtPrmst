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
<div className={styles.top_part}></div>
<div className={styles.bottom_part}></div>
<div className={styles.right_part}></div>
  </div>
  </div>
</div>

    </>
  )
}

export default MainPage