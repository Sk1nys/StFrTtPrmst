import Benefits from '../Components/Benefits';
// import Footer from '../Components/Footer';
import Header from '../Components/Header'
import MainPageSlider from '../Components/MainPageSlider'
import styles from './styles/MainPage.module.scss'
import  { useRef, useEffect, useState } from 'react';
import scissors from '../assets/scissors.svg';
const MainPage = () => {
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const bottomBlockRef = useRef<HTMLDivElement | null>(null);
  const [isDescriptionHovered, setIsDescriptionHovered] = useState(false);
  const [isBottomBlockHovered, setIsBottomBlockHovered] = useState(false);
  const scissorsRef = useRef<HTMLImageElement | null>(null);
// const scissorsRefEnd = useRef<HTMLImageElement | null>(null);

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
  const handleMouseEnterDescription = () => {
    if (!isBottomBlockHovered && bottomBlockRef.current) {
      bottomBlockRef.current.style.filter = 'blur(20px)';
      bottomBlockRef.current.style.transition = '0.5s ease-in-out';
      bottomBlockRef.current.style.transform = 'scale(0.9)';
      bottomBlockRef.current.style.opacity = '0.5';
    setIsDescriptionHovered(true);
    }
  };

  const handleMouseLeaveDescription = () => {
    if (bottomBlockRef.current) {
      bottomBlockRef.current.style.filter = '';
      bottomBlockRef.current.style.transform = '';
      bottomBlockRef.current.style.opacity = '';
    }
    setIsDescriptionHovered(false);
  };

  const handleMouseEnterBottomBlock = () => {
    if (!isDescriptionHovered && descriptionRef.current) {
      descriptionRef.current.style.filter = 'blur(20px)';
      descriptionRef.current.style.transition = '0.5s ease-in-out';
      descriptionRef.current.style.transform = 'scale(0.9)';
      descriptionRef.current.style.opacity = '0.5';
    setIsBottomBlockHovered(true);
    }
  };

  const handleMouseLeaveBottomBlock = () => {
    if (descriptionRef.current) {
      descriptionRef.current.style.filter = '';
      descriptionRef.current.style.transform = '';
      descriptionRef.current.style.opacity = '';
    }
    setIsBottomBlockHovered(false);
  };


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
      if (scissorsRef.current && newPosition*2 < document.body.offsetWidth) {
        scissorsRef.current.style.transform = `translateX(${newPosition*1.9}px)`;
      }
      // const newPositionEnd = lineWidth * (1 - scrollPercentage);
      // if(scissorsRefEnd.current && newPositionEnd*2 < document.body.offsetWidth){
      //   scissorsRefEnd.current.style.transform= `translateX(${newPositionEnd*2}px)`;
      // }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lineWidth]);
  return (
    <>
<Header/>
<main className={styles.main_container}>
  <div className={styles.grid_container}>
  <MainPageSlider ClassName={styles.slider} />
  <div 
  className={`${styles.description} ${isDescriptionHovered ? styles.expanded : ''}`}
   ref={descriptionRef}
   onMouseEnter={handleMouseEnterDescription}
   onMouseLeave={handleMouseLeaveDescription}> 
    <h1 className={styles.descriptionHead}>Кто мы?</h1>
   <p className={styles.descriptionPar}>
   Мы небольшая группа программистов, которая хочет облегчить и усовершенствовать представление о тестах.
   Мы хотим чтобы проходить тесты было не скучно и их создание не занимало много времени.
    </p> </div>
  <div className={`${styles.bottom_block} ${isBottomBlockHovered ? styles.expanded : ''}`}
  ref={bottomBlockRef}
  onMouseEnter={handleMouseEnterBottomBlock}
  onMouseLeave={handleMouseLeaveBottomBlock}>
    <h1 className={styles.BotBlockHead}>О проекте</h1>
<p className={styles.BotBlockPar}> Наш проект даёт возможность учителям, преподавателям, компаниям и т.п. облегчить работа с тестами. На сайте есть возможность не только создавать тесты в редакторе ну и загружать их из Word’а что облегчит работу по переносу старых тестов на наш более удобный и практичный проект. Но это ещё не все чтобы увидеть на что способен наш сайт вы можете пройти тест который создали мы и убедиться что мы не врём.</p>
  </div>
  </div>
  <div className={styles.scroll_container}>
  <div ref={lineRef} className={styles.dashed_line}></div>
  <img 
  src={scissors}
   alt="" 
  className={styles.scissors}
  ref={scissorsRef}
  />
  <Benefits/>
 <div ref={lineRef} className={styles.dashed_line_end}></div>
  {/*  <img 
  src={scissors}
   alt="" 
  className={styles.scissorsEnd}
  ref={scissorsRefEnd}
  /> */}
  </div>
</main>
{/* <Footer/> */}
    </>
  )
}

export default MainPage