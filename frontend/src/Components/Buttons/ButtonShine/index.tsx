import styles from './ButtonShine.module.css'
interface ButtonShineProps{
    children?: string;
}
const ButtonShine:React.FC<ButtonShineProps> = ({children}) => {
  return (
    <button className={styles.shine}>
    <span className={styles.shine_text}>{children}</span>
    <span className={styles.shimmer}></span>
</button>
  )
}

export default ButtonShine