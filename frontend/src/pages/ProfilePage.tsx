import React, { FC, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios, { AxiosError } from 'axios';

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

const TestPage: FC = () => {
  const [cookies, setCookie] = useCookies(['id']);
  const userId = cookies.id;

  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<DataItem[]>(`http://localhost:8000/result/user-results?user_id=${userId}`);
        setData(response.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
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

export default TestPage;
