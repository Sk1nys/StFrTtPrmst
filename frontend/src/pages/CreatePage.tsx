import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import CryptoJS from 'crypto-js';
import styles from './styles/CreatePage.module.scss';
import ButtonSquish from '../Components/Buttons/ButtonSquish';
import Modal from "../Components/Modal/Modal"

interface FormData {
  title: string;
  description: string;
  subject: string;
  disposable: number;
  user_id?: number;
}

interface QuestionFormData {
  text: string;
  type: string;
  answers: AnswerFormData[];
}

interface AnswerFormData {
  answer_text: string;
  iscorrect: number;
}

const decrypt = (text: string) => {
  const bytes = CryptoJS.AES.decrypt(text, 'secret-key');
  return bytes.toString(CryptoJS.enc.Utf8);
};

const CreatePage: React.FC = () => {
  const [cookies] = useCookies(['id']);
  const decryptedUserId = decrypt(cookies.id);

  const [formData, setFormData] = useState<FormData>(() => {
    const savedData = localStorage.getItem('formData');
    return savedData ? JSON.parse(savedData) : { title: '', description: '', subject: '', disposable: 0, user_id: undefined };
  });

  const [questionForms, setQuestionForms] = useState<QuestionFormData[]>(() => {
    const savedQuestions = localStorage.getItem('questionForms');
    return savedQuestions ? JSON.parse(savedQuestions) : [{ text: '', type: '', answers: [{ answer_text: '', iscorrect: 0 }] }];
  });

  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelMessage, setExcelMessage] = useState<string>('');
  const [excelData, setExcelData] = useState<any>(null);
  const [wordFile, setWordFile] = useState<File | null>(null);
  const [wordMessage, setWordMessage] = useState<string>('');
  const [wordData, setWordData] = useState<any>(null);
  const [validationError, setValidationError] = useState<string | null>(null); // Состояние для ошибок валидации

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('questionForms', JSON.stringify(questionForms));
  }, [questionForms]);

  useEffect(() => {
    if (excelData && excelData.tests && excelData.tests.length > 0) {
      const loadedTest = excelData.tests[0];
      setFormData({
        title: loadedTest.title || '',
        description: loadedTest.description || '',
        subject: loadedTest.subject || '',
        disposable: loadedTest.disposable ? 1 : 0,
        user_id: Number(decryptedUserId)
      });

      const loadedQuestions = excelData.questions.map((question: any) => ({
        text: question.text || '',
        type: question.type || '',
        answers: excelData.answers.filter((answer: any) => answer.question_text === question.text).map((answer: any) => ({
          answer_text: answer.answer_text || '',
          iscorrect: answer.is_correct ? 1 : 0
        }))
      }));
      setQuestionForms(loadedQuestions);
    }
  }, [excelData, decryptedUserId]);

  useEffect(() => {
    if (wordData && wordData.tests && wordData.tests.length > 0) {
      const loadedTest = wordData.tests[0];

      setFormData({
        title: loadedTest.title || '',
        description: loadedTest.description || '',
        subject: loadedTest.subject || '',
        disposable: loadedTest.disposable ? 1 : 0,
        user_id: Number(decryptedUserId)
      });

      const loadedQuestions = wordData.questions.map((question: any) => ({
        text: question.text || '',
        type: question.type || '',
        answers: wordData.answers.filter((answer: any) => answer.question_text === question.text).map((answer: any) => ({
          answer_text: answer.answer_text || '',
          iscorrect: answer.is_correct ? 1 : 0
        }))
      }));

      setQuestionForms(loadedQuestions);
    }
  }, [wordData, decryptedUserId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData({ ...formData, disposable: checked ? 1 : 0 });
  };

  const handleQuestionChange = (index: number, e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newQuestionForms = [...questionForms];
    newQuestionForms[index] = { ...newQuestionForms[index], [name]: value };
    setQuestionForms(newQuestionForms);
  };

  const handleAnswerChange = (qIndex: number, aIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newQuestionForms = [...questionForms];
    newQuestionForms[qIndex].answers[aIndex] = { ...newQuestionForms[qIndex].answers[aIndex], [name]: value };
    setQuestionForms(newQuestionForms);
  };

  const handleCorrectChange = (qIndex: number, aIndex: number) => {
    const newQuestionForms = [...questionForms];
    newQuestionForms[qIndex].answers[aIndex].iscorrect = newQuestionForms[qIndex].answers[aIndex].iscorrect === 0 ? 1 : 0;
    setQuestionForms(newQuestionForms);
  };

  const addQuestionForm = () => {
    setQuestionForms([...questionForms, { text: '', type: '', answers: [{ answer_text: '', iscorrect: 0 }] }]);
  };

  const removeQuestionForm = (index: number) => {
    const newQuestionForms = questionForms.filter((_, qIndex) => qIndex !== index);
    setQuestionForms(newQuestionForms);
  };

  const addAnswerForm = (index: number) => {
    const newQuestionForms = [...questionForms];
    newQuestionForms[index].answers.push({ answer_text: '', iscorrect: 0 });
    setQuestionForms(newQuestionForms);
  };

  const removeAnswerForm = (qIndex: number, aIndex: number) => {
    const newQuestionForms = [...questionForms];
    newQuestionForms[qIndex].answers = newQuestionForms[qIndex].answers.filter((_, ansIndex) => ansIndex !== aIndex);
    setQuestionForms(newQuestionForms);
  };

  const handleExcelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setExcelFile(e.target.files[0]);
    }
  };

  const handleWordFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setWordFile(e.target.files[0]);
    }
  };

  const handleWordUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!wordFile) {
      setWordMessage('Пожалуйста, выберите файл.');
      return;
    }

    const formData = new FormData();
    formData.append('file', wordFile);
    formData.append('user_id', decryptedUserId);

    try {
      const response = await axios.post('http://localhost:8000/upload/word', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setWordMessage('Файл успешно загружен.');
      setWordData(response.data);
    } catch (error) {
      setWordMessage('Ошибка при загрузке файла.');
    }
  };

  const handleExcelUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!excelFile) {
      setExcelMessage('Пожалуйста, выберите файл.');
      return;
    }

    const formData = new FormData();
    formData.append('file', excelFile);
    formData.append('user_id', decryptedUserId);

    try {
      const response = await axios.post('http://localhost:8000/upload/exel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setExcelMessage('Файл успешно загружен.');
      setExcelData(response.data);
    } catch (error) {
      setExcelMessage('Ошибка при загрузке файла.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Проверка на заполненность всех полей
    if (!formData.title || !formData.description || !formData.subject) {
      setValidationError('Пожалуйста, заполните все обязательные поля: Название, Описание и Предмет.');
      return;
    }
  
    const hasEmptyQuestions = questionForms.some(question => !question.text || !question.type || question.answers.some(answer => !answer.answer_text));
    if (hasEmptyQuestions) {
      setValidationError('Пожалуйста, заполните все поля вопросов и ответов.');
      return;
    } else {
      setValidationError(null); // Сброс ошибки валидации
    }
  
    const today = new Date().toISOString().split('T')[0];
    const formDataWithDateAndUserId = { ...formData, data: today, user_id: Number(decryptedUserId) };
  
    console.log('Отправляемые данные теста:', formDataWithDateAndUserId);
    console.log('Отправляемые вопросы:', questionForms);
  
    try {
      const testResponse = await axios.post('http://localhost:8000/test/create', formDataWithDateAndUserId, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const testId = testResponse.data.id;
  
      await Promise.all(questionForms.map(async (questionFormData, qIndex) => {
        const questionFormDataWithTestId = { ...questionFormData, test_id: testId };
  
        const questionResponse = await axios.post('http://localhost:8000/question/create', questionFormDataWithTestId, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        const questionId = questionResponse.data.id;
        await Promise.all(questionFormData.answers.map(async (answerFormData, aIndex) => {
          const answerFormDataWithQuestionId = { ...answerFormData, question_id: questionId };
  
          await axios.post('http://localhost:8000/answers/create', answerFormDataWithQuestionId, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }));
      }));
  
      localStorage.removeItem('formData');
      localStorage.removeItem('questionForms');
  
      // Редирект на страницу теста
      window.location.href = `/test/${testId}`;
      
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
    }
  };
  
 const [modalActive, setModalActive] = useState(false);

  return (
    <div className={styles.conMain}>
      <form onSubmit={handleSubmit}>
        <div className={styles.headSt}>
          <Link to='/home' className={styles.backBtn}>
            <ButtonSquish>НАЗАД</ButtonSquish>
          </Link>
          <div className={styles.titles}>
            <input type='text' name='title' value={formData.title} onChange={handleChange} placeholder='Название теста' />
          </div>
        </div>
        <div className={styles.op}>
          <div className={styles.desc}>
            <label htmlFor="description">Описание</label>
            <input type='text' name='description' value={formData.description} onChange={handleChange} placeholder='Опишете про что будет тест' />
          </div>
          <div className={styles.subj}>
            <label htmlFor="subject">Предмет</label>
            <input type='text' name='subject' value={formData.subject} onChange={handleChange} placeholder='Напишите сферу знаний на которую будет тест' />
          </div>
          <div className={styles.disposable}>
            <input type="checkbox" checked={formData.disposable === 1} onChange={handleCheckboxChange} className={styles.answC}/>
            <label className={styles.CLab}>Одноразовый тест</label>
          </div>
        </div>
        {questionForms.map((questionFormData, qIndex) => (
          <div key={qIndex} className={styles.quepro}>
            <label htmlFor="text">Вопрос</label>
            <input
              className={styles.quename}
              type='text'
              name='text'
              value={questionFormData.text}
              onChange={(e) => handleQuestionChange(qIndex, e)}
              placeholder='Задайте вопрос'
            />
            <label>Введите ответы</label>
            <div>
              <select
                className={styles.queSel}
                name='type'
                value={questionFormData.type}
                onChange={(e) => handleQuestionChange(qIndex, e)}
              >
                <option value='' disabled>Выберите тип вопроса</option>
                <option value='Множественный выбор'>Множественный выбор</option>
                <option value='Вписать ответ'>Вписать ответ</option>
                <option value='Один правильный ответ'>Один правильный ответ</option>
              </select>
            </div>
            {questionFormData.answers.map((answerFormData, aIndex) => (
              <div key={aIndex} className={styles.answGr}>
                <input
                  className={styles.answ}
                  type='text'
                  name='answer_text'
                  value={answerFormData.answer_text}
                  onChange={(e) => handleAnswerChange(qIndex, aIndex, e)}
                  placeholder='Ответ'
                />
                {questionFormData.type === 'Множественный выбор' ? (
                  <div className={styles.answOp}>
                    <input
                      className={styles.answC}
                      type='checkbox'
                      name='iscorrect'
                      checked={answerFormData.iscorrect === 1}
                      onChange={() => handleCorrectChange(qIndex, aIndex)}
                    />
                    <label className={styles.CLab} htmlFor='iscorrect'>Правильный</label>
                  </div>
                ) : questionFormData.type !== 'Вписать ответ' && (
                  <div className={styles.answOp}>
                    <input
                      className={styles.answR}
                      type='radio'
                      name={`iscorrect-${qIndex}`}
                      checked={answerFormData.iscorrect === 1}
                      onChange={() => handleCorrectChange(qIndex, aIndex)}
                    />
                    <label className={styles.RLab} htmlFor='iscorrect'>Правильный</label>
                  </div>
                )}
                <button className={styles.delAnsw} type='button' onClick={() => removeAnswerForm(qIndex, aIndex)}></button>
              </div>
            ))}
            <button className={styles.plusAnsw} type='button' onClick={() => addAnswerForm(qIndex)}><span className={styles.tip}>Добавить ответ</span></button>

            <button className={styles.delQue} type='button' onClick={() => removeQuestionForm(qIndex)}></button>
          </div>
        ))}
        <div>
          <button className={styles.plusQue} type='button' onClick={addQuestionForm}><span className={styles.tip}>Добавить вопрос</span></button>
        </div>
        {validationError && <div className={styles.error}>{validationError}</div>} {/* Отображение ошибки валидации */}
        <button className={styles.subchik} type='submit'>
        <ButtonSquish>
          СОЗДАТЬ ТЕСТ И ВОПРОС
        </ButtonSquish>
        </button>
      </form>
      <div className={styles.doc}>
        <form className={styles.wordDoc} onSubmit={handleWordUpload}>
          <h2>Загрузка Word файлов</h2>
          <h3>Нажите на документ чтобы выбрать файл</h3>
          <div className={styles.iconDoc}><i title="doc"></i><input className={styles.i} type="file" accept=".docx" onChange={handleWordFileChange} /></div>
          <ButtonSquish><button className={styles.o} type="submit">Загрузить</button></ButtonSquish>
        </form>
        {wordMessage && <p>{wordMessage}</p>}

        <form className={styles.exelDoc} onSubmit={handleExcelUpload}>
          <h2>Загрузка Excel файлов</h2>
          <h3>Нажите на документ чтобы выбрать файл</h3>
          <div className={styles.iconSheet}><i title="xlsx"></i><input className={styles.i} type="file" accept=".xlsx" onChange={handleExcelFileChange} /></div>
          <ButtonSquish><button className={styles.o} type="submit">Загрузить</button></ButtonSquish>
        </form>
      </div>
      {excelMessage && <p>{excelMessage}</p>}
      <div className={styles.help}>
        <button  className={styles.helpBtn} onClick={()=>setModalActive(true)}>Как должен выглядить файл для загрузки</button>
      </div>
     <Modal active={modalActive} setActive={setModalActive}>
      <div className={styles.helps}>
        <div className={styles.helpDoc}>
          <h2>Пример для Ворд файлов</h2>
          <p> Название: Тест по математике<br />
              Описание: Этот тест оценивает базовые математические знания.<br />
              Предмет: Математика<br />
              Одноразовый тест: да<br />
              Вопрос: Что такое 2 + 2?<br />
              Тип: Один правильный ответ<br />
              Ответ 3(не правильный)<br />
              Ответ 4(правильный)<br />
              Ответ 5(не правильный)<br />
              Вопрос: Выберите правильные цвета флага России.<br />
              Тип: Множественный выбор<br />
              Ответ Красный(правильный)<br />
              Ответ Синий(правильный)<br />
              Ответ Зеленый(не правильный)<br />
              Ответ Белый(правильный)<br />
</p>
        </div>
        <div className={styles.helpExel}>
          <h2>Пример для Ексель файлов</h2>
          <table border = "1">
            <tr>
              <td>Название</td><td>Тест по математике</td>
            </tr>
            <tr>
              <td>Описание</td><td>Этот тест оценивает базовые математические знания.</td>
            </tr>
            <tr>
              <td>Предмет</td><td>Математика</td>
            </tr>
            <tr>
              <td>Одноразовый тест</td><td>да</td>
            </tr>
            <tr>
              <td>Вопрос</td><td> Что такое 2 + 2?</td>
            </tr>
            <tr>
              <td>Тип</td><td>Один правильный ответ</td>
            </tr>
            <tr>
              <td>Ответ 1</td><td>4(правильный)</td>
            </tr>
            <tr>
              <td>Ответ 2</td><td>3(не правильный)</td>
            </tr>
            <tr>
              <td>Ответ 3</td><td>5(не правильный)</td>
            </tr>
          </table>
        </div>
      </div>
      </Modal>
    </div>
  );
};

export default CreatePage;
