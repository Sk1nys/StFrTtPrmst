import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { useCookies } from 'react-cookie';
import styles from "./styles/QuestPage.module.scss";
import { Link } from "react-router-dom";
import ButtonSquish from '../Components/Buttons/ButtonSquish';
import CryptoJS from 'crypto-js';

interface DataItem {
  id: number;
  question: Question;
  text: string;
  iscorrect: boolean;
}

interface Question {
  id: number;
  text: string;
  type: string;
  test: Test;
}
interface Test {
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

const shuffleArray = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};

const QuestionPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<DataItem[]>([]);
  const [test, setTest] = useState<Test | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const [groupedData, setGroupedData] = useState<Record<number, DataItem[]>>({});
  const [shuffledQuestionKeys, setShuffledQuestionKeys] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number[] | string | number>>(
    JSON.parse(localStorage.getItem('answers') || '{}')
  );
  const [cookies] = useCookies(['id']);
  const decryptedUserId = decrypt(cookies.id);
  const [score, setScore] = useState<number>(JSON.parse(localStorage.getItem('score') || '0'));
  const [hasTakenTest, setHasTakenTest] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null); // Состояние для ошибок валидации

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<DataItem[]>(`http://localhost:8000/answer/view?test_id=${id}`);
        setData(response.data);
      } catch (error: any) {
        //setError(error.message);
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
    axios.get<Test>(`http://localhost:8000/test/view?id=${id}`)
      .then((response) => {
        setTest(response.data);
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

    // Проверка на заполненность всех полей
    const unansweredQuestions = shuffledQuestionKeys.filter((key) => {
      const answer = answers[Number(key)];
      return answer === undefined || (Array.isArray(answer) && answer.length === 0);
    });

    if (unansweredQuestions.length > 0) {
      setValidationError('Пожалуйста, ответьте на все вопросы.');
      return;
    } else {
      setValidationError(null); // Сброс ошибки валидации
    }

    const user_id = decryptedUserId;
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

    // Вывод данных в консоль
    console.log("Отправляемые данные:", payload);

    try {
      const response = await axios.post('http://localhost:8000/result/create', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      localStorage.removeItem('answers');
      localStorage.removeItem('score');
      setAnswers({});
      setScore(0);
      window.location.href = `/home`; 
    } catch (error: any) {
      console.error("Ошибка при отправке данных:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (hasTakenTest && test?.disposable) {
    return <div>Вы уже прошли этот тест, он одноразовый.</div>;
  }

  const currentQuestionKey = shuffledQuestionKeys[currentQuestionIndex];
  const currentQuestion = currentQuestionKey ? groupedData[currentQuestionKey] : [];

  return (
    <div className={styles.QuestCon}>
      <div className={styles.hedlist}><Link to="/list" className={styles.btnBack}><ButtonSquish>НАЗАД</ButtonSquish></Link> <h1>Название Теста</h1></div>
      
      <form className={styles.questionGroup} onSubmit={handleSubmit}>
        {currentQuestion.length > 0 ? (
          <div className={styles.quest}>
            <h3>{currentQuestion[0].question.text}</h3>
            
            {currentQuestion[0].question.type === 'Вписать ответ' ? (
              <input
                type="text"
                onChange={(e) => handleAnswerChange(e, currentQuestion[0].question.id)}
                value={answers[currentQuestion[0].question.id] as string || ''}
              />
            ) : currentQuestion[0].question.type === 'Один правильный ответ' ? (
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

        {validationError && <div className={styles.error}>{validationError}</div>} {/* Отображение ошибки валидации */}

        <div className={styles.PrevNext}>
          {currentQuestionIndex > 0 && (
            <input type="button" value="Преведший вопрос" onClick={handlePreviosQuestion} />
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

export default QuestionPage;
