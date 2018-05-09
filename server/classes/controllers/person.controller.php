<?php

class PersonController {
    public function __construct() {}

    private function prepareSearch($search) {
        if(trim($search) == '' OR is_null($search)) return ' ';
        
        return " AND (id like '%$search%' OR national_id like '%$search%' OR first_name like '%$search%' 
        OR middle_name like '%$search%' OR last_name like '%$search%' OR gender like '%$search%' 
        OR qualification like '%$search%' OR facility like '%$search%') ";
    }

    public function getPersonTestList($request, $response, $args) {
        $qryParams = $request->getQueryParams();        
        $search = $this->prepareSearch($qryParams['search']);

        $resp = null;
        $obj = new DataObj();
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('search', $search, DataType::STR);
        $data2 = $obj->ReturnObject($resp, DataUtility::Params(),'pr_person_getPersonListCount', ObjectEnum::DataRow);
        $data = [];
       
        if($resp){
            $obj = new DataObj();
            $resp = null;
            DataUtility::Init_HashTable();
            DataUtility::AddParameters('search', $search, DataType::STR);
            DataUtility::AddParameters('start', (isset($qryParams['_start']) ? $qryParams['_start'] : 0),DataType::INT);
            DataUtility::AddParameters('limit', (isset($qryParams['_limit']) ? $qryParams['_limit'] : 0),DataType::INT);
            DataUtility::AddParameters('sort', (isset($qryParams['_sort']) ? $qryParams['_sort'] : null),DataType::STR);
            DataUtility::AddParameters('order', (isset($qryParams['_order']) ? $qryParams['_order'] : null),DataType::STR);
            $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_person_getPersonTestList',ObjectEnum::DataTable); 
        }
        
        header('content-type: application/json; charset=utf-8');
        return $response
        ->withHeader('X-Total-Count', $data2['total'])
        ->withJson($data);
    }
    
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
        //header('X-Total-Count: 122');
        // $dd = $request->getQueryParams();
        // var_export($dd);
        
        //$response->withHeader('X-Total-Count', '143');
        //$response->withAddedHeader('Allow', 'PUT');
        return $response
        ->withHeader('X-Total-Count', $data2['total'])
        ->withHeader('Sort', '-email')
        ->withJson($jsonData);
        //echo json_encode($jsonData); 
    }

    public function getMflByName($request, $response, $args) {
        $resp = null;
        $obj = new DataObj();
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('search',$args['search'],DataType::STR);
        $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_mst_getMFLByName',ObjectEnum::DataTable);
        
        header('content-type: application/json; charset=utf-8');
        echo json_encode($data);
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

    public function addPerson($request, $response, $args) {
        $body = $request->getParsedBody();
        
        $obj = new DataObj();
        $resp = null;
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('id', $body['id'], DataType::INT);
        DataUtility::AddParameters('title_option_id', $body['title_option_id'], DataType::INT);
        DataUtility::AddParameters('first_name', $body['first_name'], DataType::STR);
        DataUtility::AddParameters('middle_name', $body['middle_name'], DataType::STR);
        DataUtility::AddParameters('last_name', $body['last_name'], DataType::STR);
        DataUtility::AddParameters('suffix_option_id', $body['suffix_option_id'], DataType::INT);
        DataUtility::AddParameters('national_id', $body['national_id'], DataType::STR);
        DataUtility::AddParameters('registration_board', $body['registration_board'], DataType::STR);
        DataUtility::AddParameters('registration_number', $body['registration_number'], DataType::STR);
        DataUtility::AddParameters('file_number', $body['file_number'], DataType::STR);
        DataUtility::AddParameters('birthdate', $body['birthdate'], DataType::STR);
        DataUtility::AddParameters('gender_id', $body['gender_id'], DataType::INT);
        DataUtility::AddParameters('facility_id', $body['facility_id'], DataType::INT);
        DataUtility::AddParameters('multi_facility_ids', $body['multi_facility_ids'], DataType::STR);
        DataUtility::AddParameters('phone_work', $body['phone_work'], DataType::STR);
        DataUtility::AddParameters('phone_mobile', $body['phone_mobile'], DataType::STR);
        DataUtility::AddParameters('fax', $body['fax'], DataType::STR);
        DataUtility::AddParameters('phone_home', $body['phone_home'], DataType::STR);
        DataUtility::AddParameters('email', $body['email'], DataType::STR);
        DataUtility::AddParameters('email_secondary', $body['email_secondary'], DataType::STR);
        DataUtility::AddParameters('primary_qualification_option_id', $body['primary_qualification_option_id'], DataType::INT);
        DataUtility::AddParameters('primary_responsibility_option_id', $body['primary_responsibility_option_id'], DataType::INT);
        DataUtility::AddParameters('secondary_responsibility_option_id', $body['secondary_responsibility_option_id'], DataType::INT);
        DataUtility::AddParameters('comments', $body['comments'], DataType::STR);
        DataUtility::AddParameters('person_custom_1_option_id', $body['person_custom_1_option_id'], DataType::INT);
        DataUtility::AddParameters('person_custom_2_option_id', $body['person_custom_2_option_id'], DataType::INT);
        DataUtility::AddParameters('home_address_1', $body['home_address_1'], DataType::STR);
        DataUtility::AddParameters('home_address_2', $body['home_address_2'], DataType::STR);
        DataUtility::AddParameters('home_city', $body['home_city'], DataType::INT);
        DataUtility::AddParameters('home_location_id', $body['home_location_id'], DataType::INT);
        DataUtility::AddParameters('home_postal_code', $body['home_postal_code'], DataType::INT);
        DataUtility::AddParameters('home_is_residential', $body['home_is_residential'], DataType::INT);
        DataUtility::AddParameters('active_id', $body['active_id'], DataType::INT);
        DataUtility::AddParameters('is_deleted', $body['is_deleted'], DataType::INT);
        DataUtility::AddParameters('highest_edu_level_option_id', $body['highest_edu_level_option_id'], DataType::INT);
        DataUtility::AddParameters('attend_reason_option_id', $body['attend_reason_option_id'], DataType::INT);
        DataUtility::AddParameters('attend_reason_other', $body['attend_reason_other'], DataType::STR);
        DataUtility::AddParameters('highest_level_option_id', $body['highest_level_option_id'], DataType::INT);
        DataUtility::AddParameters('me_responsibility', $body['me_responsibility'], DataType::STR);
        DataUtility::AddParameters('mfl_code', $body['mfl_code'], DataType::INT);
        DataUtility::AddParameters('govemp_option_id', $body['govemp_option_id'], DataType::INT);
        DataUtility::AddParameters('occupational_category_id', $body['occupational_category_id'], DataType::INT);
        DataUtility::AddParameters('persal_number', $body['persal_number'], DataType::INT);
        DataUtility::AddParameters('bodies_id', $body['bodies_id'], DataType::INT);
        DataUtility::AddParameters('race_option_id', $body['race_option_id'], DataType::INT);
        DataUtility::AddParameters('disability_option_id', $body['disability_option_id'], DataType::INT);
        DataUtility::AddParameters('professional_reg_number', $body['professional_reg_number'], DataType::INT);
        DataUtility::AddParameters('nationality_id', $body['nationality_id'], DataType::INT);
        DataUtility::AddParameters('nurse_training_id', $body['nurse_training_id'], DataType::INT);
        DataUtility::AddParameters('care_start_year', $body['care_start_year'], DataType::INT);
        DataUtility::AddParameters('timespent_rank_pregnant', $body['timespent_rank_pregnant'], DataType::INT);
        DataUtility::AddParameters('timespent_rank_adults', $body['timespent_rank_adults'], DataType::INT);
        DataUtility::AddParameters('timespent_rank_children', $body['timespent_rank_children'], DataType::INT);
        DataUtility::AddParameters('timespent_rank_pregnant_pct', $body['timespent_rank_pregnant_pct'], DataType::INT);
        DataUtility::AddParameters('timespent_rank_adults_pct', $body['timespent_rank_adults_pct'], DataType::INT);
        DataUtility::AddParameters('timespent_rank_children_pct', $body['timespent_rank_children_pct'], DataType::INT);
        DataUtility::AddParameters('supervised_id', $body['supervised_id'], DataType::INT);
        DataUtility::AddParameters('supervision_frequency_id', $body['supervision_frequency_id'], DataType::INT);
        DataUtility::AddParameters('supervisors_profession', $body['supervisors_profession'], DataType::STR);
        DataUtility::AddParameters('training_recieved_data', $body['training_recieved_data'], DataType::INT);
        DataUtility::AddParameters('facilitydepartment_id', $body['facilitydepartment_id'], DataType::INT);
        DataUtility::AddParameters('custom_3', $body['custom_3'], DataType::STR);
        DataUtility::AddParameters('custom_4', $body['custom_4'], DataType::STR);
        DataUtility::AddParameters('custom_5', $body['custom_5'], DataType::STR);
        DataUtility::AddParameters('approved', $body['approved'], DataType::INT);
        DataUtility::AddParameters('custom_field1', $body['custom_field1'], DataType::STR);
        DataUtility::AddParameters('custom_field2', $body['custom_field2'], DataType::STR);
        DataUtility::AddParameters('custom_field3', $body['custom_field3'], DataType::STR);
        DataUtility::AddParameters('marital_status', $body['marital_status'], DataType::STR);
        DataUtility::AddParameters('spouse_name', $body['spouse_name'], DataType::STR);
        DataUtility::AddParameters('workplace_id', $body['workplace_id'], DataType::INT);
        DataUtility::AddParameters('is_active_trainer', $body['is_active_trainer'], DataType::INT);
        DataUtility::AddParameters('user_id', $args['userid'], DataType::INT);
        $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_person_saveUpdatePerson',ObjectEnum::DataRow);

        header('content-type: application/json; charset=utf-8');
        echo json_encode($data);
    }

    public function getPerson($request, $response, $args) {
        $obj = new DataObj();
        $resp = null;
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('id', $args['id'], DataType::INT);
        $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_person_getPerson',ObjectEnum::DataRow);
        
        header('content-type: application/json; charset=utf-8');
        echo json_encode($data);
    }

    public function checkPersonExists($request, $response, $args) {
        $obj = new DataObj();
        $resp = null;
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('national_id', $args['national_id'], DataType::INT);
        $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_person_checkExists',ObjectEnum::DataRow);
        
        header('content-type: application/json; charset=utf-8');
        if($data['record_exists']) {
            $exists = true;
        }else{
            $exists = false;
        }
        echo json_encode($exists);
    }

    public function getPersonTrainings($request, $response, $args) {
        $obj = new DataObj();
        $resp = null;
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('id', $args['id'], DataType::INT);
        $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_person_getTrainings',ObjectEnum::DataTable);
        
        header('content-type: application/json; charset=utf-8');
        echo json_encode($data);
    }
}