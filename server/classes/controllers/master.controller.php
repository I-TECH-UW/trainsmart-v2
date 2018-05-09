<?php

class MasterController {

    public function __construct(){}

        /**
         * @return void
         */
    public function getMasterList($request, $response, $args){
        $listref = $args['listref'];
        $proc = '';

        switch($listref){
            case 'location': {$proc = 'pr_mst_getLocation'; break;}
            case 'trainingcategoryoptions': {$proc = 'pr_mst_getTrainingCategory'; break;}
            case 'trainingsubcategoryoptions': {$proc = 'pr_mst_getTrainingSubCategory'; break;}
            case 'trainingtitleoptions': {$proc = 'pr_mst_getTrainingTitle'; break;}
            case 'trainingorganizeroptions': {$proc = 'pr_mst_getTrainingOrganizer'; break;}
            case 'trainingleveloptions': {$proc = 'pr_mst_getTrainingLevel'; break;}
            case 'pepfarcategoryoptions': {$proc = 'pr_mst_getPepfarCategory'; break;}
            case 'personeducation': {$proc = 'pr_mst_getPersonEducationLevel'; break;}
            case 'personactivetrainer': {$proc = 'pr_mst_getPersonActiveTrainer'; break;}
            case 'personattendreason': {$proc = 'pr_mst_getPersonAttendReason'; break;}
            case 'persontitle': {$proc = 'pr_mst_getPersonTitle'; break;}
            case 'personsuffix': {$proc = 'pr_mst_getPersonSuffix'; break;}
            case 'gender': {$proc = 'pr_mst_getGender'; break;}
            case 'personqualification': {$proc = 'pr_mst_getPersonQualfication'; break;}
            case 'personprimaryresponsibility': {$proc = 'pr_mst_getPersonPrimaryResponsibility'; break;}
            case 'personsecondaryresponsibility': {$proc = 'pr_mst_getPersonSecondaryResponsibility'; break;}
            case 'userroles': {$proc = 'pr_mst_getUserRoles'; break;}
            case '': {$proc = ''; break;}
            case '': {$proc = ''; break;}
            default:
                $proc = '';
        };
        
        $obj = new DataObj();
        $resp = null;
        DataUtility::Init_HashTable();
        $data = $obj->ReturnObject($resp,DataUtility::Params(),$proc,ObjectEnum::DataTable);
        header('content-type: application/json; charset=utf-8');
        echo json_encode($data); 
    }

    public function saveUpdateMasterItem($request, $response, $args) {
        $body = $request->getParsedBody();

        $proc = '';

        switch($args['itemref']){
            case 'trainingtitle': {$proc = 'pr_mst_saveUpdateTrainingTitle'; break;}
        }
        
        $obj = new DataObj();
        $resp = null;
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('id', $body['id'], DataType::INT);
        DataUtility::AddParameters('name', $body['name'], DataType::INT);
        DataUtility::AddParameters('is_deleted', $body['is_deleted'], DataType::INT);
        DataUtility::AddParameters('userid', $args['userid'], DataType::INT);
        $data = $obj->ReturnObject($resp, DataUtility::Params(), $proc, ObjectEnum::DataRow);

        header('content-type: application/json; charset=utf-8');
        echo json_encode($data);
    }

} 