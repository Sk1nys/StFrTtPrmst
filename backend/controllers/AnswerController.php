<?php

namespace app\controllers;

use app\models\Answers;
use app\models\Questions;
use app\models\Tests;
use Yii;
use yii\data\ActiveDataProvider;
use yii\filters\Cors;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use yii\rest\ActiveController;
use yii\web\BadRequestHttpException;

/**
 * TestController implements the CRUD actions for Tests model.
 */
class AnswerController extends Controller
{

    public $modelClass = 'app\models\Answers';
    /**
     * @inheritDoc
     */

     
    public function behaviors() 
    {
        $behaviors = parent::behaviors();
        

        $behaviors['cors'] = Cors::class;
        $behaviors['contentNegotiator'] = [
            'class' => \yii\filters\ContentNegotiator::class,
            'formatParam' => '_format',
            'formats' => [
                //'application/json' => \yii\web\Response::FORMAT_JSON,
                //'xml' => \yii\web\Response::FORMAT_XML,
            ],
        ];


       
        return $behaviors;
    }


    public function actionIndex()
    {
        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        
        // Получаем все записи из таблицы
        $data = Answers::find()->all();
        
        return $data;
    }
    

    public function actionView($test_id)
    {
        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
    
        // Получаем ответы и присоединяем связанные вопросы, добавляя проверку на test_id
        $answers = Answers::find()
            ->joinWith('question') // Присоединяем связанную модель Questions

            ->andWhere(['questions.test_id' => $test_id]) // Условия для test_id
            ->all();
    
        // Проверка на наличие ответов
        if (empty($answers)) {
            throw new \yii\web\NotFoundHttpException('Запись не найдена');
        }
    
        $result = [];
        foreach ($answers as $answer) {
            $result[] = [
                'id' => $answer->id,
                'text' => $answer->answer_text,
                'question' => [
                    'text' => $answer->question->text, // Здесь 'text' - поле вопроса
                    'test_id' => $answer->question->test_id,
                    'id' => $answer->question->id,
                ],
            ];
        }
    
        return $result;
    }



}
