<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "results".
 *
 * @property int $id
 * @property int $test_id
 * @property int $user_id
 * @property int $score
 * @property int $total_score
 * @property string $data
 *
 * @property Tests $test
 * @property Users $user
 * @property UsersAnswers[] $usersAnswers
 */
class Results extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'results';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['test_id', 'user_id', 'score', 'total_score', 'data'], 'required'],
            [['test_id', 'user_id', 'score', 'total_score'], 'default', 'value' => null],
            [['test_id', 'user_id', 'score', 'total_score'], 'integer'],
            [['data'], 'safe'],
            [['test_id'], 'exist', 'skipOnError' => true, 'targetClass' => Tests::class, 'targetAttribute' => ['test_id' => 'id']],
            [['user_id'], 'exist', 'skipOnError' => true, 'targetClass' => Users::class, 'targetAttribute' => ['user_id' => 'id']],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'test_id' => 'Test ID',
            'user_id' => 'User ID',
            'score' => 'Score',
            'total_score' => 'Total Score',
            'data' => 'Data',
        ];
    }

    /**
     * Gets query for [[Test]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getTest()
    {
        return $this->hasOne(Tests::class, ['id' => 'test_id']);
    }

    /**
     * Gets query for [[User]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(Users::class, ['id' => 'user_id']);
    }

    /**
     * Gets query for [[UsersAnswers]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getUsersAnswers()
    {
        return $this->hasMany(UsersAnswers::class, ['result_id' => 'id']);
    }
}
