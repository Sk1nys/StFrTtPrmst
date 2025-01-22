import styles from './styles/ThirdEpisode.module.scss';
import img from '../assets/signR.jpg';
import imgCicada from '../assets/cicada.jpg';
import React, { useEffect } from 'react';
const ThirdEpisode: React.FC = () => {
  useEffect(() => {
    const imgElement = new Image();
    imgElement.src = img;
 
    imgElement.onload = () => {
      
    };
    document.body.appendChild(imgElement);
    if (imgElement.parentNode) {
      imgElement.parentNode.removeChild(imgElement);
    }
  }, []);

  return (
    <div className={styles.main}>
   <h1 className={styles.lastHead}>Позд<span style={{color:'#421919'}}>р</span>авляем! Вы достигли заключительного этапа наш<span style={{color:'#421919'}}>е</span>го испытания!</h1> 
<p className={styles.lastPar}> 
Вы находитесь на пороге завершения, и впереди ва<span style={{color:'#421919'}}>с</span> ждут самые сложные и <span style={{color:'#421919'}}>у</span>влекательные задачи, которые потребуют от вас максимальной концентрации и креативности. Этот этап — не просто финальный акко<span style={{color:'#421919'}}>р</span>д, но и настоящая проверка ваших навыков и умений как разработчика.
Каждое испытание, которое вам предстоит пройти, <span style={{color:'#421919'}}>c</span>танет не только вызовом, но и возможностью продемонстрировать свои знания и оп<span style={{color:'#421919'}}>ы</span>т. Мы уверены, что вы справитесь с любыми трудностями и покажете на что способны.
Готовьтесь к захватывающим задачам, которые проверят вашу смекалку и мастерство. Удачи вам на этом заключительном пути — вы почти у цели!
</p>
  <img src={imgCicada} alt="" className={styles.lastImg} style={{width:'300px', height:'300px'}}/>
    </div>
  )
}

export default ThirdEpisode