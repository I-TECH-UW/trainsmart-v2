
<?php

use Slim\Http\Request;
use Slim\Http\Response;

// Routes

$app->get('/', function (Request $request, Response $response, array $args) {
    echo "Hello There"; 
});

$app->get('/location', '\MasterController:getLocationList');
$app->get('/trainingcategoryoptions', '\MasterController:getTrainingCategoryOptions');
$app->get('/trainingcategorytitleoptions', '\MasterController:getTrainingCategoryTitleOptions');
$app->get('/trainingorganizeroptions', '\MasterController:getTrainingOrganizerOptions');
$app->get('/trainingleveloptions', '\MasterController:getTrainingLevelOptions');
// $app->get('/about/{id}', \TestController::class . ':about');


$app->get('/blog[/{id:[0-9]+}]',function(Request $request, Response $response, array $args){
	echo "The blogs ".$args['id'];
/* 	$qry = "select * from blog";
	$rs = $this->db->query($qry);
	
	
	while($row = $rs->fetch_assoc()){
			$blogEntries[] = $row;
		}
    
        var_export($blogEntries); */
	/* $data = array(
		"main_heading" => "Blog",
		"blog_entries" =>$blogEntries
	);
	
	return $this->view->render($response, 'blog.php',$data); */
});

/* // Pay attention to this when you are using some javascript front-end framework and you are using groups in slim php
$app->group('/api', function () {
    // Due to the behaviour of browsers when sending PUT or DELETE request, you must add the OPTIONS method. Read about preflight.
    $this->map(['PUT', 'OPTIONS'], '/{user_id:[0-9]+}', function ($request, $response, $arguments) {
        // Your code here...
    });
}); */

/* $app->group('/users/{id:[0-9]+}', function () {
    $this->map(['GET', 'DELETE', 'PATCH', 'PUT'], '', function ($request, $response, $args) {
        // Find, delete, patch or replace user identified by $args['id']
    })->setName('user');
    $this->get('/reset-password', function ($request, $response, $args) {
        // Route for /users/{id:[0-9]+}/reset-password
        // Reset the password for user identified by $args['id']
    })->setName('user-password-reset');
}); */