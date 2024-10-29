<?php

namespace app\controllers;

use app\models\LoginForm;
use Yii;
use app\models\Users;
use Symfony\Component\BrowserKit\Cookie;
use yii\bootstrap5\ActiveForm;
use yii\data\ActiveDataProvider;
use yii\debug\models\search\User;
use yii\filters\AccessControl;
use yii\filters\auth\HttpBasicAuth;
use yii\filters\ContentNegotiator;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\Cors;
use yii\rest\ActiveController;
use yii\web\BadRequestHttpException;
use yii\web\Cookie as WebCookie;
use yii\web\Response;


/**
 * UsersController implements the CRUD actions for Users model.
 */
class AuthController extends ActiveController
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
                 //'application/json' => \yii\web\Response::FORMAT_JSON,
                 //'xml' => \yii\web\Response::FORMAT_XML,
             ],
        ];


       
        return $behaviors;
    }

    


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

    public function actionLogin()
    {
        $request = Yii::$app->request;
        if ($request->isPost) {
            $username = $request->post('username');
            $password = $request->post('password');
            $user = Users::findOne(['username' => $username]);

            if ($user && Yii::$app->security->validatePassword($password, $user->hashPassword($password))) {
                Yii::$app->user->login($user);
                $cookie = new \yii\web\Cookie([
                    'name' => 'username',
                    'value' => $username,
                    'expire' => time() + 86400 * 30,
                ]);
                $response=Yii::$app->response;
                $response->cookies->add($cookie);
                 return $this->asJson(['status' => 'success']);

            }

            return $this->asJson(['status' => 'error', 'message' => 'Invalid credentials']);
        }

        throw new BadRequestHttpException('Invalid request');
    }


    public function actionLogout()
    {
        Yii::$app->user->logout();
        // Clear the username cookie
        Yii::$app->response->cookies->remove('username');
        return $this->asJson(['status' => 'success']);
    }

    
    public function attributeLabels()
    {
        return [
            
            'username' => 'Username',
            'password' => 'Password',

        ];
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
    

    /**
     * Updates an existing Users model.
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
