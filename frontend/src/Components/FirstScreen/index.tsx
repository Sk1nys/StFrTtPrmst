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
      setHeight(id, blockRef.current.offsetHeight); 
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

    </>
  )
}

export default FirstScreen