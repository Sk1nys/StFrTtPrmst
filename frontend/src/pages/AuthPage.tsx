<<<<<<< Updated upstream
import React from 'react'

const AuthPage = () => {
  return (
    <div>AuthPage</div>
=======
import React, { useEffect, useState } from 'react';
import InputAuth from '../Components/InputAuth'
import styles from './styles/AuthPage.module.css'
import axios from 'axios';
interface FormData {
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  role_id: number;
}
const AuthPage:React.FC = () => {
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
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Success:', response.data);
    } catch (error) {
      //console.error('Error:', error);
    }
    
  };
  console.log(JSON.stringify(formData));

  return (
    
<form onSubmit={handleSubmit}>
<input
        type="text"
        name="id"
        value={formData.id}
        onChange={handleChange}
        placeholder="id"
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
        type="text"
        name="role_id"
        value={formData.role_id}
        onChange={handleChange}
        placeholder="role_id"
      />


      <button type="submit">Зарегестрироваться</button>
    </form>


    
>>>>>>> Stashed changes
  )
}

export default AuthPage