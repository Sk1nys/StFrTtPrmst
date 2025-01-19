import { useState, useEffect, useRef } from "react";
import styles from "./Benefits.module.css";
import image1 from "../../assets/Benefit1.png";
import image2 from "../../assets/Benefit2.jpg";
import image3 from "../../assets/benefit3.png";
import { useHeight } from '../HeightContext';
import scissors from '../../assets/scissors.svg';

const Benefits = () => {
  const [lineWidth, setLineWidth] = useState<number>(0);

  const scissorsRef = useRef<HTMLImageElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
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

  const { setHeight } = useHeight();
   const blockRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => { 
      if (blockRef.current) {
      const computedStyle = getComputedStyle(blockRef.current);

         setHeight('benefits', blockRef.current.offsetHeight +  parseFloat(computedStyle.marginTop) + 
         parseFloat(computedStyle.marginBottom)); 
        }
 }, [setHeight]);
  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isVisible3, setIsVisible3] = useState(false);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);

  const [isVisibleImage1, setIsVisibleImage1] = useState(false);
  const [isVisibleImage2, setIsVisibleImage2] = useState(false);
  const [isVisibleImage3, setIsVisibleImage3] = useState(false);
  const refImage1 = useRef(null);
  const refImage2 = useRef(null);
  const refImage3 = useRef(null);

  useEffect(() => {
    const observer1 = new IntersectionObserver(
      ([entry]) => {
        setIsVisible1(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    const observer2 = new IntersectionObserver(
      ([entry]) => {
        setIsVisible2(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    const observer3 = new IntersectionObserver(
      ([entry]) => {
        setIsVisible3(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    const observerImage1 = new IntersectionObserver(
      ([entry]) => {
        setIsVisibleImage1(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    const observerImage2 = new IntersectionObserver(
      ([entry]) => {
        setIsVisibleImage2(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    const observerImage3 = new IntersectionObserver(
      ([entry]) => {
        setIsVisibleImage3(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (ref1.current) {
      observer1.observe(ref1.current);
    }

    if (ref2.current) {
      observer2.observe(ref2.current);
    }

    if (ref3.current) {
      observer3.observe(ref3.current);
    }

    if (refImage1.current) {
      observerImage1.observe(refImage1.current);
    }

    if (refImage2.current) {
      observerImage2.observe(refImage2.current);
    }

    if (refImage3.current) {
      observerImage3.observe(refImage3.current);
    }

    return () => {
      if (ref1.current) {
        observer1.unobserve(ref1.current);
      }

      if (ref2.current) {
        observer2.unobserve(ref2.current);
      }

      if (ref3.current) {
        observer3.unobserve(ref3.current);
      }

      if (refImage1.current) {
        observerImage1.unobserve(refImage1.current);
      }

      if (refImage2.current) {
        observerImage2.unobserve(refImage2.current);
      }

      if (refImage3.current) {
        observerImage3.unobserve(refImage3.current);
      }
    };
  }, []);

  return (
    <>
       <div className={styles.scroll_container} ref={blockRef}>
            <div ref={lineRef} className={styles.dashed_line}></div>
            <img
              src={scissors}
              alt=""
              className={styles.scissors}
              ref={scissorsRef}
            />
    <div className={styles.text}>
    ЕЩЁ БОЛЬШЕ ПРИЧИН ОСТАТЬСЯ
    </div>
      <div className={styles.grid_containerBenef}>
        <div className={`${styles.grid_item_left} ${styles.grid_item1}`}>
          <div
            className={`${styles.txt_four_page} ${
              isVisible1 ? styles.fadeIn : ""
            }`}
            ref={ref1}
          >
            <h1
              className={`${styles.big_text_four_page} ${
                isVisible1 ? styles.fadeIn : ""
              }`}
            >
              01. <br />Отслеживание прогресса.
            </h1>
            <p>
            <br className={styles.br_partner}/>
            Смотрите за вашими достижениями в реальном времени.
            </p>
          </div>
        </div>
        <div className={`${styles.grid_item_right} ${styles.grid_item2}`}>
          <div
            className={`${styles.kartinka1} ${
              isVisibleImage1 ? styles.fadeIn : ""
            }`}
            ref={refImage1}
          >
            <img
              className={`${styles.img_four_end} ${
                isVisibleImage1 ? styles.fadeIn : ""
              }`}
              src={image1}
              alt=""
            />
          </div>
        </div>

        <div className={`${styles.grid_item_left} ${styles.grid_item3}`}>
          <div
            className={`${styles.kartinka1} ${
              isVisibleImage2 ? styles.fadeIn : ""
            }`}
            ref={refImage2}
          >
            <img
              className={`${styles.img_four_end} ${
                isVisibleImage2 ? styles.fadeIn : ""
              }`}
              src={image2}
              alt=""
            />
          </div>
        </div>
        <div className={`${styles.grid_item_right} ${styles.grid_item4}`}>
          <div
            className={`${styles.txt_four_page} ${
              isVisible2 ? styles.fadeIn : ""
            }`}
            ref={ref2}
          >
            <h1
              className={`${styles.big_text_four_right} ${
                isVisible2 ? styles.fadeIn : ""
              }`}
            >
              02. <br /> Понятный редактор. 
            </h1>
            <p className={styles.text_four_right}>
             <br className={styles.br_partner} />
             Простой в усвоении редактор с кучей функций.
            </p>
          </div>
        </div>

        <div className={`${styles.grid_item_left} ${styles.grid_item5}`}>
          <div
            className={`${styles.txt_four_page} ${
              isVisible3 ? styles.fadeIn : ""
            }`}
            ref={ref3}
          >
            <h1
              className={`${styles.big_text_four_page} ${
                isVisible3 ? styles.fadeIn : ""
              }`}
            >
              03. <br />Новый опыт. 
            </h1>{" "}
            <p>
            <br className={styles.br_partner} />
            Получите новый опыт в прохождении тестов.
            </p>
          </div>
        </div>

        <div className={`${styles.grid_item_right} ${styles.grid_item6}`}>
          <div
            className={`${styles.kartinka1} ${
              isVisibleImage3 ? styles.fadeIn : ""
            }`}
            ref={refImage3}
          >
            <img
              className={`${styles.img_four_end} ${
                isVisibleImage3 ? styles.fadeIn : ""
              }`}
              src={image3}
              alt=""
            />
          </div>
        </div>
      </div>
    <div ref={lineRef} className={styles.dashed_line_end}></div>
    </div>
    </>
  );
};

export default Benefits;
