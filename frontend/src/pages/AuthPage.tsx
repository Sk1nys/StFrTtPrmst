import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles/AuthPage.module.scss';
import { Link } from "react-router-dom";
interface FormData {

  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  role_id: number;
}

const AuthPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({

    name: '',
    surname: '',
    username: '',
    email: '',
    password: '',
    role_id: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/users/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Changed to application/json
        },
      });
      
      console.log('Success:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };console.log(formData)

  return (
    
    <div className={styles.formContainer}>
      <Link to ="/home" className={styles.backBtnlink}>
      <div className={styles.butnSub}>
      <button className={styles.sub}>НАЗАД</button></div></Link>
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
      <label htmlFor="name" className={styles.labelForm}>ФАМИЛИЯ</label>
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
      <label htmlFor="name" className={styles.labelForm}>ИМЯ ПОЛЬЗОВАТЕЛЯ</label>
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
      <label htmlFor="name" className={styles.labelForm}>EMAIL</label>
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
      <div className={styles.rad}>
      
      <input
      className={styles.rad1}
        id='role_id'
        type="radio"
        name="role_id"
        value={2}
        onChange={handleChange}
        placeholder="role_id"
      />
      <label htmlFor="role_id" className={styles.radlab}>Ученик</label>
      
      <input
      className={styles.rad1}
        type="radio"
        id='role_id2'
        name="role_id"
        value={3}
        onChange={handleChange}
        placeholder="role_id"
      />
      <label htmlFor="role_id2" className={styles.radlab}>Преподаватель</label>
      </div>
      <div className={styles.butnSub}>
      <button type="submit" className={styles.sub}>Зарегистрироваться</button></div>
      <Link to="/regPage" className={styles.ARG}>Войти</Link>
    </form>
    </div>
  );
};

export default AuthPage;