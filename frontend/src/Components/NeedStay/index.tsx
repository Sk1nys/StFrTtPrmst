// import React, { useState, useEffect } from 'react';
import styles from './NeedStay.module.css'
import Path1 from '../../assets/NS1.jpg'
import Path2 from '../../assets/NS2.jpg'
import Path3 from '../../assets/NS3.jpg'
import Path4 from '../../assets/NS4.jpg'
import Path5 from '../../assets/NS5.jpg'
import Path6 from '../../assets/NS6.jpg'
import Path7 from '../../assets/NS7.jpg'
import Path8 from '../../assets/NS8.jpg'
import Path9 from '../../assets/NS9.jpg'

const NeedStay: React.FC = () => {
    const images = [
        {id: 1,src: Path1,alt: 'Image 1',},
        { id: 2, src: Path2, alt: 'Image 2',},
        {id: 3, src: Path3, alt: 'Image 3',},
        {id: 4, src: Path4, alt: 'Image 4',},
        {id: 5, src: Path5, alt: 'Image 5',},
        {id: 6, src: Path6, alt: 'Image 6',},
        {id: 7, src: Path7, alt: 'Image 7',},
        {id: 8, src: Path8, alt: 'Image 8',},
        {id: 9, src: Path9, alt: 'Image 9',},
    ];
    return (
        <section>
            <div className={styles.container}>

<div className={styles.content}>
<h3 className={styles.heading}>Большой потенциал</h3>
<div className={styles.description}>Вы должны нам денег</div>
</div>
</div>
<div className={styles.animation_container}>
    <div className={styles.sticky_content}>
      <div className={styles.grid_containerNS}>
      {images.map((image) => (
        <div
         className={styles.grid_item}>
  <img src={image.src} alt={image.alt} />
         </div>
         
    ))}
      </div>
    </div>
  </div>
        </section>
  )
}

export default NeedStay