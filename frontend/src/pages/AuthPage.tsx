import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles/AuthPage.module.css';

interface FormData {
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  role_id: number;
}

const AuthPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    id: 0,
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
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="number"
        name="id"
        value={formData.id}
        onChange={handleChange}
        placeholder="ID"
      />
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Имя"
      />
      <input
        type="text"
        name="surname"
        value={formData.surname}
        onChange={handleChange}
        placeholder="Фамилия"
      />
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Имя пользователя"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Пароль"
      />
      <input
        type="number"
        name="role_id"
        value={formData.role_id}
        onChange={handleChange}
        placeholder="role_id"
      />
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
};

export default AuthPage;
