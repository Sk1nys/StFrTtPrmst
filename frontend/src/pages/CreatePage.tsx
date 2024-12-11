import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import CryptoJS from 'crypto-js';

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

  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelMessage, setExcelMessage] = useState<string>('');
  const [excelData, setExcelData] = useState<any>(null);
  const [wordFile, setWordFile] = useState<File | null>(null);
  const [wordMessage, setWordMessage] = useState<string>('');
  const [wordData, setWordData] = useState<any>(null);


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
      setWordData(response.data);  // Обновляем excelData полученными данными
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

    const today = new Date().toISOString().split('T')[0];
    const formDataWithDateAndUserId = { ...formData, data: today, user_id: Number(decryptedUserId) };


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
    }
  };


  
  
  return (
    <div>
      <Link to='/home'>
        <div>
          <button>НА ГЛАВНУЮ</button>
        </div>
      </Link>
      <form onSubmit={handleSubmit}>
        <h1>СОЗДАТЬ ТЕСТ И ВОПРОСЫ</h1>
        <div>
          <input
            type='text'
            name='title'
            value={formData.title}
            onChange={handleChange}
            placeholder='Название теста'
          />
          <label htmlFor='title'>Название теста</label>
        </div>
        <div>
          <input
            type='text'
            name='description'
            value={formData.description}
            onChange={handleChange}
            placeholder='Описание'
          />
          <label htmlFor='description'>Описание</label>
        </div>
        <div>
          <input
            type='text'
            name='subject'
            value={formData.subject}
            onChange={handleChange}
            placeholder='Предмет'
          />
          <label htmlFor='subject'>Предмет</label>
        </div>
        {questionForms.map((questionFormData, qIndex) => (
          <div key={qIndex}>
            <h2>Создать Вопрос {qIndex + 1}</h2>
            <input
              type='text'
              name='text'
              value={questionFormData.text}
              onChange={(e) => handleQuestionChange(qIndex, e)}
              placeholder='Вопрос'
            />
            <label htmlFor='text'>Вопрос</label>
            <div>
              <select
                name='type'
                value={questionFormData.type}
                onChange={(e) => handleQuestionChange(qIndex, e)}
              >
                <option value='' disabled>Выберите тип вопроса</option>
                <option value='Множественный выбор'>Множественный выбор</option>
                <option value='Вписать ответ'>Вписать ответ</option>
                <option value='Один правильный ответ'>Один правильный ответ</option>
              </select>
              <label htmlFor='type'>Тип вопроса</label>
            </div>
            <h3>Создать Ответы</h3>
            {questionFormData.answers.map((answerFormData, aIndex) => (
              <div key={aIndex}>
                <input
                  type='text'
                  name='answer_text'
                  value={answerFormData.answer_text}
                  onChange={(e) => handleAnswerChange(qIndex, aIndex, e)}
                  placeholder='Ответ'
                />
                <label htmlFor='answer_text'>Ответ</label>
                {questionFormData.type === 'Множественный выбор' ? (
                  <>
                    <input
                      type='checkbox'
                      name='iscorrect'
                      checked={answerFormData.iscorrect === 1}
                      onChange={() => handleCorrectChange(qIndex, aIndex)}
                    />
                    <label htmlFor='iscorrect'>Правильный</label>
                  </>
                ) : questionFormData.type !== 'Вписать ответ' && (
                  <>
                    <input
                      type='radio'
                      name={`iscorrect-${qIndex}`}
                      checked={answerFormData.iscorrect === 1}
                      onChange={() => handleCorrectChange(qIndex, aIndex)}
                    />
                    <label htmlFor='iscorrect'>Правильный</label>
                  </>
                )}
                <button type='button' onClick={() => removeAnswerForm(qIndex, aIndex)}>Удалить Ответ</button>
              </div>
            ))}
            <div>
              <button type='button' onClick={() => addAnswerForm(qIndex)}>Добавить Ответ</button>
            </div>
            <button type='button' onClick={() => removeQuestionForm(qIndex)}>Удалить вопрос</button>
          </div>
        ))}
        <div>
          <button type='button' onClick={addQuestionForm}>Добавить Вопрос</button>
        </div>
        <div>
          <button type='submit'>СОЗДАТЬ ТЕСТ И ВОПРОС</button>
        </div>
      </form>
      <form onSubmit={handleWordUpload}>
  <h2>Загрузка Word файлов</h2>
  <input type="file" accept=".docx" onChange={handleWordFileChange} />
  <button type="submit">Загрузить</button>
</form>
{wordMessage && <p>{wordMessage}</p>}

    
      <form onSubmit={handleExcelUpload}>
        <h2>Загрузка Excel файлов</h2>
        <input type="file" accept=".xlsx" onChange={handleExcelFileChange} />
        <button type="submit">Загрузить</button>
      </form>
      {excelMessage && <p>{excelMessage}</p>}
    </div>
  );
  
};


export default CreatePage;
