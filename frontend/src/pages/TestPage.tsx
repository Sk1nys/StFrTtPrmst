import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { Link } from "react-router-dom";
import ButtonSquish from '../Components/Buttons/ButtonSquish'
import styles from "./styles/TestPage.module.scss"

// Интерфейс для данных, которые мы получаем с сервера
interface Data {
    id: number;
    title: string;
    description: string;
    subject: string;
    data: string;
}

const TestPage: FC = () => {
    const { id } = useParams<{ id: string }>(); // Получаем параметр id из URL

    // Состояния компонента для загрузки данных
    const [data, setData] = useState<Data | null>(null); // Данные с сервера
    const [loading, setLoading] = useState<boolean>(true); // Статус загрузки
    const [error, setError] = useState<AxiosError | null>(null); // Ошибка (если есть)

    useEffect(() => {
        //if (!id) return; // Если id нет, не выполняем запрос

        // Отправляем GET-запрос на сервер с указанием ID
        axios.get<Data>(`http://localhost:8000/test/view?id=${id}`)
            .then((response) => {
                setData(response.data); // Записываем полученные данные в состояние
                setLoading(false);
            })
            .catch((err: AxiosError) => {
                setError(err); // Обрабатываем ошибку
                setLoading(false);
            });
    }, [id]); // Эффект срабатывает при изменении id

    // Условный рендеринг в зависимости от состояния загрузки и ошибок
    if (loading) return <div>Loading...</div>;
    //if (error) return <div>Error: {error.message}</div>;

    return (
        <div className={styles.DescContainer}>
            <div className={styles.hedlist}> <Link to="/list" className={styles.linkii}><ButtonSquish className={styles.header_button}>НАЗАД</ButtonSquish></Link><h1>ОПИСАНИЕ</h1></div>
            {data ? (
                <div className={styles.blockDescriptoins}>
                    <h3>{data.title}</h3> {/* Название */}
                    <p>{data.description}</p> {/* Описание */}
                    <p>{data.subject}</p> {/* Предмет */}
                    <p>{data.data}</p> {/* Дата */}
                </div>
            ) : (
                <div className={styles.blockDescriptoins}>
                <h3>Название</h3> {/* Название */}
                <p>Описание</p> {/* Описание */}
                <p>Предмет</p> {/* Предмет */}
                <p>Дата</p> {/* Дата */}
            </div>
                //<div>No data available</div>
            )}
           <ButtonSquish className={styles.header_button}> <a href={`/question/${id}`}>НАЧАТЬ ТЕСТ</a></ButtonSquish>
        </div>
        
    );
};

export default TestPage;
