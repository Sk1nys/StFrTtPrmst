import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import CryptoJS from 'crypto-js';
import styles from './styles/CreatePage.module.scss';
import ButtonSquish from '../Components/Buttons/ButtonSquish';

interface FormData {
  title: string;
  description: string;
  subject: string;
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
    return savedData ? JSON.parse(savedData) : { title: '', description: '', subject: '', user_id: undefined };
  });

  const [questionForms, setQuestionForms] = useState<QuestionFormData[]>(() => {
    const savedQuestions = localStorage.getItem('questionForms');
    return savedQuestions ? JSON.parse(savedQuestions) : [{ text: '', type: '', answers: [{ answer_text: '', iscorrect: 0 }] }];
  });

  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [fileData, setFileData] = useState<string>('');
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelMessage, setExcelMessage] = useState<string>('');
  const [excelData, setExcelData] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('questionForms', JSON.stringify(questionForms));
  }, [questionForms]);

  useEffect(() => {
    if (excelData) {
      const loadedTest = excelData.tests[0];
      setFormData({
        title: loadedTest.title,
        description: loadedTest.description,
        subject: loadedTest.subject,
        user_id: Number(decryptedUserId)
      });

      const loadedQuestions = excelData.questions.map((question: any) => ({
        text: question.text,
        type: question.type,
        answers: excelData.answers.filter((answer: any) => answer.question_text === question.text).map((answer: any) => ({
          answer_text: answer.answer_text,
          iscorrect: answer.is_correct ? 1 : 0
        }))
      }));
      setQuestionForms(loadedQuestions);
    }
  }, [excelData, decryptedUserId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleExcelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setExcelFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      setMessage('Пожалуйста, выберите файл.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', decryptedUserId);

    console.log('Uploading file:', file);

    try {
      const response = await axios.post('http://localhost:8000', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Файл успешно загружен.');
      setFileData(response.data.data);
    } catch (error) {
      setMessage('Ошибка при загрузке файла.');
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

    console.log('Uploading Excel file:', excelFile);

    try {
      const response = await axios.post('http://localhost:8000/upload/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setExcelMessage('Файл успешно загружен.');
      setExcelData(response.data);  // Обновляем excelData полученными данными
    } catch (error) {
      setExcelMessage('Ошибка при загрузке файла.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const today = new Date().toISOString().split('T')[0];
    const formDataWithDateAndUserId = { ...formData, data: today, user_id: Number(decryptedUserId) };

    console.log('Form data:', formDataWithDateAndUserId);
    console.log('Question forms:', questionForms);

    try {
      const testResponse = await axios.post('http://localhost:8000/test/create', formDataWithDateAndUserId, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const testId = testResponse.data.id;

      questionForms.forEach(async (questionFormData, qIndex) => {
        const questionFormDataWithTestId = { ...questionFormData, test_id: testId };

        const questionResponse = await axios.post('http://localhost:8000/question/create', questionFormDataWithTestId, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const questionId = questionResponse.data.id;
        questionFormData.answers.forEach(async (answerFormData, aIndex) => {
          const answerFormDataWithQuestionId = { ...answerFormData, question_id: questionId };

          await axios.post('http://localhost:8000/answers/create', answerFormDataWithQuestionId, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        });
      });

      localStorage.removeItem('formData');
      localStorage.removeItem('questionForms');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  
  
  return (
    <div className={styles.conMain}>
      <form onSubmit={handleSubmit}>
      <div className={styles.headSt}>
      <Link to='/home' className={styles.backBtn}>
      <ButtonSquish>
        НАЗАД
      </ButtonSquish>
      </Link>
      <div className={styles.titles}>
          <input
            type='text'
            name='title'
            value={formData.title}
            onChange={handleChange}
            placeholder='Название теста'
          />
        </div>
        </div>
        <div className={styles.op}>
        <div className={styles.desc}>
        <label htmlFor='description'>Описание</label>
          <input
            type='text'
            name='description'
            value={formData.description}
            onChange={handleChange}
            placeholder='Описание'
          />
        </div>
        <div className={styles.subj}>
        <label htmlFor='subject'>Предмет</label>
          <input
            type='text'
            name='subject'
            value={formData.subject}
            onChange={handleChange}
            placeholder='Предмет'
          />
        </div>
        </div>
        {questionForms.map((questionFormData, qIndex) => (
          <div key={qIndex} className={styles.quepro}>  
            <input
              className={styles.quename}
              type='text'
              name='text'
              value={questionFormData.text}
              onChange={(e) => handleQuestionChange(qIndex, e)}
              placeholder='Задайте вопрос'
            />
            
            <div>
              <select
                name='type'
                value={questionFormData.type}
                className={styles.queSel}
                onChange={(e) => handleQuestionChange(qIndex, e)}
              >
                <option value='' disabled>Выберите тип вопроса</option>
                <option value='Множественный выбор'>Множественный выбор</option>
                <option value='Вписать ответ'>Вписать ответ</option>
                <option value='Один правильный ответ'>Один правильный ответ</option>
              </select>
            </div>
            {questionFormData.answers.map((answerFormData, aIndex) => (
              <div className={styles.answGr} key={aIndex}>
                <input
                  type='text'
                  name='answer_text'
                  className={styles.answ}
                  value={answerFormData.answer_text}
                  onChange={(e) => handleAnswerChange(qIndex, aIndex, e)}
                  placeholder='Ответ'
                />
                {questionFormData.type === 'Множественный выбор' ? (
                  <>
                    <input
                      type='checkbox'
                      name='iscorrect'
                      className={styles.answC}
                      checked={answerFormData.iscorrect === 1}
                      onChange={() => handleCorrectChange(qIndex, aIndex)}
                    />
                    <label className={styles.CLab} htmlFor='iscorrect'>Правильный</label>
                  </>
                ) : questionFormData.type !== 'Вписать ответ' && (
                  <>
                    <input
                      type='radio'
                      name={`iscorrect-${qIndex}`}
                      className={styles.answR}
                      checked={answerFormData.iscorrect === 1}
                      onChange={() => handleCorrectChange(qIndex, aIndex)}
                    />
                    <label htmlFor='iscorrect' className={styles.RLab}>Правильный</label>
                  </>
                )}
                <button className={styles.delAnsw} type='button' onClick={() => removeAnswerForm(qIndex, aIndex)}></button>
              </div>
            ))}
            <div>
              <button className={styles.plusAnsw} type='button' onClick={() => addAnswerForm(qIndex)}></button>
            </div>
            <button className={styles.delQue} type='button' onClick={() => removeQuestionForm(qIndex)}></button>
          </div>
        ))}
        <div>
          <button className={styles.plusQue} type='button' onClick={addQuestionForm}></button>
        </div>
        <div>
        <ButtonSquish><button className={styles.subchik} type='submit'>СОЗДАТЬ</button></ButtonSquish>
        </div>
      </form>
      <div className={styles.doc}>
      <form onSubmit={handleFileUpload} className={styles.wordDoc}>
        <h2>Загрузка Word файлов</h2>
        <div className={styles.iconDoc}>
        <i title="doc"></i>
        <input type="file" accept=".docx" onChange={handleFileChange} className={styles.i}/></div>
        <ButtonSquish> <button className={styles.o} type="submit">Загрузить</button></ButtonSquish>
      </form>
      {message && <p>{message}</p>}
    
      <form onSubmit={handleExcelUpload} className={styles.exelDoc}>
        <h2>Загрузка Excel файлов</h2>
        <div className={styles.iconSheet}>
        <i title="xlsx"></i>
        <input type="file" accept=".xlsx" onChange={handleExcelFileChange} className={styles.i}/></div>
        <ButtonSquish><button className={styles.o} type="submit">Загрузить</button></ButtonSquish>
      </form>
      {excelMessage && <p>{excelMessage}</p>}
      </div>
    </div>
  );
  
};


export default CreatePage;
