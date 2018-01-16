<?php

if (is_ajax()) {
	if (isset($_POST["action"]) && !empty($_POST["action"])) { //Checks if action value exists
		$action = $_POST["action"];
		switch($action) { //Switch case for value of action
			case "test": test_function(); break;
		}
	}
}

//Function to check if the request is an AJAX request
function is_ajax() {
	return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}


function test_function(){
	$array = array($_POST);
	
	require_once '../businessprocess/buser.php';
	call_user_func_array( array("BUser","saveUpdateUser"), $array);
	//Do what you need to do with the info. The following are some examples.
	//if ($return["favorite_beverage"] == ""){
	//  $return["favorite_beverage"] = "Coke";
	//}
	//$return["favorite_restaurant"] = "McDonald's";

	//$return["json"] = json_encode($return);
	//echo json_encode($return);
	//print_r(json_encode($return));
	//extract($return);
	//echo($firstname);
	//echo '{"firstname":"Stephen", "lastname":"Luchacha", "genderid":1, "email":"luchacha.s@gmail.com", "username":"sluchacha", "password":"12345"}';
}


?>