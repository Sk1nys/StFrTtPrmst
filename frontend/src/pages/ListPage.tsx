import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DataFetchingComponent = () => {
  const [data, setData] = useState([]); // Состояние для данных
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(null); // Состояние ошибки

  useEffect(() => {
    // Функция для получения данных
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/test');
        setData(response.data); // Устанавливаем данные в состояние
        setLoading(false); // Меняем состояние загрузки
      } catch (error) {
        setError(error.message); // В случае ошибки записываем ошибку в состояние
        setLoading(false); // Меняем состояние загрузки
      }
    };

    fetchData(); // Вызов функции получения данных
  }, []); // Пустой массив зависимостей означает, что запрос выполняется один раз при монтировании компонента

  // Отображение состояния
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Генерация HTML из данных
  return (
    <div>
      <div className="data-list">
        {data.length > 0 ? (
          data.map(item => (
            <div key={item.id} className="data-item">
              <h3>{item.title}</h3> {/* название */}
              <p>{item.description}</p>{/* описание */}
              <p>{item.subject}</p>{/* предмет */}
              <p>{item.data}</p>{/* дата */}
            </div>
          ))
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default DataFetchingComponent;
