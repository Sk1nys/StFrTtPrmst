// import React, { useRef } from 'react';
import styles from './MainPageSlider.module.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import  './swiper.css';
import Path1 from '../../assets/sliderOne.png';
import Path2 from '../../assets/slidetTwo.png';
import Path3 from '../../assets/sliderThree.png';
import Path4 from '../../assets/sliderFour.png';
import Path5 from '../../assets/sliderFive.png';
interface mainPageSliderProps{
  ClassName?:string;
}
const MainPageSlider: React.FC<mainPageSliderProps> = ({ClassName}) => {
    const images = [
        {id: 1,src: Path1,alt: 'Image 1',},
        { id: 2, src: Path2, alt: 'Image 2',},
        {id: 3, src: Path3, alt: 'Image 3',},
        {id: 4, src: Path4, alt: 'Image 4',},
        {id: 5, src: Path5, alt: 'Image 5',},
    ];
  return (
    <>
    <div className={`${styles.slider_container} ${ClassName}`}>
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      loop={true}
      grabCursor={true}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true, 
        
      }}
    //   onMouseEnter={() => swiperRef.current.autoplay.stop()}
    //   onMouseLeave={() => swiperRef.current.autoplay.start()}
      modules={[Autoplay]}
    >
           {images.map((image) => (
         <SwiperSlide key={image.id}
         className={styles.slider_slide}
         >
         <img src={image.src} alt={image.alt} />
     </SwiperSlide>
      ))}
    </Swiper>
    </div>
    </>
  )
}

export default MainPageSlider