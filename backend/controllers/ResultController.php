<?php

namespace app\controllers;

use app\models\Results;
use Yii;
use yii\bootstrap5\ActiveForm;
use yii\data\ActiveDataProvider;
use yii\filters\Cors;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use yii\rest\ActiveController;
use yii\web\Response;
/**
 * ResultController implements the CRUD actions for Results model.
 */
class ResultController extends ActiveController
{
    public $modelClass = 'app\models\Results';
    public function init()
    {
        parent::init();
        \Yii::$app->user->enableSession=false;
    }
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

    /**
     * Lists all Results models.
     *
     * @return string
     */
    public function actionIndex()
    {
        $dataProvider = new ActiveDataProvider([
            'query' => Results::find(),
            /*
            'pagination' => [
                'pageSize' => 50
            ],
            'sort' => [
                'defaultOrder' => [
                    'id' => SORT_DESC,
                ]
            ],
            */
        ]);

        return $this->render('index', [
            'dataProvider' => $dataProvider,
        ]);
    }

    /**
     * Displays a single Results model.
     * @param int $id ID
     * @return string
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionUserResults($user_id){
        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;

        $results = Results::find()
        ->joinWith('user') 
        ->joinWith('test') 
        ->andWhere(['users.id' => $user_id]) 
        ->all();

        if (empty($results)) {
            return ['message' => 'Вы не проходили тест'];
        }


      $result = [];
        foreach ($results as $relust) {
            $result[] = [
                'id' => $relust->id,
                'score' => $relust->score,
                'total_score' => $relust->total_score,
                'user' => [
                    'username' => $relust->user->username, 
                ],
                'test' => [
                    'title'=>$relust->test->title,
                ],
            ];
        }
    
        return $result;
    }
    public function actionTestUsers($test_id) {
        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
    
        // Получаем результаты теста с присоединением к пользователю и фильтрацией по test_id
        $results = Results::find()
            ->joinWith('user') // Присоединяем таблицу users
            ->where(['results.test_id' => $test_id]) // Фильтруем по test_id
            ->all();
    

    

        $result = [];
        foreach ($results as $resultItem) {
            $result[] = [
                'id' => $resultItem->id,
                'score' => $resultItem->score,
                'total_score' => $resultItem->total_score,
                'user' => [
                    'id'=>$resultItem->user->id, 
                    'username' => $resultItem->user->username, 
                ],
            ];
        }
    
        return $result;
    }
    
    /**
     * Creates a new Results model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return string|\yii\web\Response
     */
    public function actionCreate()
    {
        $model = new Results();

        if (Yii::$app->request->isAjax && $model->load(Yii::$app->request->post())) {
            Yii::$app->response->format = Response::FORMAT_JSON;
            return ActiveForm::validate($model);
        }

        if ($this->request->isPost) {
            if ($model->load($this->request->post()) && $model->save()) {
                return $this->redirect(['view', 'id' => $model->id]);
            }
        } 
        else {
            $model->loadDefaultValues();
        }

        return $this->render('create', [
            'model' => $model,
        ]);
    }

    /**
     * Updates an existing Results model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param int $id ID
     * @return string|\yii\web\Response
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionUpdate($id)
    {
        $model = $this->findModel($id);

        if ($this->request->isPost && $model->load($this->request->post()) && $model->save()) {
            return $this->redirect(['view', 'id' => $model->id]);
        }

        return $this->render('update', [
            'model' => $model,
        ]);
    }

    /**
     * Deletes an existing Results model.
     * If deletion is successful, the browser will be redirected to the 'index' page.
     * @param int $id ID
     * @return \yii\web\Response
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionDelete($id)
    {
        $this->findModel($id)->delete();

        return $this->redirect(['index']);
    }

    /**
     * Finds the Results model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param int $id ID
     * @return Results the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id)
    {
        if (($model = Results::findOne(['id' => $id])) !== null) {
            return $model;
        }

        throw new NotFoundHttpException('The requested page does not exist.');
    }
}
