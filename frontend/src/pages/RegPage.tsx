import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles/AuthPage.module.scss';
import { Link } from "react-router-dom";
import { useCookies } from 'react-cookie';
import CryptoJS from 'crypto-js';

interface FormData {
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  role_id: string;
}

const RegPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    surname: '',
    username: '',
    email: '',
    password: '',
    role_id: '',
  });
  
  const [errors, setErrors] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    password: '',
    role_id: '',
  });

const [cookies, setCookie, removeCookie] = useCookies(['username', 'id']);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (fieldName: string, value: string) => {
    let errorMessage = '';
    
    switch (fieldName) {
      case 'name':
      case 'surname':
        if (!/^[а-яёА-ЯЁ -]*$/u.test(value)) {
          errorMessage = 'Разрешены только кириллица, пробел и тире';
        }
        break;
      case 'username':
        if (!/^[a-zA-Z0-9-]*$/i.test(value)) {
          errorMessage = 'Разрешены только латиница, цифры и тире';
        }
        break;
      case 'email':
        if (!/\S+@\S+\.\S+/.test(value)) {
          errorMessage = 'Введите корректный email';
        }
        break;
      case 'password':
        if (value.length <=5) {
          errorMessage = 'Пароль должен быть не менее 6 символов';
        }
        break;
      case 'role_id':
        if (!value) {
          errorMessage = 'Выберите роль';
        }
        break;
      default:
        break;
    }
    
    setErrors({ ...errors, [fieldName]: errorMessage });
  };

  const encrypt = (text: string) => {
    return CryptoJS.AES.encrypt(text, 'secret-key').toString();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.values(errors).some(error => error)) {
      alert('Пожалуйста, исправьте ошибки в форме');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:8000/users/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });window.location.href = 'home'; 
      setCookie('username', encrypt(response.data.username), { path: '/' });
      setCookie('id', encrypt(response.data.id.toString()), { path: '/' });
      // Обработка успешного ответа
    } catch (error) {
      alert('Ошибка регистрации');
    }
  };

  return (
    <div className={styles.formContainer}>
      <Link to="/home" className={styles.backBtnlink}>
        <div className={styles.butnSub}>
          <button className={styles.sub}>НА ГЛАВНУЮ</button>
        </div>
      </Link>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>РЕГИСТРАЦИЯ</h1>
        <div className={styles.formBox}>
          <input
            className={styles.inputFild}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Имя"
          />
          <label htmlFor="name" className={styles.labelForm}>ИМЯ</label>
          {errors.name && <div className={styles.error}>{errors.name}</div>}
          <div className={styles.FormShadows}></div>
        </div>
        <div className={styles.formBox}>
          <input
            className={styles.inputFild}
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            placeholder="Фамилия"
          />
          <label htmlFor="surname" className={styles.labelForm}>ФАМИЛИЯ</label>
          {errors.surname && <div className={styles.error}>{errors.surname}</div>}
          <div className={styles.FormShadows}></div>
        </div>
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
          {errors.username && <div className={styles.error}>{errors.username}</div>}
          <div className={styles.FormShadows}></div>
        </div>
        <div className={styles.formBox}>
          <input
            className={styles.inputFild}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <label htmlFor="email" className={styles.labelForm}>EMAIL</label>
          {errors.email && <div className={styles.error}>{errors.email}</div>}
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
          {errors.password && <div className={styles.error}>{errors.password}</div>}
          <div className={styles.FormShadows}></div>
        </div>
        <div className={styles.rad}>
          <input
            className={styles.rad1}
            id='role_id'
            type="radio"
            name="role_id"
            value="2"
            onChange={handleChange}
          />
          <label htmlFor="role_id" className={styles.radlab}>Ученик</label>

          <input
            className={styles.rad1}
            type="radio"
            id='role_id2'
            name="role_id"
            value="3"
            onChange={handleChange}
          />
          <label htmlFor="role_id2" className={styles.radlab}>Преподаватель</label>
          {errors.role_id && <div className={styles.error}>{errors.role_id}</div>}
        </div>
        <div className={styles.butnSub}>
          <button type="submit" className={styles.sub}>Зарегистрироваться</button>
        </div>
        <Link to="/auth" className={styles.RegAuth}>ВОЙТИ</Link>
      </form>
    </div>
  );
};

export default RegPage;
