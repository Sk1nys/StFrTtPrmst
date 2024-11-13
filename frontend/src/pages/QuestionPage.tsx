import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface DataItem {
    id: number;
    question: Question;
    text: string;
    iscorrect: boolean;
}

interface Question {
    id: number;
    text: string;
}

const TestPage: FC = () => {
    const { id } = useParams<{ id: string }>(); // Получаем параметр id из URL

    // Состояния компонента для загрузки данных
    const [data, setData] = useState<DataItem[]>([]); // Данные с сервера
    const [loading, setLoading] = useState<boolean>(true); // Статус загрузки
    const [error, setError] = useState<string | null>(null); // Ошибка (если есть)
    const [groupedData, setGroupedData] = useState<Record<number, DataItem[]>>({}); // Группированные данные
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0); // Индекс текущего вопроса

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<DataItem[]>(`http://localhost:8000/answer/view?test_id=${id}`);
                setData(response.data); // Устанавливаем данные
            } catch (error: any) {
                setError(error.message); // Обрабатываем ошибку
            } finally {
                setLoading(false); // Меняем состояние загрузки в любом случае
            }
        };

        fetchData(); // Вызов функции получения данных
    }, [id]); // Эффект срабатывает при изменении id

    // Группировка данных
    useEffect(() => {
        if (data.length > 0) {
            const result: Record<number, DataItem[]> = data.reduce((acc, item) => {
                if (!acc[item.question.id]) {
                    acc[item.question.id] = [];
                }
                acc[item.question.id].push(item);
                return acc;
            }, {} as Record<number, DataItem[]>);
            setGroupedData(result);
        }
    }, [data]);

    // Условный рендеринг в зависимости от состояния загрузки и ошибок
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Получение ключей вопросов (id) для удобства навигации
    const questionKeys = Object.keys(groupedData);

    // Функция для перехода к следующему вопросу
    const handleNextQuestion = () => {
        setCurrentQuestionIndex(prevIndex => 
            prevIndex < questionKeys.length - 1 ? prevIndex + 1 : prevIndex
        );
    };

    // Получение текущего вопроса
    const currentQuestionKey = questionKeys[currentQuestionIndex];
    const currentQuestion = currentQuestionKey ? groupedData[Number(currentQuestionKey)] : [];

    return (
        <div>
            <form className="data-list" method='post'> 
                {currentQuestion.length > 0 ? (
                    <div className="question-group">
                        <h3>{currentQuestion[0].question.text}</h3>
                        {currentQuestion.map((item) => (
                            <div key={item.id} className="data-item">
                                <label htmlFor={`answer-${item.id}`}>{item.text}</label>
                                <input type="checkbox" id={`answer-${item.id}`} name={`answer-${item.id}`} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No data available</p>
                )}
                <input type="button" value={'Следующий вопрос'} onClick={handleNextQuestion} />
            </form>
        </div>
    );
};

export default TestPage;