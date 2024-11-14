import Benefits from '../Components/Benefits';
import Header from '../Components/Header'
import styles from './styles/MainPage.module.scss'
import  { useState } from 'react';
import NeedStay from '../Components/NeedStay';
import Footer from '../Components/Footer';
import { HeightProvider } from '../Components/HeightContext';
import FirstScreen from '../Components/FirstScreen';

const MainPage = () => {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
 

  const updateHeight = () => {
    const ScreenHeight = window.innerHeight;
    document.documentElement.style.setProperty(
      "--screen-height",
      `${ScreenHeight}px`
    );
  };
  updateHeight();

 

  const toggleBurger = () => {
    setIsBurgerOpen((prevIsBurgerOpen) => !prevIsBurgerOpen);
  };

  return (
    <>
      <div
        className={`${styles.burger} ${
          isBurgerOpen ? styles.burgerClosed : ""
        }`}
        onClick={toggleBurger}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <Header isBurgerOpen={isBurgerOpen} />

      <main className={styles.main_container}>
        <HeightProvider>
          <FirstScreen id="firstScreen" />
         
            <Benefits />
           
          <NeedStay />
        </HeightProvider>
      </main>
      <Footer />
    </>
  );
};

export default MainPage;
