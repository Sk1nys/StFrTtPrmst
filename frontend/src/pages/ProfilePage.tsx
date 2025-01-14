import React, { FC, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import styles from './styles/ProfilePage.module.scss';
import CryptoJS from 'crypto-js';
import ButtonSquish from '../Components/Buttons/ButtonSquish';

interface DataItem {
  id: number;
  test: Test;
  user: User;
  score: number;
  total_score: number;
  data: string;
}

interface User {
  id: number;
  username: string;
}

interface Test {
  id: number;
  title: string;
  data: string;
}

// Новый интерфейс для дополнительных тестов
interface AdditionalTest {
  id: number;
  title: string;
  data: string;
}

const decrypt = (text: string) => {
  const bytes = CryptoJS.AES.decrypt(text, 'secret-key');
  return bytes.toString(CryptoJS.enc.Utf8);
};

const ProfilePage: FC = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['id', 'username']);
  const [decryptedUserId, setDecryptedUserId] = useState<string | null>(null);
  const [data, setData] = useState<DataItem[]>([]);
  const [additionalData, setAdditionalData] = useState<AdditionalTest[]>([]); // Для дополнительных данных
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cookies.id) {
      setDecryptedUserId(decrypt(cookies.id));
    }
  }, [cookies]);

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

  // Новый useEffect для получения дополнительных данных
  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const response = await axios.get<AdditionalTest[]>(`http://localhost:8000/test/users-tests?user_id=${decryptedUserId}`);
        setAdditionalData(response.data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    if (decryptedUserId) {
      fetchAdditionalData();
    }
  }, [decryptedUserId]);

  const handleExit = () => {
    window.location.href = '/home'; 
    removeCookie('id');
    removeCookie('username');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className={styles.header}><ButtonSquish>НАЗАД</ButtonSquish><h1>ЛИЧНЫЙ КАБИНЕТ</h1><button className={styles.btn} onClick={handleExit}><ButtonSquish>Выйти</ButtonSquish></button></div>
      <div className={styles.container}>
      {data.length > 0 ? (
        <div className={styles.result}>
          <h2>Результаты тестов</h2>
          {data.map((item) => (
            <div className={styles.sell} key={item.id} style={{ marginBottom: '1em' }}>
              <p>{item.test.title}</p>
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
              <p>{item.title}</p> {/* Отображаем только заголовок теста */}
              <p>Дата: {item.data}</p> {/* Отображаем дату теста */}
              
            </div>
          ))}
        </div>
      ) : (
        <div>Вы не создавали тест</div>
      )}
    </div>
    </div>
  );
};

export default ProfilePage;
