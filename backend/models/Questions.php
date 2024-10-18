<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "questions".
 *
 * @property int $id
 * @property int $test_id
 * @property string $text
 * @property string|null $type
 * @property string $correct
 *
 * @property Answers[] $answers
 * @property Tests $test
 */
class Questions extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'questions';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['id', 'test_id', 'text', 'correct'], 'required'],
            [['id', 'test_id'], 'default', 'value' => null],
            [['id', 'test_id'], 'integer'],
            [['text', 'type', 'correct'], 'string', 'max' => 255],
            [['id'], 'unique'],
            [['test_id'], 'exist', 'skipOnError' => true, 'targetClass' => Tests::class, 'targetAttribute' => ['test_id' => 'id']],
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
            'text' => 'Text',
            'type' => 'Type',
            'correct' => 'Correct',
        ];
    }

    /**
     * Gets query for [[Answers]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getAnswers()
    {
        return $this->hasMany(Answers::class, ['question_id' => 'id']);
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
}
