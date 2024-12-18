import React, {useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
const FirstEpisode: React.FC = () => {
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isMonday, setIsMonday] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['answr']);
  const [decrypteAnswer, setDecryptedAnswer] = useState<string | null>(null);
  const riddleText = `
      Я первый шаг к новым вершинам,
      После отдыха, где время замирало.
      Собирайся в путь, не теряй момент,
      Встретимся вновь, когда неделя начнется.
  `;
    const encrypt = (text: string) => {
      return CryptoJS.AES.encrypt(text, 'secret-key').toString();
    };
const decrypt = (text: string) => {
  const bytes = CryptoJS.AES.decrypt(text, 'secret-key');
  return bytes.toString(CryptoJS.enc.Utf8);
};
  useEffect(() => {
    if (cookies.answr) {
      setDecryptedAnswer(decrypt(cookies.answr));
    }
  }, [cookies]);
  useEffect(() => {
      const today = new Date();
      const dayOfWeek = today.getDay(); 
      if (dayOfWeek === 3) {
          setIsMonday(true); 
          setCookie('answr', encrypt('goida'), { path: '/' });
         
      }
    else{
        removeCookie('answr', { path: '/' });

    }
  }, []); 

  const correctAnswer = 'goida';

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (decrypteAnswer?.toLowerCase() === correctAnswer) {
          setIsCorrect(true);
      } else {
          setIsCorrect(false);
      }
  };
  return (

<div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Ты на пороге увлекательного путешествия, наполненного загадками и интересными задачами, созданными специально для программистов и любителей логики. </h2>
          <h3>  Приготовься к захватывающим испытаниям, где каждое решение приближает тебя к разгадке шифров и новым горизонтам. Внимательно следи за подсказками и помни: ключ к успеху — это твое желание учиться и исследовать!</h3>
            <pre>{riddleText}</pre>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Ваш ответ"
                    style={{ padding: '10px', width: '300px' }}
                />
                <button type="submit" style={{ padding: '10px', marginLeft: '10px' }}>
                    Проверить
                </button>
            </form>
            {isMonday && (
                <div id="cipher">
                    <h2>ohduq frqnlhv</h2>
                </div>
            )}
            {isCorrect && (
                <div style={{ marginTop: '20px', fontSize: '18px' }}>
                    <Link to='/secondepisode'>
                    <button>Следующий этап</button>
                    </Link>
                </div>
            )}
        </div>
    
  
  )
}

export default FirstEpisode