<?php

namespace app\models;

use Yii;

class Users extends \yii\db\ActiveRecord implements \yii\web\IdentityInterface
{
    public static function tableName()
    {
        return 'users';
    }

    public static function findIdentity($id)
    {
        return static::findOne($id);
    }

    public static function findIdentityByAccessToken($token, $type = null)
    {
        return null;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getAuthKey()
    {
        return null;
    }

    public function validateAuthKey($authKey)
    {
        return false;
    }

    public function rules()
    {
        return [
            [['name', 'surname', 'username', 'email', 'password'], 'required'],
            [['name', 'surname'], 'match', 'pattern' => '/^[а-яёА-ЯЁ -]*$/u','message'=>'Разрешены только кириллица, пробел и тире'],
            [['id', 'role_id'], 'integer'],
            [['name', 'surname', 'username', 'email', 'password'], 'string', 'max' => 255],
            [['email'], 'unique'],
            [['username'], 'unique'],
            ['username', 'match', 'pattern' => '/^[a-zA-Z0-9-]*$/i','message'=>'Разрешены только латиница, цифры и тире'],
            [['email'], 'email','message'=>'Введите правильный email'],
            ['password', 'string', 'min'=>6],
            [['id'], 'unique'],
            [['role_id'], 'exist', 'skipOnError' => true, 'targetClass' => Roles::class, 'targetAttribute' => ['role_id' => 'id']],
        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Name',
            'surname' => 'Surname',
            'username' => 'Username',
            'email' => 'Email',
            'password' => 'Password',
            'role_id' => 'Role ID',
        ];
    }

    public function getAnswers()
    {
        return $this->hasMany(Answers::class, ['user_id' => 'id']);
    }

    public function getResults()
    {
        return $this->hasMany(Results::class, ['user_id' => 'id']);
    }

    public function getRole()
    {
        return $this->hasOne(Roles::class, ['id' => 'role_id']);
    }

    public function getTests()
    {
        return $this->hasMany(Tests::class, ['user_id' => 'id']);
    }

    public static function findByUsername($username)
    {
        return Users::findOne(['username' => $username]);
    }

    public function validatePassword($password)
    {
        return Yii::$app->security->validatePassword($password, $this->password); // Используйте правильный метод валидации
    }

    public function beforeSave($insert)
    {
        if ($this->isNewRecord || $this->isAttributeChanged('password')) {
            $this->password = Yii::$app->security->generatePasswordHash($this->password); // Используйте безопасное хэширование
        }
        return parent::beforeSave($insert);
    }
}

