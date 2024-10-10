import styles from './ButtonSquish.module.scss';

interface ButtonSquishProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
}

const ButtonSquish: React.FC<ButtonSquishProps> = ({
    children,
    className = '', // Добавлено значение по умолчанию
    onClick,
    type,
}) => {
    return (
        <button 
            onClick={onClick}
            type={type}
            className={`${className} ${styles.ButtonSquish}`}>
            {children}
        </button>
    );
}

export default ButtonSquish;