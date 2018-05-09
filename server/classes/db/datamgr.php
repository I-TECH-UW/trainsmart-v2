<?php

Class DataMgr{

	Private static $conString = "";
	Private static $connection = null;
	
	public static function GetConnection(){
		Try{
			$db = Settings::getSettings()['settings']['db'];
			$dsn= 'mysql:host='.$db['host'].';dbname='.$db['dbname'];
			$username=$db['user'];
			$passwd=$db['password'];
			$options=null;

			self::$connection = new PDO($dsn, $username, $passwd, $options);
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

