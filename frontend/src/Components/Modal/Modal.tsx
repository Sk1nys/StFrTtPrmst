import React from "react";
import styles from "./Modal.module.css";

interface ModalProps {
    active: boolean;
    setActive: (active: boolean) => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ active, setActive, children }) => {
    return(
        <div className={active ? styles.active : styles.modal} onClick={()=>{setActive(false)}}>
            <div className={active ? styles.contentActive : styles.modalContent} onClick={e =>e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}
export default Modal;