import React, { FC, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import styles from './styles/ProfilePage.module.scss';
import CryptoJS from 'crypto-js';
import ButtonSquish from '../Components/Buttons/ButtonSquish';
import { Link } from 'react-router-dom';

interface DataItem {
  id: number;
  test: Test;
  user: User;
  score: number;
  total_score: number;
  data: string;
}

interface User {
  name: string;
  surname: string;
  username: string;
  email: string;
}

interface Test {
  id: number;
  title: string;
  data: string;
}

interface AdditionalTest {
  id: number;
  title: string;
  data: string;
}

interface Result {
  id: number;
  score: number;
  total_score: number;
  user: User;
}

const decrypt = (text: string) => {
  const bytes = CryptoJS.AES.decrypt(text, 'secret-key');
  return bytes.toString(CryptoJS.enc.Utf8);
};

const ProfilePage: FC = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['id', 'username']);
  const [decryptedUserId, setDecryptedUserId] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>(); 
  const [data, setData] = useState<DataItem[]>([]);
  const [additionalData, setAdditionalData] = useState<AdditionalTest[]>([]);
  const [results, setResults] = useState<{ [key: number]: Result[] }>({});
  const [userData, setUserData] = useState<User | null>(null);
  const [formData, setFormData] = useState<User | null>(null); // Для редактируемых данных пользователя
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false); // Состояние редактирования

  useEffect(() => {
    if (cookies.id) {
      setDecryptedUserId(decrypt(cookies.id));
    }
  }, [cookies]);
  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const response = await axios.get<AdditionalTest[]>(`http://localhost:8000/test/users-tests?user_id=${decryptedUserId}`);
        setAdditionalData(response.data);

        // Fetch results for each additional test
        const resultsPromises = response.data.map(async (item) => {
          const resultResponse = await axios.get<Result[]>(`http://localhost:8000/result/test-users?test_id=${item.id}`);
          return { id: item.id, results: resultResponse.data };
        });

        // Wait for all results to be fetched
        const resultsArray = await Promise.all(resultsPromises);
        const resultsMap: { [key: number]: Result[] } = {};
        resultsArray.forEach(({ id, results }) => {
          resultsMap[id] = results;
        });
        setResults(resultsMap);
      } catch (error: any) {
        setError(error.message);
      }
    };

    if (decryptedUserId) {
      fetchAdditionalData();
    }
  }, [decryptedUserId]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<DataItem[]>(`http://localhost:8000/result/user-results?user_id=${decryptedUserId}`);
        setData(response.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (decryptedUserId) {
      fetchData();
    }
  }, [decryptedUserId]);

  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<User>(`http://localhost:8000/users/view?id=${decryptedUserId}`);
        setUserData(response.data);
        setFormData(response.data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    if (decryptedUserId) {
      fetchUserData();
    }
  }, [decryptedUserId]);

  
  const handleExit = () => {
    window.location.href = '/home'; 
    removeCookie('id');
    removeCookie('username');
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };
  

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (formData) {
    try {
      await axios.put(`http://localhost:8000/users/updated?id=${decryptedUserId}`, formData);
      setUserData(formData); // Обновляем данные пользователя с изменёнными 
      setIsEditing(false); // Выходим из режима редактирования
    } catch (error: any) {
      setError(error.message);
    }
  }
};


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className={styles.header}>
        <Link to='/home' className={styles.backBtn}><ButtonSquish>НАЗАД</ButtonSquish></Link>
        <h1>ЛИЧНЫЙ КАБИНЕТ</h1>
        <button className={styles.btn} onClick={handleExit}><ButtonSquish>Выйти</ButtonSquish></button>
      </div>
      <div className={styles.container}>
        {userData && (
          <div className={styles.userInfo}>
            <h2>Информация о пользователе</h2>
            {isEditing ? (
  <form onSubmit={handleSubmit}>
    <input type="text" name="name" value={formData?.name || ''} onChange={handleChange} placeholder="Имя" />
    <input type="text" name="surname" value={formData?.surname || ''} onChange={handleChange} placeholder="Фамилия" />
    <input type="text" name="username" value={formData?.username || ''} onChange={handleChange} placeholder="Имя пользователя" />
    <input type="email" name="email" value={formData?.email || ''} onChange={handleChange} placeholder="Email" />
    <button type="submit">Сохранить</button>
    <button type="button" onClick={handleEditToggle}>Отмена</button>
  </form>
) : (
  <>
    <p>Имя: {userData.name}</p>
    <p>Фамилия: {userData.surname}</p>
    <p>Имя пользователя: {userData.username}</p>
    <p>Email: {userData.email}</p>
    <button onClick={handleEditToggle}>Редактировать</button>
  </>
)}

          </div>
        )}

        {data.length > 0 ? (
          <div className={styles.result}>
            <h2>Результаты тестов</h2>
            {data.map((item) => (
              <div className={styles.sell} key={item.id} style={{ marginBottom: '1em' }}>
                <a href={`/test/${item.id}`}>{item.test.title}</a>
                <p>баллы: {item.score}</p>
                <p>максимум баллов: {item.total_score}</p>
              </div>
            ))}
          </div>
        ) : (
          <div>Вы не проходили тест</div>
        )}

{additionalData.length > 0 ? (
          <div className={styles.mytest}>
            <h2>Ваши тесты</h2>
            {additionalData.map((item) => (
              <div className={styles.sell} key={item.id} style={{ marginBottom: '1em' }}>
                <a href={`/test/${item.id}`}>{item.title}</a>
                <p>Дата: {item.data}</p>
                <div className={styles.resultsContainer}>
                  <h3>Результаты пользователей:</h3>
                  {results[item.id]?.map(result => (
                    <div key={result.id} className={styles.resultItem}>
                      <p>Пользователь: {result.user.username}</p>
                      <p>Счет: {result.score} / {result.total_score}</p>
                    </div>
                  )) || <p>Нет результатов для этого теста.</p>}
                </div>
              </div>
            ))}
          </div>
        )  : (
          <div>Вы не создавали тест</div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;