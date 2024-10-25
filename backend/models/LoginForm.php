<?php

namespace app\models;

use Yii;
use yii\base\Model;


class LoginForm extends Model
{
    public $username;
    public $password;

    public function rules()
    {
        return [
            [['username', 'password'], 'required'],

        ];
    }

    protected function getUser()
    {
        return Users::findByUsername($this->username);
    }


    public function login()
    {
        return Yii::$app->user->login($this->getUser(), 3600 * 24 * 30);
    }

    /**
     * Finds user by [[username]]
     *
     * @return User|null
     */

}
