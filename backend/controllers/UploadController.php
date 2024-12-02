<?php

namespace app\controllers;

use Yii;
use yii\rest\ActiveController;
use yii\web\UploadedFile;
use yii\web\BadRequestHttpException;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpSpreadsheet\IOFactory as ExcelIOFactory;
use app\models\Answers;
use app\models\Questions;
use app\models\Tests;
use yii\filters\Cors;

class UploadController extends ActiveController
{
    public $modelClass = 'app\models\Tests';

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

    public function actionUpload()
    {
        try {
            if (Yii::$app->request->isPost) {
                $file = UploadedFile::getInstanceByName('file');
                if ($file && $file->tempName) {
                    if ($file->extension === 'docx') {
                        $data = $this->processWordFile($file->tempName);
                    } elseif ($file->extension === 'xlsx') {
                        $data = $this->processExcelFile($file->tempName);
                    } else {
                        throw new BadRequestHttpException('Unsupported file type.');
                    }
                    $this->saveDataToDatabase($data);
                    Yii::info('Data returned: ' . print_r($data, true), __METHOD__);
                    return ['status' => 'success', 'data' => $data];
                } else {
                    throw new BadRequestHttpException('File is required.');
                }
            } else {
                throw new BadRequestHttpException('Invalid request method.');
            }
        } catch (\Exception $e) {
            Yii::error($e->getMessage(), __METHOD__);
            throw $e;
        }
    }

    private function processWordFile($filePath)
    {
        try {
            $phpWord = IOFactory::load($filePath);
            $sections = $phpWord->getSections();
            $data = [];
            Yii::info('Number of sections in document: ' . count($sections), __METHOD__);

            $currentTest = null;
            $currentQuestion = null;

            foreach ($sections as $section) {
                Yii::info('Start processing section', __METHOD__);
                foreach ($section->getElements() as $element) {
                    if ($element instanceof \PhpOffice\PhpWord\Element\TextRun) {
                        foreach ($element->getElements() as $e) {
                            if ($e instanceof \PhpOffice\PhpWord\Element\Text) {
                                $text = $e->getText();
                                Yii::info('Processed text: ' . $text, __METHOD__);

                                // Parse the text based on predefined markers
                                if (strpos($text, 'Название:') === 0) {
                                    $currentTest['title'] = trim(str_replace('Название:', '', $text));
                                } elseif (strpos($text, 'Описание:') === 0) {
                                    $currentTest['description'] = trim(str_replace('Описание:', '', $text));
                                } elseif (strpos($text, 'Предмет:') === 0) {
                                    $currentTest['subject'] = trim(str_replace('Предмет:', '', $text));
                                } elseif (strpos($text, 'Вопрос:') === 0) {
                                    if ($currentQuestion) {
                                        $currentTest['questions'][] = $currentQuestion;
                                    }
                                    $currentQuestion = [
                                        'text' => trim(str_replace('Вопрос:', '', $text)),
                                        'answers' => []
                                    ];
                                } elseif (strpos($text, 'Тип:') === 0) {
                                    if ($currentQuestion) {
                                        $currentQuestion['type'] = trim(str_replace('Тип:', '', $text));
                                    }
                                } elseif (strpos($text, 'Ответы:') === 0) {
                                    continue;  // Skip this line
                                } elseif (preg_match('/^\d+\.\s*(.+?)\s*\((правильный|неправильный)\)$/', $text, $matches)) {
                                    if ($currentQuestion) {
                                        $currentQuestion['answers'][] = [
                                            'text' => $matches[1],
                                            'isCorrect' => $matches[2] === 'правильный'
                                        ];
                                    }
                                }
                            }
                        }
                    }
                }
                Yii::info('End processing section', __METHOD__);
            }

            if ($currentQuestion) {
                $currentTest['questions'][] = $currentQuestion;
            }

            $data[] = $currentTest;
            return $data;

        } catch (\Exception $e) {
            Yii::error($e->getMessage(), __METHOD__);
            throw $e;
        }
    }

    private function processExcelFile($filePath)
    {
        try {
            $spreadsheet = ExcelIOFactory::load($filePath);
            $sheet = $spreadsheet->getActiveSheet();
            $data = [];
            Yii::info('Number of rows in Excel sheet: ' . $sheet->getHighestRow(), __METHOD__);

            $currentTest = null;
            $currentQuestion = null;

            foreach ($sheet->getRowIterator() as $row) {
                $cellIterator = $row->getCellIterator();
                $cellIterator->setIterateOnlyExistingCells(false);

                foreach ($cellIterator as $cell) {
                    $text = $cell->getValue();
                    Yii::info('Processed cell text: ' . $text, __METHOD__);

                    // Parse the text based on predefined markers
                    if (strpos($text, 'Название:') === 0) {
                        $currentTest['title'] = trim(str_replace('Название:', '', $text));
                    } elseif (strpos($text, 'Описание:') === 0) {
                        $currentTest['description'] = trim(str_replace('Описание:', '', $text));
                    } elseif (strpos($text, 'Предмет:') === 0) {
                        $currentTest['subject'] = trim(str_replace('Предмет:', '', $text));
                    } elseif (strpos($text, 'Вопрос:') === 0) {
                        if ($currentQuestion) {
                            $currentTest['questions'][] = $currentQuestion;
                        }
                        $currentQuestion = [
                            'text' => trim(str_replace('Вопрос:', '', $text)),
                            'answers' => []
                        ];
                    } elseif (strpos($text, 'Тип:') === 0) {
                        if ($currentQuestion) {
                            $currentQuestion['type'] = trim(str_replace('Тип:', '', $text));
                        }
                    } elseif (strpos($text, 'Ответы:') === 0) {
                        continue;  // Skip this line
                    } elseif (preg_match('/^\d+\.\s*(.+?)\s*\((правильный|неправильный)\)$/', $text, $matches)) {
                        if ($currentQuestion) {
                            $currentQuestion['answers'][] = [
                                'text' => $matches[1],
                                'isCorrect' => $matches[2] === 'правильный'
                            ];
                        }
                    }
                }
            }

            if ($currentQuestion) {
                $currentTest['questions'][] = $currentQuestion;
            }

            $data[] = $currentTest;
            return $data;

        } catch (\Exception $e) {
            Yii::error($e->getMessage(), __METHOD__);
            throw $e;
        }
    }

    private function saveDataToDatabase($data)
    {
        try {
            foreach ($data as $testData) {
                $test = new Tests();
                $test->title = $testData['title'];
                $test->description = $testData['description'];
                $test->subject = $testData['subject'];
                $test->data = date('Y-m-d');
                $test->user_id = 1;  // Replace this with the actual user ID

                if ($test->save()) {
                    foreach ($testData['questions'] as $questionData) {
                        $question = new Questions();
                        $question->test_id = $test->id;
                        $question->text = $questionData['text'];
                        $question->type = $questionData['type'] === 'Один правильный ответ' ? 1 : 2;  // Adjust based on your needs

                        if ($question->save()) {
                            foreach ($questionData['answers'] as $answerData) {
                                $answer = new Answers();
                                $answer->question_id = $question->id;
                                $answer->answer_text = $answerData['text'];
                                $answer->isCorrect = $answerData['isCorrect'];
                                $answer->save();
                            }
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            Yii::error($e->getMessage(), __METHOD__);
            throw $e;
        }
    }
}
?>
