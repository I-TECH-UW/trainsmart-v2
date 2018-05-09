<?php

Class ProcessBase{

	private static $_Connection;
	
	function __construct__(){
		self::$_Connection = null;
	}
	
	public static function &GetConnection(){
		return self::$_Connection;
	}
	
	public static function SetConnection(&$value){
		Self::$_Connection = $value;
	}

}
?>