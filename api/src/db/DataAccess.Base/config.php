<?php
$db = $settings['settings']['db'];
define('DB_USERNAME', $db['user']);
define('DB_PASSWORD', $db['password']);
define('DB_HOST', $db['host']);
define('DB_NAME', $db['dbname']);
define('DB_DSN','mysql:host='.$db['host'].';dbname='.$db['dbname']);
?>