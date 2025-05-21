import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { Link } from "react-router-dom";
import ButtonSquish from '../Components/Buttons/ButtonSquish';
import styles from "./styles/TestPage.module.scss";
import { useCookies } from 'react-cookie';
import CryptoJS from 'crypto-js';
import Loader from '../Components/Loader';
import ButtonDef from '../Components/Buttons/ButtonDef';

interface Data {
    id: number;
    title: string;
    description: string;
    subject: string;
    data: string;
    disposable: boolean;
}

interface User {
    id: number;
    username: string;
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

const TestPage: FC = () => {
    const [cookies] = useCookies(['id']);
    const decryptedUserId = decrypt(cookies.id);

    const { id } = useParams<{ id: string }>(); 

    const [data, setData] = useState<Data | null>(null);
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<AxiosError | null>(null);
    const [hasTakenTest, setHasTakenTest] = useState<boolean>(false); 

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
                
                // Проверка, прошел ли пользователь тест
                const userHasTakenTest = response.data.some(result => result.user.id.toString() === decryptedUserId);
                setHasTakenTest(userHasTakenTest);
            })
            .catch((err: AxiosError) => {
                setError(err); 
                setLoading(false);
            });
    }, [id, decryptedUserId]);

    if (loading) return <Loader />;

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
                    <p>{data.disposable === true ? 'Одноразовый тест' : 'Многоразовый тест'}</p>
                </div>
            ) : (
                <div className={styles.blockDescriptoins}>
                    <h3>Название</h3>
                    <p>Описание</p> 
                    <p>Предмет</p> 
                    <p>Дата</p> 
                </div>
            )}
            {data?.disposable === true && hasTakenTest ? (
                <p className={styles.Ag}>Вы уже прошли этот тест.</p>
            ) : (
                <a href={`/question/${id}`}>
                    <ButtonDef className={styles.header_button}>НАЧАТЬ ТЕСТ</ButtonDef>
                </a>
            )}

            <div className={styles.resultsContainer}>
                <h2>Результаты пользователей:</h2>
                {results.map(result => (
                    <div key={result.id} className={styles.resultItem}>
                        <p>Пользователь: {result.user.username}</p>
                        <p>Счет: {result.score} / {result.total_score}</p>
                        <p>Оценка: {result.score/result.score<0.5? 2:result.score/result.score>0.75? 5:result.score/result.score>0.5? 4:3}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestPage;
