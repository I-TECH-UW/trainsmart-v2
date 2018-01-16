
<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require('vendor/autoload.php');



/**
 * @var $settings - contains the slim framework and database configuration settings
 * This must come before the db source files
 */
$settings = require __DIR__ . '/src/settings.php';

require __DIR__ . '/src/db/DataAccess.Base/config.php';
require __DIR__ . '/src/db/Application.Common/enum.php';
require __DIR__ . '/src/db/Application.Common/logerror.php';
require __DIR__ . '/src/db/Application.Common/utility.php';
require __DIR__ . '/src/db/DataAccess.Base/datamgr.php';
require __DIR__ . '/src/db/DataAccess.Base/processbase.php';
require __DIR__ . '/src/db/DataAccess.Common/datautility.php';
require __DIR__ . '/src/db/DataAccess.Entity/dataobj.php';

require __DIR__ . '/src/master.controller.php';
require __DIR__ . '/src/training.controller.php';
require __DIR__ . '/src/person.controller.php';

$app = new \Slim\App($settings);

/**
 * This is the cors middleware
 * It will add the Access-Control-Allow-Methods header to every request
 */
$app->add(function($request, $response, $next) {
    $route = $request->getAttribute("route");
 
    $methods = [];

    if (!empty($route)) {
        $pattern = $route->getPattern();

        foreach ($this->router->getRoutes() as $route) {
            if ($pattern === $route->getPattern()) {
                $methods = array_merge_recursive($methods, $route->getMethods());
            }
        }
        //Methods holds all of the HTTP Verbs that a particular route handles.
    } else {
        $methods[] = $request->getMethod();
    }
    
    $response = $next($request, $response);


    return $response
    ->withHeader('Access-Control-Allow-Origin', '*')
    ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
    ->withHeader("Access-Control-Allow-Methods", implode(",", $methods));
    
});

// Register routes
require __DIR__ . '/src/routes.php';


$app->run();
?>
