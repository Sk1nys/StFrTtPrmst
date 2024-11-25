import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import styles from "./styles/QuestPage.module.scss";
import { Link } from "react-router-dom";
import ButtonSquish from '../Components/Buttons/ButtonSquish';

interface DataItem {
  id: number;
  question: Question;
  text: string;
  iscorrect: boolean;
}

interface Question {
  id: number;
  text: string;
  type: number;
}

const shuffleArray = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};

const TestPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [groupedData, setGroupedData] = useState<Record<number, DataItem[]>>({});
  const [shuffledQuestionKeys, setShuffledQuestionKeys] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number[] | string | number>>(
    JSON.parse(localStorage.getItem('answers') || '{}')
  );
  const [cookies, setCookie] = useCookies(['id']);
  const [score, setScore] = useState<number>(JSON.parse(localStorage.getItem('score') || '0'));

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
      setShuffledQuestionKeys(shuffleArray(Object.keys(result).map(Number)));
    }
  }, [data]);

  useEffect(() => {
    localStorage.setItem('answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem('score', JSON.stringify(score));
  }, [score]);

  const handleAnswerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    questionId: number,
    answerId?: number
  ) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = { ...prevAnswers };
      if (answerId !== undefined) {
        if (!Array.isArray(updatedAnswers[questionId])) {
          updatedAnswers[questionId] = [];
        }
        if (e.target.type === 'checkbox') {
          if (e.target.checked) {
            if (!updatedAnswers[questionId].includes(answerId)) {
              updatedAnswers[questionId].push(answerId);
            }
          } else {
            updatedAnswers[questionId] = (updatedAnswers[questionId] as number[]).filter(
              (id) => id !== answerId
            );
          }
        } else if (e.target.type === 'radio') {
          updatedAnswers[questionId] = answerId;
        }
      } else {
        updatedAnswers[questionId] = e.target.value;
      }

      let newScore = 0;

      Object.keys(updatedAnswers).forEach((questionIdStr) => {
        const qId = Number(questionIdStr);
        const selectedAnswers = updatedAnswers[qId];
        const questionData = groupedData[qId] || [];

        if (Array.isArray(selectedAnswers)) {
          const correctAnswersForQuestion =
            questionData.filter((item) => item.iscorrect).map((item) => item.id) || [];
          const hasIncorrectAnswer = (selectedAnswers as number[]).some(
            (answerId) => questionData.find((item) => item.id === answerId && !item.iscorrect)
          );
          if (!hasIncorrectAnswer) {
            newScore += (selectedAnswers as number[]).filter((answerId) =>
              correctAnswersForQuestion.includes(answerId)
            ).length;
          }
        } else if (typeof selectedAnswers === 'number') {
          const correctAnswerId = questionData.find((item) => item.iscorrect)?.id;
          if (correctAnswerId === selectedAnswers) {
            newScore += 1;
          }
        } else {
          const correctAnswer = questionData.find((item) => item.iscorrect)?.text.trim().toLowerCase();
          if (correctAnswer && (selectedAnswers as string).trim().toLowerCase() === correctAnswer) {
            newScore += 1;
          }
        }
      });

      setScore(newScore);

      return updatedAnswers;
    });
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) =>
      prevIndex < shuffledQuestionKeys.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handlePreviosQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user_id = cookies.id;
    const date = new Date().toISOString();

    const total_score = Object.keys(groupedData).reduce((acc, questionId) => {
      const correctAnswers = groupedData[Number(questionId)].filter((item) => item.iscorrect)
        .length;
      return acc + correctAnswers;
    }, 0);

    const payload = {
      test_id: id,
      score: score,
      total_score: total_score,
      data: date,
      user_id: user_id,
    };

    console.log('Payload:', payload);

    try {
      const response = await axios.post('http://localhost:8000/result/create', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Results submitted successfully:', response.data);

      localStorage.removeItem('answers');
      localStorage.removeItem('score');
      setAnswers({});
      setScore(0);
    } catch (error: any) {
      console.error('Error submitting results:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const currentQuestionKey = shuffledQuestionKeys[currentQuestionIndex];
  const currentQuestion = currentQuestionKey ? groupedData[currentQuestionKey] : [];

  return (
    <div className={styles.QuestCon}>
      <div className={styles.hedlist}><Link to="/list" className={styles.btnBack}><ButtonSquish>НАЗАД</ButtonSquish></Link> <h1>Название Теста</h1></div>
      <form className={styles.questionGroup} onSubmit={handleSubmit}>
        {currentQuestion.length > 0 ? (
          <div className={styles.quest}>
            <h3>{currentQuestion[0].question.text}</h3>
            
            {currentQuestion[0].question.type === 2 ? (
              <input
                type="text"
                onChange={(e) => handleAnswerChange(e, currentQuestion[0].question.id)}
                value={answers[currentQuestion[0].question.id] as string || ''}
              />
            ) : currentQuestion[0].question.type === 3 ? (
              currentQuestion.map((item) => (
                <div key={item.id} className={styles.dataItem}>
                  <input
                    type="radio"
                    className={styles.rad1}
                    id={`answer-${item.id}`}
                    name={`answer-${currentQuestion[0].question.id}`}
                    onChange={(e) => handleAnswerChange(e, item.question.id, item.id)}
                    checked={answers[item.question.id] === item.id}
                  />
                  <label className={styles.radlab} htmlFor={`answer-${item.id}`}>{item.text}</label>
                </div>
              ))
            ) : (
              currentQuestion.map((item) => (
                <div key={item.id} className={styles.dataItem}>
                  <input
                    className={styles.check}
                    type="checkbox"
                    id={`answer-${item.id}`}
                    name={`answer-${item.id}`}
                    onChange={(e) => handleAnswerChange(e, item.question.id, item.id)}
                    checked={
                      Array.isArray(answers[item.question.id]) &&
                      (answers[item.question.id] as number[]).includes(item.id)
                    }
                  />
                  <label htmlFor={`answer-${item.id}`} className={styles.checkboxBtn}>{item.text}</label>
                </div>
              ))
            )}
          </div>
        ) : (
         <p>No data available</p>
        )}

        <div className={styles.PrevNext}>
          {currentQuestionIndex > 0 && (
            <input type="button" value="Преведущий вопрос" onClick={handlePreviosQuestion} />
          )}

          {currentQuestionIndex < shuffledQuestionKeys.length - 1 && (
            <input type="button" value="Следующий вопрос" onClick={handleNextQuestion} />
          )}

        </div>
        {currentQuestionIndex === shuffledQuestionKeys.length - 1 && (
          <div className={styles.subb}>
            <button type="submit">Отправить ответы</button>
          </div>
        )}
      </form>
      <div>
        
      </div>
    </div>
  );
};

export default TestPage;
