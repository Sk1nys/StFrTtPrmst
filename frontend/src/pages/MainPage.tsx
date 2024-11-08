import Benefits from '../Components/Benefits';
import Header from '../Components/Header'
import styles from './styles/MainPage.module.scss'
import  { useRef, useEffect, useState } from 'react';
import scissors from '../assets/scissors.svg';
import NeedStay from '../Components/NeedStay';
import Footer from '../Components/Footer';
import { HeightProvider } from '../Components/HeightContext';
import FirstScreen from '../Components/FirstScreen';

const MainPage = () => {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const scissorsRef = useRef<HTMLImageElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const [lineWidth, setLineWidth] = useState<number>(0);

  const updateHeight = () => {
    const ScreenHeight = window.innerHeight;
    document.documentElement.style.setProperty(
      "--screen-height",
      `${ScreenHeight}px`
    );
  };
  updateHeight();

  useEffect(() => {
    if (lineRef.current) {
      setLineWidth(lineRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (lineRef.current) {
        setLineWidth(lineRef.current.offsetWidth);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      const newPosition = lineWidth * scrollPercentage;
      if (scissorsRef.current && newPosition * 2 < document.body.offsetWidth) {
        scissorsRef.current.style.transform = `translateX(${newPosition * 4}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lineWidth]);

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
          <div className={styles.scroll_container}>
            <div ref={lineRef} className={styles.dashed_line}></div>
            <img
              src={scissors}
              alt=""
              className={styles.scissors}
              ref={scissorsRef}
            />
            <Benefits />
            <div ref={lineRef} className={styles.dashed_line_end}></div>
          </div>
          <NeedStay />
        </HeightProvider>
      </main>
      <Footer />
    </>
  );
};

export default MainPage;
