<?php
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
    ->withHeader('Access-Control-Allow-Headers', 'No-Auth, X-Requested-With, Content-Type, Accept, Origin, Referer, Authorization')
    ->withHeader('Access-Control-Expose-Headers', 'X-Total-Count, Sort, X-Pagination-Total-Count, X-Pagination-Page-Count, X-Pagination-Current-Page, X-Pagination-Per-Page')
    ->withHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    //->withHeader("Access-Control-Allow-Methods", implode(",", $methods));
    
});
