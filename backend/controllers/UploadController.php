<?php
namespace app\controllers;

use Yii;
use yii\rest\ActiveController;
use yii\web\UploadedFile;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpWord\IOFactory as WordIOFactory;
use yii\filters\Cors;

class UploadController extends ActiveController
{
    public $modelClass = 'app\models\Test';

    public function behaviors() 
    {
        $behaviors = parent::behaviors();
        
        $behaviors['cors'] = Cors::class;
        $behaviors['contentNegotiator'] = [
            'class' => \yii\filters\ContentNegotiator::class,
            'formatParam' => '_format',
            'formats' => [
                'application/json' => \yii\web\Response::FORMAT_JSON,
                'xml' => \yii\web\Response::FORMAT_XML,
            ],
        ];

        return $behaviors;
    }

    public function actions()
    {
        $actions = parent::actions();
        unset($actions['create'], $actions['update'], $actions['delete']);

        return $actions;
    }

    public function actionExel()
    {
        try {
            $file = UploadedFile::getInstanceByName('file');
            $userId = Yii::$app->request->post('user_id');

            if ($file && $userId) {
                $spreadsheet = IOFactory::load($file->tempName);
                $sheetData = $spreadsheet->getActiveSheet()->toArray(null, true, true, true);

                $currentTest = null;
                $currentQuestion = null;
                $uploadedData = [
                    'tests' => [],
                    'questions' => [],
                    'answers' => [],
                ];

                foreach ($sheetData as $row) {
                    if (isset($row['A']) && isset($row['B']) && !empty($row['B'])) {
                        switch ($row['A']) {
                            case 'Название':
                                $currentTest = [
                                    'title' => $row['B'],
                                    'description' => '',
                                    'subject' => '',
                                    'date' => date('Y-m-d'),
                                    'user_id' => $userId,
                                ];
                                $uploadedData['tests'][] = $currentTest;
                                break;
                            case 'Описание':
                                if ($currentTest) {
                                    $currentTest['description'] = $row['B'];
                                    $uploadedData['tests'][array_key_last($uploadedData['tests'])] = $currentTest;
                                }
                                break;
                            case 'Предмет':
                                if ($currentTest) {
                                    $currentTest['subject'] = $row['B'];
                                    $uploadedData['tests'][array_key_last($uploadedData['tests'])] = $currentTest;
                                }
                                break;
                            case 'Вопрос':
                                if ($currentTest) {
                                    $currentQuestion = [
                                        'test_title' => $currentTest['title'],
                                        'text' => $row['B'],
                                        'type' => '',
                                    ];
                                    $uploadedData['questions'][] = $currentQuestion;
                                }
                                break;
                            case 'Тип':
                                if ($currentQuestion) {
                                    $currentQuestion['type'] = $row['B'];
                                    $uploadedData['questions'][array_key_last($uploadedData['questions'])] = $currentQuestion;
                                }
                                break;
                            default:
                                if (strpos($row['A'], 'Ответ') !== false && $currentQuestion) {
                                    $answer = [
                                        'question_text' => $currentQuestion['text'],
                                        'answer_text' => str_replace(['(правильный)', '(неправильный)'], '', $row['B']),
                                        'is_correct' => (strpos($row['B'], '(правильный)') !== false),
                                    ];
                                    $uploadedData['answers'][] = $answer;
                                }
                                break;
                        }
                    }
                }

                Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
                return $uploadedData;
            }

            return 'File or user ID not found';
        } catch (\Exception $e) {
            return 'Error: ' . $e->getMessage();
        }
    }
    public function actionWord()
    {
        try {
            $file = UploadedFile::getInstanceByName('file');
            $userId = Yii::$app->request->post('user_id');
    
            if ($file && $userId) {
                Yii::info('File received: ' . $file->name, __METHOD__);
                Yii::info('User  ID: ' . $userId, __METHOD__);
    
                try {
                    $phpWord = \PhpOffice\PhpWord\IOFactory::load($file->tempName);
                    Yii::info('File loaded in PhpWord', __METHOD__);
                } catch (\Exception $e) {
                    Yii::error('Error loading PhpWord: ' . $e->getMessage(), __METHOD__);
                    return [
                        'status' => 'error',
                        'message' => 'Error loading Word file: ' . $e->getMessage(),
                    ];
                }
    
                $sections = $phpWord->getSections();
                Yii::info('Number of sections: ' . count($sections), __METHOD__);
    
                $uploadedData = [
                    'tests' => [],
                    'questions' => [],
                    'answers' => [],
                ];
    
                $currentTest = null;
                $currentQuestion = null;
    
                foreach ($sections as $section) {
                    $elements = $section->getElements();
                    $testTitle = '';
                    $description = '';
                    $subject = '';
    
                    foreach ($elements as $element) {
                        if ($element instanceof \PhpOffice\PhpWord\Element\TextRun) {
                            $text = $element->getText();
                            if (strpos($text, 'Название:') === 0) {
                                $testTitle = trim(substr($text, strlen('Название:')));
                                $currentTest = [
                                    'title' => $testTitle,
                                    'description' => '',
                                    'subject' => '',
                                    'date' => date('Y-m-d'),
                                    'user_id' => $userId,
                                ];
                                $uploadedData['tests'][] = $currentTest;
                            } elseif (strpos($text, 'Описание:') === 0) {
                                if ($currentTest) {
                                    $currentTest['description'] = trim(substr($text, strlen('Описание:')));
                                    $uploadedData['tests'][array_key_last($uploadedData['tests'])] = $currentTest;
                                }
                            } elseif (strpos($text, 'Предмет:') === 0) {
                                if ($currentTest) {
                                    $currentTest['subject'] = trim(substr($text, strlen('Предмет:')));
                                    $uploadedData['tests'][array_key_last($uploadedData['tests'])] = $currentTest;
                                }
                            } elseif (strpos($text, 'Вопрос:') === 0) {
                                if ($currentQuestion !== null) {
                                    $uploadedData['questions'][] = $currentQuestion;
                                }
                                $currentQuestion = [
                                    'test_title' => $testTitle,
                                    'text' => trim(substr($text, strlen('Вопрос:'))),
                                    'type' => '',
                                    'answers' => [],
                                ];
                            } elseif (strpos($text, 'Тип:') === 0) {
                                if ($currentQuestion) {
                                    $currentQuestion['type'] = trim(substr($text, strlen('Тип:')));
                                }
                            } elseif (strpos($text, 'Ответ') === 0) {
                                if ($currentQuestion) {
                                    $answerText = trim(substr($text, strlen('Ответ ')));
                                    $isCorrect = strpos($answerText, '(правильный)') !== false;
                                    $answer = [
                                        'question_text' => $currentQuestion['text'],
                                        'answer_text' => str_replace(['(правильный)', '(неправильный)',' (правильный)', ' (неправильный)'], '', $answerText),
                                        'is_correct' => $isCorrect,
                                    ];
                                    $uploadedData['answers'][] = $answer;
                                    $currentQuestion['answers'][] = $answer; // Добавляем ответ к текущему вопросу
                                }
                            }
                        }
                    }
    
                    // Добавляем последний вопрос, если он существует
                    if ($currentQuestion !== null) {
                        $uploadedData['questions'][] = $currentQuestion;
                    }
                }
    
                Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
                return $uploadedData;
            }
    
            Yii::error('File or user_id not found', __METHOD__);
            return 'File or user ID not found';
        } catch (\Exception $e) {
            Yii::error('Error: ' . $e->getMessage(), __METHOD__);
            return 'Error: ' . $e->getMessage();
        }
    }
    
    
    

}
