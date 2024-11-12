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
    

    public function actionView($id)
    {
        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $answers = Answers::find()
        ->where(['question_id' => $id])

        ->with('question') // Здесь 'question' - это имя связи в модели Answers
        ->all();
        if ($answers === null) {
            throw new \yii\web\NotFoundHttpException('Запись не найдена'); 
        }
        $result = [];
        foreach ($answers as $answer) {
            $result[] = [
                'id' => $answer->id,
                'text' => $answer->answer_text, 
                'question_id' => [
                    'text' => $answer->question->text, // Здесь 'title' - поле вопроса, вы можете изменить на нужное вам
                ],
            ];
        }
    
        return $result;
    }



}
