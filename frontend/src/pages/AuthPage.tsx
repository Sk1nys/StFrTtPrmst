import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles/AuthPage.module.scss';
import { Link } from "react-router-dom";
import { useCookies } from 'react-cookie';
import CryptoJS from 'crypto-js';

interface FormData {
  username: string;
  password: string;
}

const AuthPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });
  const [cookies, setCookie, removeCookie] = useCookies(['username', 'id']);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const encrypt = (text: string) => {
    return CryptoJS.AES.encrypt(text, 'secret-key').toString();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
          credentials: 'include',
          withCredentials: true,
        },
      });
      if (response.status === 200) {
        window.location.href = 'home'; 
        setCookie('username', encrypt(response.data.username), { path: '/' });
        setCookie('id', encrypt(response.data.id.toString()), { path: '/' });
      }
    } catch (error) {
      alert('Ошибка входа');
    }
  };

  return (
    <div className={styles.formContainerAuth}>
      <Link to="/home" className={styles.backBtnlink}>
        <div className={styles.butnSub}>
          <button className={styles.sub}>НА ГЛАВНУЮ</button>
        </div>
      </Link>
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
          <label htmlFor="username" className={styles.labelForm}>ИМЯ ПОЛЬЗОВАТЕЛЯ</label>
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
          <label htmlFor="password" className={styles.labelForm}>ПАРОЛЬ</label>
          <div className={styles.FormShadows}></div>
        </div>
        <div className={styles.butnSub}>
          <button type="submit" className={styles.sub}>Войти</button>
        </div>
        <Link to="/reg" className={styles.RegAuth}>ЗАРЕГИСТРИРОВАТЬСЯ</Link>
      </form>
    </div>
  );
};

export default AuthPage;
