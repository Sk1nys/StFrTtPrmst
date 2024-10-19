<?php

namespace app\models;

use Yii;



 


class Users extends \yii\db\ActiveRecord implements \yii\web\IdentityInterface
{

    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'users';
    }

    public static function findIdentity($id)
    {
        return static::findOne($id);
    }

    /**
     * Finds an identity by the given token.
     *
     * @param string $token the token to be looked for
     * @return IdentityInterface|null the identity object that matches the given token.
     */
    public static function findIdentityByAccessToken($token, $type = null)
    {
        return null;
    }

    /**
     * @return int|string current user ID
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string|null current user auth key
     */
    public function getAuthKey()
    {
        return null;
    }

    /**
     * @param string $authKey
     * @return bool|null if auth key is valid for current user
     */
    public function validateAuthKey($authKey)
    {
        return false;
    }
    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['name', 'surname', 'username', 'email', 'password',], 'required'],
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
    public function register()
    {
         if (!$this->validate()) {
             return null;
         }

        $user = new Users();
        $user->name = $this->name;
        $user->surname = $this->surname;
        $user->username = $this->username;
        $user->surnemailame = $this->email;
        $user->password = md5($this->password);
        $user->role_id = 1;

        return $user->save() ? $user : null;
    }
    /**
     * {@inheritdoc}
     */
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

    /**
     * Gets query for [[Answers]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getAnswers()
    {
        return $this->hasMany(Answers::class, ['user_id' => 'id']);
    }

    /**
     * Gets query for [[Results]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getResults()
    {
        return $this->hasMany(Results::class, ['user_id' => 'id']);
    }

    /**
     * Gets query for [[Role]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getRole()
    {
        return $this->hasOne(Roles::class, ['id' => 'role_id']);
    }

    /**
     * Gets query for [[Tests]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getTests()
    {
        return $this->hasMany(Tests::class, ['user_id' => 'id']);
    }
    public static function findByUsername($username)
    {

        return Users::findOne(['username' => $username]);;
    }
    public function validatePassword($password)
    {
        return $this->password === md5($password);
    }
    public function beforeSave($insert)
    {
        $this->password = md5($this->password);
        return parent::beforeSave($insert);
    }
}
