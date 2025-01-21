import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import ButtonSquish from '../Components/Buttons/ButtonSquish';
import axios from 'axios';

interface DataItem {
    id: number;
    name: string;
    surname: string;
    username: string;
    email: string;
    password: string;
    role_id: Role;
}
interface Role {
    id: number;
    role: string;
}

const AdminPage: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<DataItem | null>(null);
  const [formData, setFormData] = useState<DataItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<DataItem[]>(`http://localhost:8000/users`);
        setData(response.data); 
        setLoading(false); 
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData(); 
  }, []); 

  const handleEdit = (item: DataItem) => {
    setEditingItem(item);
    setFormData(item);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
        console.log("Отправляемые данные:", formData); // Выводим отправляемые данные в консоль
        try {
            // Измените метод на PUT или PATCH
            await axios.put(`http://localhost:8000/users/updated?id=${formData.id}`, formData);
            setData(data.map(item => (item.id === formData.id ? formData : item)));
            setEditingItem(null);
            setFormData(null);
        } catch (error: any) {
            setError(error.message);
        }
    }
};

// Внутри вашего return
{error && <div style={{ color: 'red' }}>{error}</div>}

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div>
        <Link to="/home"><ButtonSquish>НАЗАД</ButtonSquish></Link>
        <h1>СПИСОК ПОЛЬЗОВАТЕЛЕЙ</h1>
      </div>
      <div>
        {data.length > 0 ? (
          data.map((item) => (
            <div key={item.id}>
              <h2>{item.name}</h2>
              <p>{item.surname}</p>
              <p>{item.username}</p> 
              <p>{item.email}</p> 
              <p>{item.password}</p> 
              <ButtonSquish onClick={() => handleEdit(item)}>Редактировать</ButtonSquish>
            </div>
          ))
        ) : (
          <p>No data available</p>
        )}
        
        {editingItem && formData && (
          <form onSubmit={handleSubmit}>
            <h2>Редактировать пользователя</h2>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Имя" />
            <input name="surname" value={formData.surname} onChange={handleChange} placeholder="Фамилия" />
            <input name="username" value={formData.username} onChange={handleChange} placeholder="Имя пользователя" />
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
            <input name="password" value={formData.password} onChange={handleChange} placeholder="Пароль" type="password" />
            <button type="submit">Сохранить</button>
            <button type="button" onClick={() => setEditingItem(null)}>Отмена</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
