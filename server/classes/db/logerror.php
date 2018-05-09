<?php
class LogError{
	static function LogMessage(Exception $e, $diplayToUser=false){
		$array = $e->getTrace();
		$errorMsg = '----------------<br/>';
		$errorMsg .= $e->getMessage().'<br/>';
		foreach($array as $key => $value){
			if(is_array($value)){
				foreach ($value as $key2=>$value2){
					if(is_array($value2)){continue;}
					$errorMsg .= $key2.': '.$value2.'<br/>';	
				}			
			}
			$errorMsg .='<br/>';
		}
		$errorMsg .= '----------------<br/>';
		echo $errorMsg;
	}
}