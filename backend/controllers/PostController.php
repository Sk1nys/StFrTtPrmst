<?php

namespace app\controllers;

use yii\rest\ActiveController;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class PostController extends ActiveController
{
    public $modelClass = 'app\models\Post'; // Ensure you have a Post model

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        $behaviors['cors'] = [
            'class' => \yii\filters\Cors::class,
        ];
        return $behaviors;
    }
    
}


