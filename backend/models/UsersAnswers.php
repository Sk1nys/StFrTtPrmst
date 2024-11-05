<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "users_answers".
 *
 * @property int $id
 * @property int $result_id
 * @property int $question_id
 * @property int $answer_id
 *
 * @property Answers $answer
 * @property Questions $question
 * @property Results $result
 */
class UsersAnswers extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'users_answers';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['result_id', 'question_id', 'answer_id'], 'required'],
            [['result_id', 'question_id', 'answer_id'], 'default', 'value' => null],
            [['result_id', 'question_id', 'answer_id'], 'integer'],
            [['answer_id'], 'exist', 'skipOnError' => true, 'targetClass' => Answers::class, 'targetAttribute' => ['answer_id' => 'id']],
            [['question_id'], 'exist', 'skipOnError' => true, 'targetClass' => Questions::class, 'targetAttribute' => ['question_id' => 'id']],
            [['result_id'], 'exist', 'skipOnError' => true, 'targetClass' => Results::class, 'targetAttribute' => ['result_id' => 'id']],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'result_id' => 'Result ID',
            'question_id' => 'Question ID',
            'answer_id' => 'Answer ID',
        ];
    }

    /**
     * Gets query for [[Answer]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getAnswer()
    {
        return $this->hasOne(Answers::class, ['id' => 'answer_id']);
    }

    /**
     * Gets query for [[Question]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getQuestion()
    {
        return $this->hasOne(Questions::class, ['id' => 'question_id']);
    }

    /**
     * Gets query for [[Result]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getResult()
    {
        return $this->hasOne(Results::class, ['id' => 'result_id']);
    }
}
