import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { Link } from "react-router-dom";
import ButtonSquish from '../Components/Buttons/ButtonSquish';
import styles from "./styles/TestPage.module.scss";

interface Data {
    id: number;
    title: string;
    description: string;
    subject: string;
    data: string;
}

interface User {
    id: number;
    username: string;
}

interface Result {
    id: number;
    score: number;
    total_score: number;
    user: User; // Adjusted to reflect the user structure
}

const TestPage: FC = () => {
    const { id } = useParams<{ id: string }>(); 

    const [data, setData] = useState<Data | null>(null);
    const [results, setResults] = useState<Result[]>([]); // Changed to array of Results
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<AxiosError | null>(null);

    useEffect(() => {
        axios.get<Data>(`http://localhost:8000/test/view?id=${id}`)
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((err: AxiosError) => {
                setError(err); 
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        axios.get<Result[]>(`http://localhost:8000/result/test-users?test_id=${id}`)
            .then((response) => {
                setResults(response.data);
                setLoading(false);
            })
            .catch((err: AxiosError) => {
                setError(err); 
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className={styles.DescContainer}>
            <div className={styles.hedlist}> 
                <Link to="/list" className={styles.linkii}>
                    <ButtonSquish className={styles.header_button}>НАЗАД</ButtonSquish>
                </Link>
                <h1>ОПИСАНИЕ</h1>
            </div>
            {data ? (
                <div className={styles.blockDescriptoins}>
                    <h3>{data.title}</h3> 
                    <p>{data.description}</p>
                    <p>{data.subject}</p> 
                    <p>{data.data}</p> 
                </div>
            ) : (
                <div className={styles.blockDescriptoins}>
                    <h3>Название</h3>
                    <p>Описание</p> 
                    <p>Предмет</p> 
                    <p>Дата</p> 
                </div>
            )}
            <a href={`/question/${id}`}>
                <ButtonSquish className={styles.header_button}>НАЧАТЬ ТЕСТ</ButtonSquish>
            </a>

            <div className={styles.resultsContainer}>
                <h2>Результаты пользователей:</h2>
                {results.map(result => (
                    <div key={result.id} className={styles.resultItem}>
                        <p>Пользователь: {result.user.username}</p>
                        <p>Счет: {result.score} / {result.total_score}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestPage;
