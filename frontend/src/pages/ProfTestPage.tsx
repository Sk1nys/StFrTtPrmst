 import React, { useRef } from 'react'
import styles from './styles/ProfTestPage.module.scss'

const ProfTestPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);


  return (
    <canvas className={styles.profCanvas} ref={canvasRef}>

    </canvas>
  )
}

export default ProfTestPage