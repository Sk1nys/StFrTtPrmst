import React, { useRef, useEffect, useState } from 'react';
import styles from './NeedStay.module.css';
import Path1 from '../../assets/NS1.jpg';
import Path2 from '../../assets/NS2.jpg';
import Path3 from '../../assets/NS3.jpg';
import Path4 from '../../assets/NS4.jpg';
import Path5 from '../../assets/NS5.jpg';
import Path6 from '../../assets/NS6.jpg';
import Path7 from '../../assets/NS7.jpg';
import Path8 from '../../assets/NS8.jpg';
import Path9 from '../../assets/NS9.jpg';
import { useHeight } from '../HeightContext';

const NeedStay: React.FC = () => {
const {getTotalHeight} = useHeight();
const totalHeight = getTotalHeight();

  const centralBlockRef = useRef<HTMLDivElement | null>(null);
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const [isFixed, setIsFixed] = useState(false);
  const [isAbsolute, setIsAbsolute] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);
  const [showTextBlock, setShowTextBlock] = useState(false);
  const scrollLimit = totalHeight+175+135;
  const scrollLimitUnset = scrollLimit + 650;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const scaleStart = scrollLimit;
      const scaleEnd = scrollLimit + viewportHeight * 0.8;
      let scaleProgress = (scrollY - scaleStart) / (scaleEnd - scaleStart);
      scaleProgress = Math.max(0, Math.min(1, scaleProgress));
      const scaleValue = 1 + scaleProgress * 2.4;
      const gridChange = 5 - scaleProgress * 2.8;

      if (centralBlockRef.current) {
        centralBlockRef.current.style.transform = `scale(${scaleValue})`;
        centralBlockRef.current.style.columnGap = `${gridChange - 2}vw`;
        centralBlockRef.current.style.rowGap = `${gridChange - 2}vh`;
      }

      if (scrollY >= scrollLimit && scrollY <= scrollLimitUnset) {
        setIsFixed(true);
        setIsAbsolute(false);
        if (centralBlockRef.current && placeholderRef.current) {
          setContainerHeight(centralBlockRef.current.offsetHeight);
          placeholderRef.current.style.height = `${centralBlockRef.current.offsetHeight}px`;
        }
      } else if (scrollY > scrollLimitUnset) {
        setIsFixed(false);
        setIsAbsolute(true);
      } else {
        setIsFixed(false);
        setIsAbsolute(false);
      }

      if (scrollY > scrollLimitUnset) {
        setShowTextBlock(true);
      } else {
        setShowTextBlock(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollLimit, scrollLimitUnset, containerHeight]);

  const images = [
    { id: 1, src: Path1, alt: 'Image 1' },
    { id: 2, src: Path2, alt: 'Image 2' },
    { id: 3, src: Path3, alt: 'Image 3' },
    { id: 4, src: Path4, alt: 'Image 4' },
    { id: 5, src: Path5, alt: 'Image 5' },
    { id: 6, src: Path6, alt: 'Image 6' },
    { id: 7, src: Path7, alt: 'Image 7' },
    { id: 8, src: Path8, alt: 'Image 8' },
    { id: 9, src: Path9, alt: 'Image 9' },
  ];

  return (
    <section style={{ width: '100%', height: '345vh' }}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h3 className={styles.heading}>Большой потенциал</h3>
          <div className={styles.description}>Вы должны нам денег</div>
        </div>
      </div>
      <div ref={placeholderRef} style={{ height: isFixed || isAbsolute ? `${containerHeight}px` : 'auto' }} />
      <div
        className={styles.animation_container}
        style={{
          position: isFixed ? 'fixed' : isAbsolute ? 'absolute' : 'relative',
          top: isFixed ? '0' : isAbsolute ? `${scrollLimitUnset - containerHeight-200}px` : 'auto',
          left: '0',
          width: '100%',
          transition: 'position 0.1s ease-in-out, transform 0.1s ease-in-out',
          height: showTextBlock? '339vh' : '100vh'
        }}
      >
        <div className={styles.sticky_content} style={{height: showTextBlock? '338vh' : '100vh'}}>
          <div ref={centralBlockRef} className={styles.grid_containerNS}>
            {images.map((image, index) => (
              <div
                key={index}
                className={`${styles.grid_item} ${index === 4 ? styles.center_item : ''}`}
                style={{
                  opacity: index === 7? 1:1,
                  transition: 'opacity 0.5s ease-in-out',
                  zIndex: 999
                }}
              >
                {index === 7 && showTextBlock ? (
                  <div className={styles.text_block}>
                    <h2>Текстовый блок</h2>
                    <p>Это пример текстового блока, который заменяет изображение.</p>
                  </div>
                ) : (
                  <img src={image.src} alt={image.alt} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeedStay;
