<?php
return [
    'settings' => [
        'displayErrorDetails' => true, // set to true in production
        'addContentLengthHeader' => false,
        "determineRouteBeforeAppMiddleware" => true, // required for the cors middleware to work
      	'db' =>[
                'host'=> 'localhost',
                'user'=> 'root',
                'password'=> 'mysql',
                'dbname'=> 'trainsmart',
            ]  
        
    ],
];
