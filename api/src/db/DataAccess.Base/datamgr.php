<?php
/*
require '../Application.Common/logerror.php';
include_once ("../DataAccess.Common/datautility.php");
*/
Class DataMgr{

	Private static $conString = "";
#	Private static $objUtil = New Utility;
	Private static $connection = null;
	
	private  static $dsn= DB_DSN;
	private  static $username=DB_USERNAME;
	private  static $passwd=DB_PASSWORD;
	private  static $options=null;
	
	public static function GetConnection(){
		Try{/*
			conString = objUtil.Decrypt(My.Settings.ConnectionString)*/
			self::$connection = new PDO(self::$dsn, self::$username, self::$passwd, self::$options);
			self::$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

			Return self::$connection;
		}
		Catch(PDOException $e){
			LogError::LogMessage($e);
			return null;
		}
     }

	public static function ReleaseConnection(&$connection){
        try{
        	unset($connection);
	        $connection = null;
	        echo "Connection released";
        }
        catch(Exception $e){
        	echo $e->getMessage();
        }
	}

    public static function BeginTransaction(&$connection){
       	$connection->beginTransaction();#true/false
    }

        public static function CommitTransaction(&$connection){
        	$connection->commit();#true/false
        }

        public static function RollBackTransaction(&$connection){
        	$connection->rollBack();#true/false
        }

}

