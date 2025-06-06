<?php

namespace app\controllers;
use Yii;
use app\models\Users;
use yii\bootstrap5\ActiveForm;
use yii\data\ActiveDataProvider;
use yii\debug\models\search\User;
use yii\filters\AccessControl;
use yii\filters\auth\HttpBasicAuth;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\Cors;
use yii\rest\ActiveController;
use yii\web\Response;


/**
 * UsersController implements the CRUD actions for Users model.
 */
class UsersController extends ActiveController
{
    public $modelClass = 'app\models\Users';
    /**
     * @inheritDoc
     */

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
     * Lists all Users models.
     *
     * @return string
     */
    public function actionIndex()
    {
        $dataProvider = new ActiveDataProvider([
            'query' => Users::find(),
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
     * Displays a single Users model.
     * @param int $id ID
     * @return string
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionView($id)
    {
        return $this->render('view', [
            'model' => $this->findModel($id),
        ]);
    }

    /**
     * Creates a new Users model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return string|\yii\web\Response
     */
    public function actionCreate()
    {
        $model = new Users();

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
     * Updates an existing Users model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param int $id ID
     * @return string|\yii\web\Response
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionUpdated($id)
    {
        $model = $this->findModel($id);
    
        // Проверяем, является ли запрос POST, PUT или PATCH
        if ($this->request->isPost || $this->request->isPut || $this->request->isPatch) {
            // Загружаем данные в модель
            if ($model->load($this->request->post()) && $model->save()) {
                // Перенаправляем на просмотр обновленной модели
                return $this->redirect(['view', 'id' => $model->id]);
            }
        }
    
        // Если запрос не POST, PUT или PATCH, или сохранение не удалось, показываем форму обновления
        return $this->render('update', [
            'model' => $model,
        ]);
    }
    

    /**
     * Deletes an existing Users model.
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
     * Finds the Users model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param int $id ID
     * @return Users the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id)
    {
        if (($model = Users::findOne(['id' => $id])) !== null) {
            return $model;
        }

        throw new NotFoundHttpException('The requested page does not exist.');
    }
}
