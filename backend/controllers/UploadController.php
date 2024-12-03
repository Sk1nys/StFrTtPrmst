<?php
namespace app\controllers;

use Yii;
use yii\rest\ActiveController;
use yii\web\UploadedFile;
use PhpOffice\PhpSpreadsheet\IOFactory;
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

    public function actionUpload()
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
}
