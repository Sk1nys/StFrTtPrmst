import styles from './ButtonShine.module.css'
interface ButtonShineProps{
    children?: string;
    className?: string;
}
const ButtonShine:React.FC<ButtonShineProps> = ({children, className}) => {
  return (
    <button className={`${styles.shine} ${className}`}>
    <span className={styles.shine_text}>{children}</span>
    <span className={styles.shimmer}></span>
</button>
  )
}

export default ButtonShine