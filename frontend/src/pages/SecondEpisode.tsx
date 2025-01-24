import React from 'react'
import styles from './styles/SecondEpisode.module.scss'
import { Link } from 'react-router-dom'
const changeIn = ()=>{
  let i = document.querySelector("input")
  if(i.value=="left:50px;"){
    i.style.left = "50px"
    console.log("L.... S......")
    localStorage.setItem("nextStage", "/thirdepisode");
    
  }
}
const SecondEpisode = () => {
  return (
    <div className={styles.main}>
        <h2 className={styles.h2}>Тут темно надо включть свет</h2>
        <h3 className={styles.h3}>Вот так то лучше а теперь надо починить Input мне нужен текст</h3>
        <label>.-.. . ..-. - ---... ..... ----- .--. -..- -.-.-.</label>
        <input className={styles.secret} type="date" onChange={changeIn.bind(this)}/>
        
    </div>
  )
}

export default SecondEpisode