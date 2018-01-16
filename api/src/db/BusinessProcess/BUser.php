<?php
require '../DataAccess.Entity/dataobj.php';
include '../interfaces/iuser.php';

class BUser implements IUser{
	/**
	 * Gets a single user record
	 * @see IUser::getUserById()
	 * @param $id
	 * @return $data - an array containing the record or null if not found
	 */
	public function getUserById($id){
		$obj = null;
		$data = null;
		try{
			$obj = new DataObj();
			DataUtility::Init_HashTable();
			DataUtility::AddParameters("id", $id, DataType::INT);
			
			$data = $obj->ReturnObject(DataUtility::Params(), "call pr_users_getUserByID(:id)",ObjectEnum::DataTable);
		}catch(Exception $e){
			LogError::LogMessage($e);
		}finally {
			unset($obj);
		}
		return $data;
	}
	
	public function getAllUsers($startrec, $maxrec){
		
	}
	
	public function saveUpdateUser($user){
		$obj = null;
		$data = null;
		try{
		$obj = new DataObj();
		extract($user);
		DataUtility::AddParameters("id", $id,DataType::INT);
		DataUtility::AddParameters("firstname", $firstname, DataType::STR);
		DataUtility::AddParameters("lastname", $lastname, DataType::STR);
		DataUtility::AddParameters("genderid", $genderid, DataType::INT);
		DataUtility::AddParameters("email", $email, DataType::STR);
		DataUtility::AddParameters("username", $username, DataType::STR);
		DataUtility::AddParameters("password", $password, DataType::STR);
		//"call pr_users_saveUpdateUser(:id, :firstname, :lastname, :genderid, :email, :username, :password)"
		$data = $obj->ReturnObject(DataUtility::Params(), "pr_users_saveUpdateUser", ObjectEnum::DataRow);
	
		if($data != null && ($data['id'] >= 1)){
			echo "<div class=\"alert alert-success alert-dismissable\">";
			echo "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>";
			echo "Record successfully saved.";
			echo "</div>";
		}else{
			echo "<div class=\"alert alert-danger alert-dismissable\">";
			echo "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>";
			echo "Record not saved";
			echo "</div>";
		}
		}catch(Exception $e){
			LogError::LogMessage($e);
		}finally{
			unset($data);
			unset($obj);
		}
	}
	
	public function deleteUserById($id){
		
	}
}
/*
 * PHP Http Proxy is a php script for taking webpages from one server and processes so that your main server is proctected/hidden. Usefull for those who have or require indirect access to the web and or their server.


$user = new BUser();
$array = $user->getUserById(12);
$array = json_encode($array);
//echo ($array);
//print_r($array);
$data = array("Hello", 12);

// Send the data.
echo json_encode($data);

// call out to function
//$response = call_user_func_array( $function, $proxyPackage->m_parameters );
 * 
$array = array("id"=>1);
$response = call_user_func_array( array("BUser","getUserById"), $array );
print_r($response);
*/
