import React, {useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import styles from './styles/FirstEpisode.module.scss';
import ButtonAroundBorder from '../Components/Buttons/ButtonAroundBorder';
const FirstEpisode: React.FC = () => {
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isMonday, setIsMonday] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['answr']);

  const riddleText = `
      Я первый шаг к новым вершинам,
      После отдыха, где время замирало.
      Собирайся в путь, не теряй момент,
      Встретимся вновь, когда неделя начнется.
  `;
  useEffect(() => {
    if (cookies.answr) {
      setUserAnswer(cookies.answr);
    }
  }, [cookies]);
  useEffect(() => {
      const today = new Date();
      const dayOfWeek = today.getDay(); 
      if (dayOfWeek === 1) {
          setIsMonday(true); 
          setCookie('answr', '05012013', { path: '/' });
         
      }
    else{
        removeCookie('answr', { path: '/' });

    }
  }, []); 

  const correctAnswer = '05012013';

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (userAnswer.toLowerCase() === correctAnswer) {
          setIsCorrect(true);
      } else {
          setIsCorrect(false);
      }
  };
  return (

<div className={styles.main_container}>
    <h2 className={styles.centered}>Ты на пороге увлекательного путешествия, наполненного загадками и интересными задачами, созданными специально для программистов и любителей логики. </h2>
          <h3 className={styles.centered}>  Приготовься к захватывающим испытаниям, где каждое решение приближает тебя к разгадке шифров и новым горизонтам. Внимательно следи за подсказками и помни: ключ к успеху — это твое желание учиться и исследовать!</h3>
            <pre className={styles.verse}>{riddleText}</pre>
            <form onSubmit={handleSubmit} className={styles.centered}>
                <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Ваш ответ"
                    style={{width: '300px' }}
                    className={styles.answer_input}
                />
                <button
                className={styles.answer_submit}
                type="submit" style={{marginLeft: '10px' }}>
                    Проверить
                </button>
            </form>
            {isMonday && (
                <div id="cipher">
                    <h2>ohduq frrnlhv</h2>
                </div>
            )}
            {isCorrect && (
                <div style={{ marginTop: '20px', fontSize: '18px' }}>
                    <Link to='/secondepisode'>
                    <ButtonAroundBorder>Следующий этап</ButtonAroundBorder>
                    </Link>
                </div>
            )}
        </div>
    
  
  )
}

export default FirstEpisode