import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
interface DataItem {
    id: number;
    question_id: Question_id;
    text: string;
    iscorrect: boolean;
}
// Интерфейс для данных, которые мы получаем с сервера
interface Question_id {
  id: number;
  text: string;
}


const TestPage: FC = () => {
    const { id } = useParams<{ id: string }>(); // Получаем параметр id из URL

    // Состояния компонента для загрузки данных
    const [data, setData] = useState<DataItem[]>([]); // Данные с сервера
    const [loading, setLoading] = useState<boolean>(true); // Статус загрузки
    const [error, setError] = useState<string | null>(null); // Ошибка (если есть)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<DataItem[]>(`http://localhost:8000/answer/view?id=${id}`);
                setData(response.data); // Устанавливаем данные
            } catch (error: any) {
                setError(error.message); // Обрабатываем ошибку
            } finally {
                setLoading(false); // Меняем состояние загрузки в любом случае
            }
        };

        fetchData(); // Вызов функции получения данных
    }, [id]); // Эффект срабатывает при изменении id

    // Условный рендеринг в зависимости от состояния загрузки и ошибок
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>

            <div className="data-list">
              {data.length > 0 && (
                <div className="question">
                    <p>{data[0].question_id.text}</p> {/* Уровень */}
                </div>
            )}
                {data.length > 0 ? (
                    data.map((item) => (
                      
                        <div key={item.id} className="data-item">
                          

                            <p>{item.text}</p>
                            
                        </div>
                        
                    ))
                ) : (
                    <p>No data available</p>
                )}
            </div>
            
        </div>
    );
};

export default TestPage;