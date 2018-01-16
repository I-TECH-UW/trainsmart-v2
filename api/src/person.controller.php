<?php

class PersonController {
    public function __construct() {}
    
    public function getPersonList($request, $response, $args) {
        $resp = null;
        $obj = new DataObj();
        DataUtility::Init_HashTable();
        $data2 = $obj->ReturnObject($resp, DataUtility::Params(),'pr_person_getPersonListCount', ObjectEnum::DataRow);
    
        $jsonData = array('total' => 0,'items' => []);

        if($resp){
            $obj = new DataObj();
            $resp = null;
            DataUtility::Init_HashTable();
            DataUtility::AddParameters('pagenumber',$args['pagenumber'],DataType::INT);
            DataUtility::AddParameters('pagesize',$args['pagesize'],DataType::INT);
            $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_person_getPersonList',ObjectEnum::DataTable);
            
            $jsonData = array('total' => $data2['total'],'items' => $data);
        }

        header('content-type: application/json; charset=utf-8');
        // $dd = $request->getQueryParams();
        // var_export($dd);
        echo json_encode($jsonData); 
    }

    public function deletePerson($request, $response, $args) {
        
        $body = $request->getParsedBody();

        $obj = new DataObj();
        $resp = null;
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('id',$body['id'],DataType::INT);
        DataUtility::AddParameters('userid',$args['userid'],DataType::INT);
        $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_person_deletePerson',ObjectEnum::ExecuteNonQuery);

        header('content-type: application/json; charset=utf-8');
        echo json_encode($resp);
    }
}