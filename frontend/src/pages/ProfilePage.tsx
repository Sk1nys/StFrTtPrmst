import React, { FC, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import CryptoJS from 'crypto-js';

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
      <button onClick={handleExit}>Выйти</button>
      {data.length > 0 ? (
        <div>
          <h2>Результаты тестов</h2>
          {data.map((item) => (
            <div key={item.id} style={{ marginBottom: '1em' }}>
              <p>{item.test.title}</p>
              <p>баллы: {item.score}</p>
              <p>максимум баллов: {item.total_score}</p>
              <hr />
            </div>
          ))}
        </div>
      ) : (
        <div>Вы не проходили тест</div>
      )}

      {additionalData.length > 0 ? (
        <div>
          <h2>Ваши тести</h2>
          {additionalData.map((item) => (
            <div key={item.id} style={{ marginBottom: '1em' }}>
              <p>{item.title}</p> {/* Отображаем только заголовок теста */}
              <p>Дата: {item.data}</p> {/* Отображаем дату теста */}
              <hr />
            </div>
          ))}
        </div>
      ) : (
        <div>Вы не создавали тест</div>
      )}
    </div>
  );
};

export default ProfilePage;
