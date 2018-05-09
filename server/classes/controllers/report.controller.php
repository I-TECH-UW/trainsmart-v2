<?php

class ReportController {
    public function __construct() {}

    public function getTrainingActivityReport($request, $response, $args) {
        $resp = null;
        $obj = new DataObj();
        DataUtility::Init_HashTable();
        DataUtility::AddParameters("training_id",$args['id'],DataType::INT);
        $header = $obj->ReturnObject($resp, DataUtility::Params(),'pr_reports_ActivityReportHeader', ObjectEnum::DataRow);
        $trainers = $obj->ReturnObject($resp, DataUtility::Params(),'pr_reports_activityReportTrainers', ObjectEnum::DataTable);
        $participants = $obj->ReturnObject($resp, DataUtility::Params(),'pr_reports_activityReportParticipants', ObjectEnum::DataTable);
        
        $data = array('header' => $header, 'trainers' => $trainers, 'participants' => $participants);

        header('content-type: application/json; charset=utf-8');
        echo json_encode($data); 
    }

    private function prepareTrainingSearchQry($qryParams) {
        $search = '';
        foreach($qryParams as $key => $value) {
            if($key != 'training_start_date' && $key != 'training_category_option_id' && $key != 'training_sub_category_option_id'){
                //Exluding training_category_option_id and training_sub_category_option_id for now
                if($value != 'null' && $value != '') {
                    if($search == ''){
                        $search.= "a.$key = $value";
                    }else{
                        $search.= " AND a.$key = $value";
                    }
                }
            }elseif($key == 'training_start_date'){
                if($value != 'null' && $value != '') {
                    if($search == ''){
                        $search.= "a.$key >= '$value'";
                    }else{
                        $search.= " AND a.$key >= '$value'";
                    }
                }
            }
        }
        $search = $search != '' ? " AND ($search)" : $search;
        //exit($search);
        return $search;
    }

    public function getTrainings($request, $response, $args) {
        $qryParams = $request->getQueryParams();
        $searchQry = $this->prepareTrainingSearchQry($qryParams);

        $resp = null;
        $obj = new DataObj();
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('search', $searchQry, DataType::STR);
        $trainings = $obj->ReturnObject($resp, DataUtility::Params(),'pr_reports_getTrainings', ObjectEnum::DataTable);
        
        $data = array('data' => $trainings, 'labels' => array('#','Training Title','Training Sub Titles','Training Start Date','Training End Date', 
        'Duration','Training Level', 'Training Sponsor','Training Location','County', 'Status'));

        header('content-type: application/json; charset=utf-8');
        echo json_encode($data); 
    }
}