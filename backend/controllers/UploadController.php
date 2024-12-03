<?php
namespace app\controllers;

use Yii;
use yii\rest\ActiveController;
use yii\web\UploadedFile;
use PhpOffice\PhpSpreadsheet\IOFactory;
use app\models\Answers;
use app\models\Questions;
use app\models\Tests;
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
        // Отключаем стандартные действия, если необходимо
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
                $uploadedData = [];

                foreach ($sheetData as $row) {
                    if (isset($row['A']) && isset($row['B']) && !empty($row['B'])) {
                        switch ($row['A']) {
                            case 'Название':
                                $currentTest = new Tests();
                                $currentTest->title = $row['B'];
                                break;
                            case 'Описание':
                                if ($currentTest) {
                                    $currentTest->description = $row['B'];
                                }
                                break;
                            case 'Предмет':
                                if ($currentTest) {
                                    $currentTest->subject = $row['B'];
                                    $currentTest->data = date('Y-m-d');
                                    $currentTest->user_id = $userId;
                                    if (!$currentTest->save()) {
                                        throw new \Exception('Error saving test');
                                    }
                                    $uploadedData[] = ['test' => $currentTest];
                                }
                                break;
                            case 'Вопрос':
                                if ($currentTest) {
                                    $currentQuestion = new Questions();
                                    $currentQuestion->test_id = $currentTest->id;
                                    $currentQuestion->text = $row['B'];
                                }
                                break;
                            case 'Тип':
                                if ($currentQuestion) {
                                    $currentQuestion->type = $row['B'];
                                    if (!$currentQuestion->save()) {
                                        throw new \Exception('Error saving question');
                                    }
                                    $uploadedData[] = ['question' => $currentQuestion];
                                }
                                break;
                            default:
                                if (strpos($row['A'], 'Ответ') !== false) {
                                    if ($currentQuestion) {
                                        $answer = new Answers();
                                        $answer->question_id = $currentQuestion->id;
                                        $answer->answer_text = $row['B'];
                                        $answer->iscorrect = (strpos($row['B'], '(правильный)') !== false);
                                        $answer->answer_text = str_replace(['(правильный)', '(неправильный)'], '', $answer->answer_text);
                                        if (!$answer->save()) {
                                            throw new \Exception('Error saving answer');
                                        }
                                        $uploadedData[] = ['answer' => $answer];
                                    }
                                }
                                break;
                        }
                    }
                }

                $response = "Upload successful. Processed data:\n" . print_r($uploadedData, true);
                Yii::$app->response->format = \yii\web\Response::FORMAT_RAW;
                Yii::$app->response->headers->set('Content-Type', 'text/plain');
                return $response;
            }

            return 'File or user ID not found';
        } catch (\Exception $e) {
            return 'Error: ' . $e->getMessage();
        }
    }
}