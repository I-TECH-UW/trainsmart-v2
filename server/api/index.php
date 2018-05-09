<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

/**
 * @var $settings - contains the slim framework and database configuration settings
 * This must come before the db source files
 */
require __DIR__ . '/../classes/start.php';

$settings = Settings::getSettings();

$app = new \Slim\App($settings);

//Middleware - includes cors
require  __DIR__ . '/../classes/middleware.php';
// Register routes
require  __DIR__ . '/../classes/routes.php';

$app->run();
?>
