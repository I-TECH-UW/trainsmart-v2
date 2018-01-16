<?php

class TrainingController {
    public function __construct(){}

    public function getTrainingList($request, $response, $args) {
        $userid = $args['userid'];

        $resp = null;
        $obj = new DataObj();
        DataUtility::Init_HashTable();
        DataUtility::AddParameters("marketid",$userid,DataType::INT);
        $data2 = $obj->ReturnObject($resp, DataUtility::Params(),'pr_training_getTrainingListCount', ObjectEnum::DataRow);
    
        $jsonData = array('total' => 0,'items' => []);

        if($resp){
            $obj = new DataObj();
            $resp = null;
            DataUtility::Init_HashTable();
            DataUtility::AddParameters('userid',$userid,DataType::INT);
            DataUtility::AddParameters('pagenumber',$args['pagenumber'],DataType::INT);
            DataUtility::AddParameters('pagesize',$args['pagesize'],DataType::INT);
            $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_training_getTrainingList',ObjectEnum::DataTable);
            
            $jsonData = array('total' => $data2['total'],'items' => $data);
        }

        header('content-type: application/json; charset=utf-8');
        echo json_encode($jsonData); 
    }

    public function deleteTraining($request, $response, $args) {
        
        $body = $request->getParsedBody();

        $obj = new DataObj();
        $resp = null;
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('id',$body['id'],DataType::INT);
        DataUtility::AddParameters('userid',$args['userid'],DataType::INT);
        $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_training_deleteTraining',ObjectEnum::ExecuteNonQuery);

        header('content-type: application/json; charset=utf-8');
        echo json_encode($resp);
    }

    public function addTraining($request, $response, $args) {
        $body = $request->getParsedBody();
        
        $obj = new DataObj();
        $resp = null;
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('id', $body['id'], DataType::INT);
        DataUtility::AddParameters('training_category_option_id', $body['training_category_option_id'], DataType::INT);
        DataUtility::AddParameters('training_title_option_id', $body['training_title_option_id'], DataType::INT);
        DataUtility::AddParameters('has_known_participants', $body['has_known_participants'], DataType::INT);
        DataUtility::AddParameters('training_start_date', $body['training_start_date'], DataType::STR);
        DataUtility::AddParameters('training_end_date', $body['training_end_date'], DataType::STR);
        DataUtility::AddParameters('training_length_value', $body['training_length_value'], DataType::INT);
        DataUtility::AddParameters('training_length_interval', $body['training_length_interval'], DataType::STR);
        DataUtility::AddParameters('training_organizer_option_id', $body['training_organizer_option_id'], DataType::INT);
        DataUtility::AddParameters('training_location_id', $body['training_location_id'], DataType::INT);
        DataUtility::AddParameters('training_level_option_id', $body['training_level_option_id'], DataType::INT);
        DataUtility::AddParameters('training_method_option_id', $body['training_method_option_id'], DataType::INT);
        DataUtility::AddParameters('training_custom_1_option_id', $body['training_custom_1_option_id'], DataType::INT);
        DataUtility::AddParameters('training_custom_2_option_id', $body['training_custom_2_option_id'], DataType::INT);
        DataUtility::AddParameters('training_got_curriculum_option_id', $body['training_got_curriculum_option_id'], DataType::INT);
        DataUtility::AddParameters('training_primary_language_option_id', $body['training_primary_language_option_id'], DataType::INT);
        DataUtility::AddParameters('training_secondary_language_option_id', $body['training_secondary_language_option_id'], DataType::INT);
        DataUtility::AddParameters('comments', $body['comments'], DataType::INT);
        DataUtility::AddParameters('got_comments', $body['got_comments'], DataType::INT);
        DataUtility::AddParameters('objectives', $body['objectives'], DataType::INT);
        DataUtility::AddParameters('is_tot', $body['is_tot'], DataType::INT);
        DataUtility::AddParameters('is_refresher', $body['is_refresher'], DataType::INT);
        DataUtility::AddParameters('pre', $body['pre'], DataType::INT);
        DataUtility::AddParameters('post', $body['post'], DataType::INT);
        DataUtility::AddParameters('training_refresher_option_id', $body['training_refresher_option_id'], DataType::INT);
        DataUtility::AddParameters('course_id', $body['course_id'], DataType::INT);
        DataUtility::AddParameters('custom_3', $body['custom_3'], DataType::INT);
        DataUtility::AddParameters('custom_4', $body['custom_4'], DataType::INT);
        DataUtility::AddParameters('final_mark', $body['final_mark'], DataType::INT);
        DataUtility::AddParameters('cpd', $body['cpd'], DataType::INT);
        DataUtility::AddParameters('report_file', $body['report_file'], DataType::INT);
        DataUtility::AddParameters('other_location_region', $body['other_location_region'], DataType::INT);
        DataUtility::AddParameters('other_location', $body['other_location'], DataType::INT);
        DataUtility::AddParameters('userid', $args['userid'], DataType::INT);
        $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_training_saveUpdateTraining',ObjectEnum::DataRow);

        header('content-type: application/json; charset=utf-8');
        echo json_encode($data);
    }

    public function getTraining($request, $response, $args) {
        $obj = new DataObj();
        $resp = null;
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('id', $args['id'], DataType::INT);
        $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_training_getTraining',ObjectEnum::DataRow);
        
        header('content-type: application/json; charset=utf-8');
        echo json_encode($data);
    }
}
?>