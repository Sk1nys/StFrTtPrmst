<?php

use yii\db\Migration;

/**
 * Class m241012_132122_article_table
 */
class m241012_132122_article_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('article',[
            'id'=>$this->primaryKey(),
            'title'=>$this->string(),
            'descriptions'=>$this->text(),
            'created_at'=>$this->date(),
        ]);
        $this->createIndex('article_created_at','article',['created_at','id']);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropIndex('article_created_at','article');
        $this->dropTable('article');
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m241012_132122_article_table cannot be reverted.\n";

        return false;
    }
    */
}
