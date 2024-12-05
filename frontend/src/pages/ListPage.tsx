import React, { useEffect, useState } from 'react';
import styles from './styles/ListPage.module.scss';
import { Link } from "react-router-dom";
import ButtonSquish from '../Components/Buttons/ButtonSquish'
import axios from 'axios';

// Типы для данных
interface DataItem {
  id: number;
  title: string;
  description: string;
  subject: string;
  data: string;
}

const DataFetchingComponent: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]); // Состояние для данных
  const [loading, setLoading] = useState<boolean>(true); // Состояние загрузки
  const [error, setError] = useState<string | null>(null); // Состояние ошибки

  useEffect(() => {
    // Функция для получения данных
    const fetchData = async () => {
      try {
        const response = await axios.get<DataItem[]>(`http://localhost:8000/test`);
        setData(response.data); // Устанавливаем данные в состояние
        setLoading(false); // Меняем состояние загрузки
      } catch (error: any) {
        setError(error.message); // В случае ошибки записываем ошибку в состояние
        setLoading(false); // Меняем состояние загрузки
      }
    };

    fetchData(); // Вызов функции получения данных
  }, []); // Пустой массив зависимостей означает, что запрос выполняется один раз при монтировании компонента

  // Отображение состояния
  if (loading) return <div>Loading...</div>;
  //if (error) return <div>Error: {error}</div>;

  // Генерация HTML из данных
  return (
    <div className={styles.listMain}>
      <div className={styles.hedlist}> <Link to="/home" className={styles.linkii}><ButtonSquish className={styles.header_button}>НАЗАД</ButtonSquish></Link><h1>СПИСОК ТЕСТОВ</h1></div>
      <div className={styles.dataList}>
      <div  className={styles.dataItem}>
              
              <h2>Обзорный тест</h2> {/* название */}
              <p>НАШ ТЕСТ</p> {/* описание */}
              <p>Программирование</p> {/* предмет */}
              <p>Неизвестно</p> {/* дата */}
              <Link to={"/proftest"} className={styles.lik}></Link>
            </div>
        {data.length > 0 ? (
          data.map((item) => (
            <div key={item.id} className={styles.dataItem}>
              
              <h2>{item.title}</h2> {/* название */}
              <p>{item.description}</p> {/* описание */}
              <p>{item.subject}</p> {/* предмет */}
              <p>{item.data}</p> {/* дата */}
              <a href={`/test/${item.id}`} className={styles.lik}></a>
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
