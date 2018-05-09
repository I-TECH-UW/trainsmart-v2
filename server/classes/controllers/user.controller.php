<?php

class UserController {
    public function __construct() {}

    private function prepareSearchQry($qryParams) {
        $search = '';
        switch($qryParams['refined']) {
            case 0:
                $term = $qryParams['search'];
                $search = " WHERE a.id = '$term' OR a.first_name like '%$term%' OR a.last_name like '%$term%' OR a.email like '%$term%'
                OR a.username like '%$term%' OR a.middle_name like '%$term%' OR a.mobile like '%$term%'";
                $search = $term != '' ? $search : '';
                break;
            case 1:
                foreach($qryParams as $key => $value) {
                    if($key != 'refined' && $key != 'search' && $key !="_start" &&
                    $key != '_limit' && $key != '_order' && $key != '_sort'){
                        if($value != 'null') {
                            if($search == ''){
                                $search.= "$key = '$value'";
                            }else{
                                $search.= " AND $key = '$value'";
                            }
                        }
                    }
                }
                $search = $search != '' ? " WHERE $search" : $search;
                break;
        }
        //exit($search);
        return $search;
    }

    public function getUserList($request, $response, $args) {
        $qryParams = $request->getQueryParams();
        $searchQry = $this->prepareSearchQry($qryParams);

        $resp = null;
        $obj = new DataObj();
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('search', $searchQry, DataType::STR);
        $data2 = $obj->ReturnObject($resp, DataUtility::Params(),'pr_user_getUserListCount', ObjectEnum::DataRow);
    
        $data = [];

        if($resp){
            $obj = new DataObj();
            $resp = null;
            DataUtility::Init_HashTable();
            DataUtility::AddParameters('search', $searchQry, DataType::STR);
            DataUtility::AddParameters('start', (isset($qryParams['_start']) ? $qryParams['_start'] : 0),DataType::INT);
            DataUtility::AddParameters('limit', (isset($qryParams['_limit']) ? $qryParams['_limit'] : 0),DataType::INT);
            DataUtility::AddParameters('sort', (isset($qryParams['_sort']) ? $qryParams['_sort'] : null),DataType::STR);
            DataUtility::AddParameters('order', (isset($qryParams['_order']) ? $qryParams['_order'] : null),DataType::STR);
            $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_user_getUserList',ObjectEnum::DataTable);
        }

        header('content-type: application/json; charset=utf-8');
        return $response
        ->withHeader('X-Total-Count', $data2['total'])
        ->withJson($data);
    }

    public function getUser($request, $response, $args) {
        //var_dump($request->headers->);
        //if($request->hasHeader('HTTP_AUTHORIZATION')) {
            //var_export($request->getHeaderLine('HTTP_AUTHORIZATION'));
            //echo $_SERVER["HTTP_AUTHORIZATION"];
            //echo apache_request_headers()["Authorization"];
        //}
        $resp = null;
        $obj = new DataObj();
        DataUtility::Init_HashTable();
        DataUtility::AddParameters("id",$args['id'],DataType::INT);
        $data = $obj->ReturnObject($resp, DataUtility::Params(),'pr_user_getUser', ObjectEnum::DataRow);
        
        header('content-type: application/json; charset=utf-8');
        echo json_encode($data); 
    }

    public function addUser($request, $response, $args) {
        $body = $request->getParsedBody();

        $user_id = $args['userid'];
        
        $obj = new DataObj();
        $resp = null; 
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('id', $body['id'], DataType::INT);
        DataUtility::AddParameters('username', $body['username'], DataType::STR);
        DataUtility::AddParameters('password', $body['password'], DataType::STR);
        DataUtility::AddParameters('email', $body['email'], DataType::STR);
        DataUtility::AddParameters('first_name', $body['first_name'], DataType::STR);
        DataUtility::AddParameters('middle_name', $body['middle_name'], DataType::STR);
        DataUtility::AddParameters('last_name', $body['last_name'], DataType::STR);
        DataUtility::AddParameters('person_id', $body['person_id'], DataType::INT);
        DataUtility::AddParameters('mobile', $body['mobile'], DataType::STR);
        DataUtility::AddParameters('is_blocked', $body['is_blocked'], DataType::INT);
        DataUtility::AddParameters('roleid', $body['roleid'], DataType::INT);
        DataUtility::AddParameters('created_by', $user_id, DataType::INT);
        $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_user_saveUpdateUser',ObjectEnum::DataRow);  
        
        header('content-type: application/json; charset=utf-8');
        echo json_encode($data);
    }

    public function blockUser($request, $response, $args) {
        $body = $request->getParsedBody();
        $obj = new DataObj();
        $resp = null;
        $data = null;
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('id', $body['id'], DataType::INT);
        DataUtility::AddParameters('is_blocked', $body['is_blocked'], DataType::INT);
        DataUtility::AddParameters('comment', $body['comment'], DataType::STR);
        DataUtility::AddParameters('user_id', $args['userid'], DataType::INT);
        $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_training_approveTraining',ObjectEnum::ExecuteNonQuery);

        /* if($body['is_approved'] == 1 && $resp){
            DataUtility::Init_HashTable();
            DataUtility::AddParameters('training_id', $body['training_id'], DataType::INT);
            $training = $obj->ReturnObject($resp,DataUtility::Params(),'pr_cert_getTrainingById',ObjectEnum::DataRow);
            $trainers = $obj->ReturnObject($resp,DataUtility::Params(),'pr_training_getTrainingTrainers',ObjectEnum::DataTable);

	        DataUtility::Init_HashTable();
            DataUtility::AddParameters('id', $args['userid'], DataType::INT);
            $sysuser = $obj->ReturnObject($resp,DataUtility::Params(),'pr_user_getUser',ObjectEnum::DataRow);

            $username = $sysuser['first_name'].' '.$sysuser['last_name'];
            $useremail = $sysuser['email'];
            $role = $sysuser['role_name'];

            $trainerList = array();
            foreach($trainers as $trainer){
                $trainerList[] = $trainer['email'];
            }

            $arr = $this->getHtmlMessageArray(1, $body['training_id'], $args['userid']);//Approval Msg

            $this->sendEmail($trainerList, "Trainer", "New Training Approved - ".$arr['title'], $arr['message']);
        } */

        header('content-type: application/json; charset=utf-8');
        echo json_encode($resp);
    }
}