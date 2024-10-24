import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles/AuthPage.module.scss';

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
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Changed to application/json
        },
      });
      
      console.log('Success:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  //console.log(formData)

  return (
    <div className={styles.formContainer}>
    <form onSubmit={handleSubmit} className={styles.form}>


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
    </form>
    </div>
  );
};

export default AuthPage;