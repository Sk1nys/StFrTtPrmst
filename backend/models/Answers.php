<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "answers".
 *
 * @property int $id
 * @property int $question_id
 * @property string $answer_text
 * @property bool $iscorrect
 *
 * @property Questions $question
 * @property UsersAnswers[] $usersAnswers
 */
class Answers extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'answers';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['question_id', 'answer_text', 'iscorrect'], 'required'],
            [['question_id'], 'default', 'value' => null],
            [['question_id'], 'integer'],
            [['iscorrect'], 'boolean'],
            [['answer_text'], 'string', 'max' => 255],
            [['question_id'], 'exist', 'skipOnError' => true, 'targetClass' => Questions::class, 'targetAttribute' => ['question_id' => 'id']],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'question_id' => 'Question ID',
            'answer_text' => 'Answer Text',
            'iscorrect' => 'Iscorrect',
        ];
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
     * Gets query for [[UsersAnswers]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getUsersAnswers()
    {
        return $this->hasMany(UsersAnswers::class, ['answer_id' => 'id']);
    }
}
