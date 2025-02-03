import React, { useEffect, useState } from 'react';
import styles from './styles/ListPage.module.scss';
import { Link } from "react-router-dom";
import ButtonSquish from '../Components/Buttons/ButtonSquish'
import axios from 'axios';
import Loader from '../Components/Loader';

interface DataItem {
  id: number;
  title: string;
  description: string;
  subject: string;
  data: string;
}

const ListPage: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<DataItem[]>(`http://localhost:8000/test`);
        setData(response.data); 
        setLoading(false); 
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData(); 
  }, []); 

  if (loading) return <Loader />;

  return (
    <div className={styles.listMain}>
      <div className={styles.hedlist}> <Link to="/home" className={styles.linkii}><ButtonSquish className={styles.header_button}>НАЗАД</ButtonSquish></Link><h1>СПИСОК ТЕСТОВ</h1></div>
      <div className={styles.dataList}>
      <div  className={styles.dataItem}>
              
              <h2>Обзорный тест</h2>
              <p>НАШ ТЕСТ</p>
              <p>Программирование</p>
              <p>Неизвестно</p>
              <Link to={"/proftest"} className={styles.lik}></Link>
            </div>
        {data.length > 0 ? (
          data.map((item) => (
            <div key={item.id} className={styles.dataItem}>
              
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <p>{item.subject}</p> 
              <p>{item.data}</p> 
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

export default ListPage;
