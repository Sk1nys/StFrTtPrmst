<?php

namespace app\controllers;
use Yii;
use app\models\Users;
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
        
        $auth = $behaviors['authenticator'];
        unset($behaviors['authenticator']);

        $behaviors['cors'] = Cors::class;
        $behaviors['contentNegotiator'] = [
            'class' => \yii\filters\ContentNegotiator::class,
            'formatParam' => '_format',
            'formats' => [
                'application/json' => \yii\web\Response::FORMAT_JSON,
                'xml' => \yii\web\Response::FORMAT_XML,
            ],
        ];


        $behaviors['authenticator'] = $auth;
            $behaviors['authenticator']=[
            'class'=>HttpBasicAuth::class,
            'auth'=>function($username,$password){
                if($user=Users::find()->where(['username'=>$username])->one() and !empty($password) and $user->validatePassword($password)){
                    return $user;
                }
                return null;
            },
        ];
        $behaviors['access']=[
            'class'=>AccessControl::class,
            'rules'=>[
                [
                    'allow'=>true,
                    'roles'=>['@'],
                ],
            ],
        ];

        $behaviors['authenticator']['except'] = ['options'];
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
    public function actionLogin()
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        $request = Yii::$app->request->post();
        $request = Yii::$app->request->post(); // для обычной формы

        $username = $request['username'] ?? null;
        $password = $request['password'] ?? null;

        if ($username && $password) {
            $user = Users::findOne(['username' => $username]);

            if ($user && Yii::$app->security->validatePassword($password, $user->password_hash)) {
                // Успешная авторизация
                return [
                    'status' => 'success',
                    'message' => 'Login successful',
                    'user' => [
                        'id' => $user->id,
                        'username' => $user->username,
                    ],
                ];
            } else {
                // Неверные учетные данные
                return [
                    'status' => 'error',
                    'message' => 'Invalid username or password',
                ];
            }
        } else {
            return [
                'status' => 'error',
                'message' => 'Username and password are required',
            ];
        }
    }
    public function actionLogout()
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        if (Yii::$app->user->isGuest) {
            return [
                'success' => false,
                'message' => 'You are not logged in.',
            ];
        }

        Yii::$app->user->logout();

        return [
            'success' => true,
            'message' => 'Logout successful',
        ];
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
