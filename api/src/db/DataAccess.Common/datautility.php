<?php
/*
include_once ("../Application.Common/enum.php");
*/
Class DataUtility{

	private static $PKey = 0;
	private static $_Params=array();
	
	/*Returns an array of parameters*/
	public static function Params(){
		Return self::$_Params;
	}
	
	public static function Init_HashTable(){
		self::$_Params=array();
		self::$PKey = 0;
	}
	//Force type checking in function definition
	public static function AddParameters($paramName, $paramValue, $paramType = DataType::STR){
		try{
			self::$PKey += 1;
			self::$_Params[self::$PKey] = ":".$paramName;
			self::$PKey += 1;
			self::$_Params[self::$PKey] = $paramValue;
			self::$PKey += 1;
			
			//Check that the datatype is valid
			$myType = new DataType(DataType::INT);
			
			if($myType->isValidEnumValue($paramType)){
				self::$_Params[self::$PKey] = $paramType;
			}else{
				throw new Exception("Invalid enum type specified in class method DataUtility::AddParameters!");
			}
		}
		catch (Exception $e){
			echo $e->getMessage();
		}
	}
	/*
	 * @Param prefix
	 * @Param $values
	 * @Param $ParamType [Optional] - default is DataType::INT
	 * @throws Exception Throws exception if an invalid Paramtype is used
	 * */
	public static function AddParametersSpecial($prefix, $values, &$bindString, $paramType = DataType::INT)
	{
		try{
			//Check that the datatype is valid
			$myType = new DataType(DataType::INT);
			
			if(!$myType->isValidEnumValue($paramType)){
				throw new Exception("Invalid enum type specified in class method DataUtility::AddParameters!");
			}
			
			$array = explode(",",$values);
			foreach($array as $index => $value){
				if($bindString == "" || $bindString==null){
					$bindString .= ":".$prefix.$index;
				}else{
					$bindString .= ",:".$prefix.$index;
				}
				self::$PKey += 1;
				self::$_Params[self::$PKey] = ":".$prefix.$index;
				self::$PKey += 1;
				self::$_Params[self::$PKey] = $value;
				self::$PKey += 1;
				self::$_Params[self::$PKey] = $paramType;
			}
		}catch(Exception $e){
			echo $e->getMessage();
		}
	}
}

#Creating our own enumerator
class ObjectEnum extends Enum{
	const 
		__default = 3
		,DataSet = 0
		,DataTable = 1
		,DataRow = 2
		,ExecuteNonQuery = 3
	;
}

class DataType extends Enum{
	const
	__default = 2 #PDO::PARAM_STR
	,INT = 1 #PDO::PARAM_INT
	,STR = 2 #PDO::PARAM_STR
	,BOOL = 5 #PDO::PARAM_BOOL
	;
}


