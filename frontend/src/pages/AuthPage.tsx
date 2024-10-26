import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles/AuthPage.module.scss';
import { Link } from "react-router-dom";

interface FormData {


  username: string;
  password: string;

}

const AuthPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({


    username: '',
    password: '',

  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log(formData)
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 

          credentials: 'include',
        },

 
      });
      if (response.status === 200) {
        console.log('успех')
        //window.location.href = 'home'; // Перенаправление
    }
      console.log('Success:', response.data);
    } catch (error) {
      alert('Ошибка входа');
      console.error('Error:', error);
    }
  };
  

  return (
    <div className={styles.formContainer}>
      <Link to ="/home" className={styles.backBtnlink}>
      <div className={styles.butnSub}>
      <button className={styles.sub}>НА ГЛАВНУЮ</button></div></Link>
    <form onSubmit={handleSubmit} className={styles.form}>
    <h1>АВТОРИЗАЦИЯ</h1>
      <div className={styles.formBox}>
      <input  
       className={styles.inputFild}
        
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Имя пользователя"
      />
      <label htmlFor="name" className={styles.labelForm}>ИМЯ ПОЛЬЗОВАТЕЛЯ</label>
      <div className={styles.FormShadows}></div>
      </div>

      <div className={styles.formBox}>
      <input  
       className={styles.inputFild}
        
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Пароль"
      />  
      <label htmlFor="name" className={styles.labelForm}>ПАРОЛЬ</label>
      <div className={styles.FormShadows}></div>
      </div>
      
      <div className={styles.butnSub}>
      <button type="submit" className={styles.sub}>Войти</button></div>
      <Link to="/reg" className={styles.RegAuth}>ЗАРЕГИСТРИРОВАТЬСЯ</Link>
    </form>
    </div>
  );
};

export default AuthPage;