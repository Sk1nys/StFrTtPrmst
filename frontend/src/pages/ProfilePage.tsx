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
}

const decrypt = (text: string) => {
  const bytes = CryptoJS.AES.decrypt(text, 'secret-key');
  return bytes.toString(CryptoJS.enc.Utf8);
};

const ProfilePage: FC = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['id','username']);
  const [decryptedUserId, setDecryptedUserId] = useState<string | null>(null);

  useEffect(() => {
    if (cookies.id) {
      setDecryptedUserId(decrypt(cookies.id));
    }
  }, [cookies]);

  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        <div>No data available</div>
      )}
    </div>
  );
};

export default ProfilePage;
