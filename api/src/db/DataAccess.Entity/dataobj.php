<?php
/*
include_once("../DataAccess.Base/processbase.php");
include_once("../DataAccess.Base/datamgr.php");
include_once("../DataAccess.Common/datautility.php");
*/
final class DataObj extends ProcessBase{
	public function ReturnObject(&$resp, array $paramArray, $query, $obj = ObjectEnum::ExecuteNonQuery, $callBackQuery = ""){
		try{
			if ($this->GetConnection()==null){
				$con = DataMgr::GetConnection();
				#echo " from datamgr";
			}else{
				$con = $this->GetConnection();
				#echo " from processbase";
			}
			
			if(!$con){
				throw new Exception("Could not connect to the database.");
			}
            /******************************************************
            **Returns Numeric values as numeric values
            */
            $con->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
			$con->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, false);
            /*****************************************************/
            
			$storedProcedure = true;
			
			//Determine if the query is a procedure call or an sql statement
			if(strlen($query) > 5){
				$subString = strtolower(substr($query, 0, 6));
				switch( $subString){
					case "select":
					case "update":
					case "insert":
					case "delete":
						$storedProcedure = false;
						break;
					default:
						$storedProcedure = true;
				}
			}
			
			if($storedProcedure){
				//Add the parameters to a prepared statement
				$strText = '';
				for ($i = 1; $i < count($paramArray); $i+=3){
					if(!($paramArray[$i+2]==PDO::PARAM_INPUT_OUTPUT)){
						If(empty($strText)){
							$strText = $paramArray[$i];
						}else{
							$strText .= ",".$paramArray[$i];
						}
					}
				}
				
				$query = 'CALL '.$query.'('.$strText.')';
			}
			
			//Prepare the query
			$stmt = $con->prepare($query);
			
			//Add the parameters to a prepared statement
			for ($i = 1; $i < count($paramArray); $i+=3){
				$stmt->bindParam($paramArray[$i], $paramArray[$i+1],$paramArray[$i+2]);
			}
			
			$resp = $stmt->execute();
			
			
			switch ($obj){
				case ObjectEnum::DataRow:
					$data = $stmt->fetch(PDO::FETCH_ASSOC);
					break;
				case ObjectEnum::DataTable:
					$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
					break;
				case ObjectEnum::DataSet:
					$data = $stmt->fetchAll();
					break;
				case ObjectEnum::ExecuteNonQuery:
					if(!empty($callBackQuery)){
						$data = $con->query($callBackQuery)->fetch(PDO::FETCH_ASSOC);
					}else{
						$data = null;
					}
					break;
				default:
					$data = null;
			}
			/*
			while($row = $stmt->fetch())
			{
				$row = array_change_key_case($row,CASE_LOWER);
			
				echo $row['patientid'].'<br />';
				echo $row['patientname'].'<br />';
			}
			*/
			unset($stmt);
			return $data;
		}catch(Exception $e){
			//echo $e->getMessage();
            //LogError::LogMessage($e);
            throw new exception($e->getMessage());
			return  null;
		}
	}
	
	
}
?>