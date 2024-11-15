import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

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
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [groupedData, setGroupedData] = useState<Record<number, DataItem[]>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [cookies, setCookie] = useCookies(['id']);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<DataItem[]>(`http://localhost:8000/answer/view?test_id=${id}`);
        setData(response.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>, questionId: number, answerId: number) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = { ...prevAnswers };
      if (!updatedAnswers[questionId]) {
        updatedAnswers[questionId] = [];
      }
      if (e.target.checked) {
        if (!updatedAnswers[questionId].includes(answerId)) {
          updatedAnswers[questionId].push(answerId);
        }
      } else {
        updatedAnswers[questionId] = updatedAnswers[questionId].filter(id => id !== answerId);
      }


      const correctAnswers = groupedData[questionId]?.filter(item => item.iscorrect).map(item => item.id) || [];
      const incorrectAnswers = groupedData[questionId]?.filter(item => !item.iscorrect).map(item => item.id) || [];
      let newScore = 0;

      Object.keys(updatedAnswers).forEach(questionIdStr => {
        const qId = Number(questionIdStr);
        const selectedAnswers = updatedAnswers[qId];
        const correctAnswersForQuestion = groupedData[qId]?.filter(item => item.iscorrect).map(item => item.id) || [];

        // Если среди выбранных ответов есть неправильный, не добавляем очки
        const hasIncorrectAnswer = selectedAnswers.some(answerId => incorrectAnswers.includes(answerId));
        if (!hasIncorrectAnswer) {
          newScore += selectedAnswers.filter(answerId => correctAnswersForQuestion.includes(answerId)).length;
        }
      });

      setScore(newScore);
      return updatedAnswers;
    });
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => (prevIndex < questionKeys.length - 1 ? prevIndex + 1 : prevIndex));
  };

  const handlePreviosQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user_id = cookies.id;
    const date = new Date().toISOString();

    const total_score = Object.keys(groupedData).reduce((acc, questionId) => {
      const correctAnswers = groupedData[Number(questionId)].filter(item => item.iscorrect).length;
      return acc + correctAnswers;
    }, 0);

    const payload = {
      test_id: id,
      score: score,
      total_score: total_score,
      data: date,
      user_id: user_id,
    };

    try {
      const response = await axios.post('http://localhost:8000/result/create', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Results submitted successfully:', response.data);
    } catch (error: any) {
      console.error('Error submitting results:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const questionKeys = Object.keys(groupedData);
  const currentQuestionKey = questionKeys[currentQuestionIndex];
  const currentQuestion = currentQuestionKey ? groupedData[Number(currentQuestionKey)] : [];

  return (
    <div>
      <form className="data-list" onSubmit={handleSubmit}>
        {currentQuestion.length > 0 ? (
          <div className="question-group">
            <h3>{currentQuestion[0].question.text}</h3>
            {currentQuestion.map((item) => (
              <div key={item.id} className="data-item">
                <label htmlFor={`answer-${item.id}`}>{item.text}</label>
                <input
                  type="checkbox"
                  id={`answer-${item.id}`}
                  name={`answer-${item.id}`}
                  onChange={(e) => handleAnswerChange(e, item.question.id, item.id)}
                  checked={answers[item.question.id]?.includes(item.id) || false}
                />
                <span style={{ color: item.iscorrect ? 'green' : 'red' }}>
                  {item.iscorrect ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p>No data available</p>
        )}

        <div>
          {currentQuestionIndex > 0 && (
            <input type="button" value="Преведущий вопрос" onClick={handlePreviosQuestion} />
          )}

          {currentQuestionIndex < questionKeys.length - 1 && (
            <input type="button" value="Следующий вопрос" onClick={handleNextQuestion} />
          )}
        </div>
        {currentQuestionIndex === questionKeys.length - 1 && (
          <div>
            <button type="submit">Отправить ответы</button>
          </div>
        )}
      </form>
      <div>
        <h2>Score: {score}</h2> {/* Добавлено отображение счета */}
      </div>
    </div>
  );
};

export default TestPage;
