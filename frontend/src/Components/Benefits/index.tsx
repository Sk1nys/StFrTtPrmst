import { useState, useEffect, useRef } from "react";
import styles from "./Benefits.module.css";
import image1 from "../../assets/Benefit1.jpg";
import image2 from "../../assets/Benefit2.jpg";
import image3 from "../../assets/benefit3.jpg";
import { useHeight } from '../HeightContext';
const Benefits = () => {



  const { setHeight } = useHeight();
   const blockRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => { 
      if (blockRef.current) {
         setHeight('benefits', blockRef.current.offsetHeight); 
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
    <div ref={blockRef}>
    <div className={styles.text}>
      Почему вам стоит остаться
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
              01
            </h1>
            <p>
              ЧIНАЗЕС!!!<br className={styles.br_partner}/>
              угар века
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
              02
            </h1>
            <p className={styles.text_four_right}>
             САМЫЙ ПОПУЛЯРНЫЙ ИСПОЛНИТЕЛЬ <br className={styles.br_partner} />
              СЛУШАТ ОНЛАЙН
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
              03
            </h1>{" "}
            <p>
              АБУЗ 2024 <br className={styles.br_partner} />
             КАК ВОРОВАТЬ ПРАВИЛЬНО
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
    </div>
  );
};

export default Benefits;
