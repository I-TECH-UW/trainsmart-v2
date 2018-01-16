
<?php

use Slim\Http\Request;
use Slim\Http\Response;

// Routes
// php -S localhost:8080
$app->get('/', function (Request $request, Response $response, array $args) {
    //echo "Hello There"; 
    $multiple = false;
    echo "Fine".(is_int($multiple) or ($multiple === 0));
    $multiple = ( $multiple !== false ? '[]' : 'y');
    echo "Multiple is ".$multiple;
    $x = array();
    echo isset($x['name']);
    $cols []= 'id';
    $cols [] = 'pepfar_category_phrase';
    $cols [] = 'c.duration_days';
    var_export($cols);
});


$app->group('/master', function(){
    $this->get('/{listref}', '\MasterController:getMasterList');
    $this->post('/add/{itemref}/{userid}', '\MasterController:saveUpdateMasterItem');
});


$app->group('/training', function () {
    $this->get('/list/{userid}/{pagenumber}/{pagesize}', '\TrainingController:getTrainingList');
    $this->map(['PUT', 'OPTIONS'], '/del/{userid}', '\TrainingController:deleteTraining');
    $this->post('/add/{userid}', '\TrainingController:addTraining');
    $this->get('/item/{id}', '\TrainingController:getTraining');
});

$app->group('/person', function() {
    $this->get('/list/{pagenumber}/{pagesize}', '\PersonController:getPersonList');
    $this->map(['PUT', 'OPTIONS'], '/del/{userid}', '\PersonController:deletePerson');
});

// Pay attention to this when you are using some javascript front-end framework and you are using groups in slim php
/* $app->group('/users/{id:[0-9]+}', function () {
    $this->map(['GET', 'DELETE', 'PATCH', 'PUT'], '', function ($request, $response, $args) {
        // Find, delete, patch or replace user identified by $args['id']
    })->setName('user');
    $this->get('/reset-password', function ($request, $response, $args) {
        // Route for /users/{id:[0-9]+}/reset-password
        // Reset the password for user identified by $args['id']
    })->setName('user-password-reset');
    // Due to the behaviour of browsers when sending PUT or DELETE request, you must add the OPTIONS method. Read about preflight.
    $this->map(['PUT', 'OPTIONS'], '/{user_id:[0-9]+}', function ($request, $response, $arguments) {
        // Your code here...
    });
}); */