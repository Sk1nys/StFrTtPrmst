import  { useRef, useEffect, useState } from 'react';
import { useHeight } from '../HeightContext';
import styles from './FirstScreen.module.css'
import MainPageSlider from '../MainPageSlider'

interface FirstScreenProps {
    id: string;
  }
const FirstScreen: React.FC<FirstScreenProps> = ({id}) => {
  const { setHeight } = useHeight(); 
const blockRef = useRef<HTMLDivElement | null>(null); 
  useEffect(() => { 
    if (blockRef.current) {
      const computedStyle = getComputedStyle(blockRef.current);

      setHeight(id, blockRef.current.offsetHeight +  parseFloat(computedStyle.marginTop) + 
      parseFloat(computedStyle.marginBottom)); 
    }
   }, [id, setHeight]);
      const descriptionRef = useRef<HTMLDivElement | null>(null);
    const bottomBlockRef = useRef<HTMLDivElement | null>(null);
    const [isDescriptionHovered, setIsDescriptionHovered] = useState(false);
    const [isBottomBlockHovered, setIsBottomBlockHovered] = useState(false);
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
  return (
    <>

 <div ref={blockRef} className={styles.grid_container}>
  <MainPageSlider ClassName={styles.slider} />
  <div 
  className={`${styles.description} ${isDescriptionHovered ? styles.expanded : ''}`}
   ref={descriptionRef}
   onMouseEnter={handleMouseEnterDescription}
   onMouseLeave={handleMouseLeaveDescription}> 
    <h1 className={styles.descriptionHead}>TESTIX</h1>
   <p className={styles.descriptionPar}>
   TESTIX это новый понятный и приятный для глаза конструктор тестов с возможностью переноса тестов из ворд в нашу систему. Продуманный редактор поможет вам привлечь студентов или коллег к прохождению тестов, и не займёт у вас много времени. Во время прохождения тестов вам тоже не наскучит ведь новые функции мы разрабатываем каждый день.
    </p> </div>
  <div className={`${styles.bottom_block} ${isBottomBlockHovered ? styles.expanded : ''}`}
  ref={bottomBlockRef}
  onMouseEnter={handleMouseEnterBottomBlock}
  onMouseLeave={handleMouseLeaveBottomBlock}>
    <h1 className={styles.BotBlockHead}>ПРОФИЛИ И ДОСТИЖЕНИЯ</h1>
    <p className={styles.BotBlockPar}>В нашей системе каждый может посмотреть профиль другого участника проекта, посмотреть его достижения или пройти тесты от него. Но если вы не хотите делится достижениями вы можете просто скрыть профиль и никто не узнает о ваших секретах. 
Также вы можете просматривать результаты людей прошедших ваши тесты. Но а как вишенка на торте вы сможете получать ачивки за выполнение определённых целей.
</p>
  </div>
  </div>

    </>
  )
}

export default FirstScreen