<?php

use Slim\Http\UploadedFile;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class TrainingController  {
    protected $adminEmail;
    protected $emailSettings;
    protected $emails;

    public function __construct(){
        $this->emailSettings = Settings::getEmailSettings();
        $this->emails = Settings::getEmails();
        $this->adminEmail = $this->emails['admin'];
    }

    private function prepareSearchQry($qryParams) {
        $search = '';
        switch($qryParams['refined']) {
            case 0:
                $term = $qryParams['search'];
                $search = " AND (startdate like '%$term%' OR enddate like '%$term%' OR trainingtitle like '%$term%' OR venue like '%$term%'
                OR funding_source like '%$term%' OR `status` like '%$term%' OR trainingid = '$term')";
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
                $search = $search != '' ? " AND ($search)" : $search;
                break;
        }
        //exit($search);
        return $search;
    }

    public function getTrainingList($request, $response, $args) {
        $userid = $args['userid'];
        $qryParams = $request->getQueryParams();
        $searchQry = $this->prepareSearchQry($qryParams);

        $resp = null;
        $obj = new DataObj();
        DataUtility::Init_HashTable();
        DataUtility::AddParameters("userid",$userid,DataType::INT);
        DataUtility::AddParameters('search', $searchQry, DataType::STR);
        $data2 = $obj->ReturnObject($resp, DataUtility::Params(),'pr_training_getTrainingListCount', ObjectEnum::DataRow);
    
        $data = [];

        if($resp){
            $obj = new DataObj();
            $resp = null;
            DataUtility::Init_HashTable();
            DataUtility::AddParameters('userid',$userid,DataType::INT);
            DataUtility::AddParameters('search', $searchQry, DataType::STR);
            DataUtility::AddParameters('start', (isset($qryParams['_start']) ? $qryParams['_start'] : 0),DataType::INT);
            DataUtility::AddParameters('limit', (isset($qryParams['_limit']) ? $qryParams['_limit'] : 0),DataType::INT);
            DataUtility::AddParameters('sort', (isset($qryParams['_sort']) ? $qryParams['_sort'] : null),DataType::STR);
            DataUtility::AddParameters('order', (isset($qryParams['_order']) ? $qryParams['_order'] : null),DataType::STR);
            $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_training_getTrainingList',ObjectEnum::DataTable);
        }

        header('content-type: application/json; charset=utf-8');
        return $response
        ->withHeader('X-Total-Count', $data2['total'])
        ->withJson($data);
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

        $user_id = $args['userid'];
        
        $obj = new DataObj();
        $resp = null;
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('id', $body['id'], DataType::INT);
        DataUtility::AddParameters('training_category_option_id', $body['training_category_option_id'], DataType::INT);
        DataUtility::AddParameters('training_sub_category_option_id', $body['training_sub_category_option_id'], DataType::INT);
        DataUtility::AddParameters('training_title_option_id', $body['training_title_option_id'], DataType::INT);
        DataUtility::AddParameters('has_known_participants', $body['has_known_participants'], DataType::INT);
        DataUtility::AddParameters('training_start_date', $body['training_start_date'], DataType::STR);
        DataUtility::AddParameters('training_end_date', $body['training_end_date'], DataType::STR);
        DataUtility::AddParameters('training_length_value', $body['training_length_value'], DataType::INT);
        DataUtility::AddParameters('training_length_interval', $body['training_length_interval'], DataType::STR);
        DataUtility::AddParameters('cpd', $body['cpd'], DataType::INT);
        DataUtility::AddParameters('report_file', $body['report_file'], DataType::INT);
        DataUtility::AddParameters('training_organizer_option_id', $body['training_organizer_option_id'], DataType::INT);
        DataUtility::AddParameters('training_location_id', $body['training_location_id'], DataType::INT);
        DataUtility::AddParameters('other_location_region', $body['other_location_region'], DataType::INT);
        DataUtility::AddParameters('other_location', $body['other_location'], DataType::STR);
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
        DataUtility::AddParameters('userid', $user_id, DataType::INT);
        $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_training_saveUpdateTraining',ObjectEnum::DataRow);

        if($resp) {
            $training_id = $data['id'];
            $participantList = $body['participants'];
            $trainerList = $body['trainers'];
            $idarray = array();
            
            // Save Participants
            foreach($participantList as $participant) {
                if($participant['person_id']){
                    $idarray[] = $participant['person_id'];
                }
                $obj = new DataObj();
                $resp = null;
                DataUtility::Init_HashTable();
                DataUtility::AddParameters('id', $participant['id'], DataType::INT);
                DataUtility::AddParameters('person_id', $participant['person_id'], DataType::INT);
                DataUtility::AddParameters('training_id', $training_id, DataType::INT);
                DataUtility::AddParameters('approved', $participant['approved'], DataType::INT);
                DataUtility::AddParameters('user_id', $user_id, DataType::INT);
                $del = $obj->ReturnObject($resp,DataUtility::Params(),'pr_lnk_savePersonToTraining',ObjectEnum::DataRow);
            }
            // Delete Participants removed from list
            $ids = '';
            
            $obj = new DataObj();
            $resp = null;
            DataUtility::Init_HashTable();
            if(sizeof($idarray)){
                $ids = join(',',$idarray);
                $del = $obj->ReturnObject($resp,DataUtility::Params(),'DELETE FROM ts_lnk_person_to_training WHERE training_id = '.$training_id.' AND NOT FIND_IN_SET(person_id, \''.$ids.'\');',ObjectEnum::ExecuteNonQuery);
            }else{
                $del = $obj->ReturnObject($resp,DataUtility::Params(),'DELETE FROM ts_lnk_person_to_training WHERE training_id = '.$training_id.';',ObjectEnum::ExecuteNonQuery);
            }
            // Save Trainers
            $idarray = array();
            foreach($trainerList as $trainer) {
                if($trainer['trainer_id']){
                    $idarray[] = $trainer['trainer_id'];
                }
                $obj = new DataObj();
                $resp = null;
                DataUtility::Init_HashTable();
                DataUtility::AddParameters('id', $trainer['id'], DataType::INT);
                DataUtility::AddParameters('trainer_id', $trainer['trainer_id'], DataType::INT);
                DataUtility::AddParameters('training_id', $training_id, DataType::INT);
                DataUtility::AddParameters('approved', $trainer['approved'], DataType::INT);
                DataUtility::AddParameters('user_id', $user_id, DataType::INT);
                $del = $obj->ReturnObject($resp,DataUtility::Params(),'pr_lnk_saveTrainingToTrainer',ObjectEnum::DataRow);
            }
            // Delete Participants removed from list
            $ids = '';
            $obj = new DataObj();
            $resp = null;
            DataUtility::Init_HashTable();
            if(sizeof($idarray)){
                $ids = join(',',$idarray);
                $del = $obj->ReturnObject($resp,DataUtility::Params(),'DELETE FROM ts_lnk_training_to_trainer WHERE training_id = '.$training_id.' AND NOT FIND_IN_SET(trainer_id, \''.$ids.'\');',ObjectEnum::ExecuteNonQuery);
            }else{
                $del = $obj->ReturnObject($resp,DataUtility::Params(),'DELETE FROM ts_lnk_training_to_trainer WHERE training_id = '.$training_id.';',ObjectEnum::ExecuteNonQuery);
            }
        }

        header('content-type: application/json; charset=utf-8');
        echo json_encode($data);
    }

    public function getTraining($request, $response, $args) {
        $obj = new DataObj();
        $resp = null;
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('id', $args['id'], DataType::INT);
        $participants = $obj->ReturnObject($resp,DataUtility::Params(),'pr_training_getTrainingParticipants',ObjectEnum::DataTable);
        $trainers = $obj->ReturnObject($resp,DataUtility::Params(),'pr_training_getTrainingTrainers',ObjectEnum::DataTable);        
        $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_training_getTraining',ObjectEnum::DataRow);
        
        $data['participants'] = $participants;
        $data['trainers']=$trainers;
        
        header('content-type: application/json; charset=utf-8');
        echo json_encode($data);
    }

    public function getPerson($request, $response, $args) {
        $resp = null;
        $obj = new DataObj();
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('search',$args['search'],DataType::STR);
        DataUtility::AddParameters('ids', $args['ids'], DataType::STR);
        $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_training_getPerson',ObjectEnum::DataTable);
        
        header('content-type: application/json; charset=utf-8');
        echo json_encode($data);
    }

    public function getTrainingParticipantsTests($request, $response, $args) {
        $resp = null;
        $obj = new DataObj();
        DataUtility::Init_HashTable();
        DataUtility::AddParameters("userid",$args['id'],DataType::INT);
        $data2 = $obj->ReturnObject($resp, DataUtility::Params(),'pr_cert_getTrainingById', ObjectEnum::DataRow);
        $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_training_getTrainingParticipantsTests',ObjectEnum::DataTable);
        $jsonData = array('training' => $data2, 'participants' => $data);

        header('content-type: application/json; charset=utf-8');
        echo json_encode($jsonData); 
    }

    public function saveUpdateParticipantsTests($request, $response, $args) {
        $body = $request->getParsedBody();
        $participantList = $body['participants'];
        $user_id = $args['userid'];
        
        foreach($participantList as $participant) {
            $obj = new DataObj();
            $resp = null;
            $data = null;
            DataUtility::Init_HashTable();
            DataUtility::AddParameters('training_id', $body['training_id'], DataType::INT);
            DataUtility::AddParameters('person_id', $participant['person_id'], DataType::INT);
            DataUtility::AddParameters('pre_test', $participant['pre_test'], DataType::INT);
            DataUtility::AddParameters('post_test', $participant['post_test'], DataType::INT);
            DataUtility::AddParameters('user_id', $user_id, DataType::INT);
            $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_training_saveUpdateParticipantTest',ObjectEnum::ExecuteNonQuery);
        }

        header('content-type: application/json; charset=utf-8');
        echo json_encode($resp);
    }

    private function getHtmlMessageArray($currentstate, $trainingid, $userid){
        #Here the states for sending email is either on Approval - 1, Completion - 2, Review - 3, Certification - 4
        $obj = new DataObj();
        $resp = null;

        DataUtility::Init_HashTable();
        DataUtility::AddParameters('training_id', $trainingid, DataType::INT);
        $training = $obj->ReturnObject($resp,DataUtility::Params(),'pr_cert_getTrainingById',ObjectEnum::DataRow);

	    DataUtility::Init_HashTable();
        $createdby = $obj->ReturnObject($resp,DataUtility::Params(),'SELECT email FROM ts_user WHERE id = '.$training['created_by'],ObjectEnum::DataRow);

        $createdbyemail = $createdby['email'];

        DataUtility::Init_HashTable();
        DataUtility::AddParameters('id', $userid, DataType::INT);
        $sysuser = $obj->ReturnObject($resp,DataUtility::Params(),'pr_user_getUser',ObjectEnum::DataRow);

        $username = $sysuser['first_name'].' '.$sysuser['last_name'];
        $useremail = $sysuser['email'];
        $role = $sysuser['role_name'];

        $title = $training['training_title_phrase'];
        $organizer = $training['training_organizer_phrase'];
        $startDate = $training['training_start_date'];
        $length = $training['training_length_value'];
        $duration = $length.' '.$training['training_length_interval'];
        $duration = $length > 1 ? $duration.'s' : $duration ;
        $venue = $training['training_venue'];

        $message = "<html><head>";
        $message.= "<style>";
        $message.= "
        .tab { 
            display:inline-block; 
            margin-left: 40px; 
        }
        .left-align {
            text-align: left;
        }
        ";
        $message.="</style>";
        $message.= "</head><body>";
        $message.= '<div class="left-align"><img src="http://trainsmart.nascop.org/assets/images/trainsmart_logo.jpg" alt="TrainSMART" /></div>';
	    $addmessage = '';
        switch($currentstate){
            case 1:
                $message.= "Dear Trainer,<br><br>";
                $message.= "We are kindly requesting your presence for a new training that has been approved and is to proceed.";
                break;
	    case 2:
                $message.= "Dear Admin,<br><br>";
                $message.= "A new training has been completed and is ready for certificate approval and signing.";
                $link = "http://trainsmart.nascop.org/certificates?certify=true&id=$trainingid";
                $addmessage = "<tr><td><strong>URL To Approve Certificates:</strong></td><td>" . strip_tags($link) . "</td></tr>";
                break;
	    case 3:
                $message.= "Dear Coordinator,<br><br>";
                $message.= "Please review the following training and submit it for completion once done.";
                $link = "http://trainsmart.nascop.org/trainings?review=true&id=$trainingid";
                $addmessage = "<tr><td><strong>URL To Review Training:</strong></td><td>" . strip_tags($link) . "</td></tr>";
		break;
            case 4:
                $message.= "Dear Admin,<br><br>";
                $message.= "A training's certificate approval process has been completed and is ready for signing.";
                $link = "http://trainsmart.nascop.org/certificates?sign=true&id=$trainingid";
                $addmessage = "<tr><td><strong>URL To Sign Certificates:</strong></td><td>" . strip_tags($link) . "</td></tr>";
                break;
            default:
                $message.="";
        }
	    $message.= "<br><br>Details are as below:<br><br>";
        $message.= "<div class='tab'>";
        $message.= '<table rules="all" style="border-color: #666;" cellpadding="10">';
        $message.= "<tr style='background: #eee;'><td><strong>Title:</strong></td><td>$title</td></tr>";
        $message.= "<tr><td><strong>Funding Source:</strong></td><td>$organizer</td></tr>";
        $message.= "<tr><td><strong>Start Date:</strong></td><td>$startDate</td></tr>";
        $message.= "<tr><td><strong>Duration:</strong></td><td>$duration</td></tr>";
        $message.= "<tr><td><strong>Venue:</strong></td><td>$venue</td></tr>";
	    $message.= $addmessage;
        $message.= "</table></div>";
        $message.= "<br><br>Kind Regards,<br><br>$username<br>$role<br>$useremail";
        $message.= "</body></html>";

        return array('message' => $message, 'title' => $title, 'createdbyemail' => $createdbyemail);
    }

    public function approveTraining($request, $response, $args) {
        $body = $request->getParsedBody();
        $obj = new DataObj();
        $resp = null;
        $data = null;
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('training_id', $body['training_id'], DataType::INT);
        DataUtility::AddParameters('is_approved', $body['is_approved'], DataType::INT);
        DataUtility::AddParameters('comment', $body['comment'], DataType::STR);
        DataUtility::AddParameters('user_id', $args['userid'], DataType::INT);
        $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_training_approveTraining',ObjectEnum::ExecuteNonQuery);

        if($body['is_approved'] == 1 && $resp){
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
        }

        header('content-type: application/json; charset=utf-8');
        echo json_encode($resp);
    }

    public function reviewTraining($request, $response, $args) { // Uncomplete training - admin only
        $obj = new DataObj();
        $resp = null;
        $data = null;
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('training_id', $args['id'], DataType::INT);
        DataUtility::AddParameters('user_id', $args['userid'], DataType::INT);
        $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_training_reviewTraining',ObjectEnum::ExecuteNonQuery);

	    if($resp){
            /*Send Email*/
            $arr = $this->getHtmlMessageArray(3, $args['id'], $args['userid']);//Review Training Msg
            $this->sendEmail($arr['createdbyemail'], "Training", "Review Training - ".$arr['title'], $arr['message']);
            /*End Send Email*/
        }

        header('content-type: application/json; charset=utf-8');
        echo json_encode($resp);
    }

    public function approveCertificate($request, $response, $args) {
        $body = $request->getParsedBody();
        $list = $body['list'];

        foreach($list as $record) {
            $obj = new DataObj();
            $resp = null;
            DataUtility::Init_HashTable();
            DataUtility::AddParameters('training_id', $args['id'], DataType::INT);
            DataUtility::AddParameters('certtype_id', $record['certtypeid'], DataType::INT);
            DataUtility::AddParameters('certapproved', $record['certapproved'], DataType::INT);
            DataUtility::AddParameters('person_id', $record['id'], DataType::INT);
            DataUtility::AddParameters('user_id', $args['userid'], DataType::INT);
            $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_training_approveCertificate',ObjectEnum::ExecuteNonQuery);
        }

        if($resp){
            /*Send Email*/
            $arr = $this->getHtmlMessageArray(4, $args['id'], $args['userid']);//Approve Certificates Msg
            $this->sendEmail($this->adminEmail, "Certificates", "Certificates Approved for Signing - ".$arr['title'], $arr['message']);
            /*End Send Email*/
        }

        header('content-type: application/json; charset=utf-8');
        echo json_encode($resp);
    }

    public function getFileUploadData($request, $response, $args) {
        $resp = null;
        $obj = new DataObj();
        DataUtility::Init_HashTable();
        DataUtility::AddParameters("training_id",$args['id'],DataType::INT);
        $data = $obj->ReturnObject($resp, DataUtility::Params(),'pr_training_getFileUploadData', ObjectEnum::DataRow);

        header('content-type: application/json; charset=utf-8');
        echo json_encode($data);
    }

    public function uploadFile($request, $response, $args) {
        $payload = $request->getParsedBody();
        $file_path = "/home/tsmart/public_html/uploads/".$payload['file'];

        $file_data = $this->decode_chumk($payload['file_data']);

        if(false === $file_data) {
            $resp = array('success' => false, 'message' => 'Error with chunk data', 
            'chunk_count' => $payload['chunk_count'].' '.$payload['chunk_total']);
            header('content-type: application/json; charset=utf-8');
            echo json_encode($resp);
        }

        file_put_contents($file_path, $file_data, FILE_APPEND);

        $resp = array('success' => true, 'message' => 'Chunk successfully appended',
        'chunk_count' => $payload['chunk_count'].' '.$payload['chunk_total']);

        if($payload['chunk_count'] === $payload['chunk_total']) {
            // Save the file name to the database and mark training as completed
            $obj = new DataObj();
            $resp = null;
            DataUtility::Init_HashTable();
            DataUtility::AddParameters('parent_id', $payload['parent_id'], DataType::INT);
            DataUtility::AddParameters('parent_table', $payload['parent_table'], DataType::STR);
            DataUtility::AddParameters('file_name', $payload['file'], DataType::STR);
            DataUtility::AddParameters('filemime', $payload['file_type'], DataType::STR);
            DataUtility::AddParameters('file_size', $payload['file_size'], DataType::INT);
            DataUtility::AddParameters('objectives', $payload['objectives'], DataType::STR);
            DataUtility::AddParameters('conduct', $payload['conduct'], DataType::STR);
            DataUtility::AddParameters('recommendations', $payload['recommendations'], DataType::STR);
            DataUtility::AddParameters('user_id', $args['userid'], DataType::INT);
            $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_training_saveUpdateFileUpload',ObjectEnum::DataRow);
            if($resp){
		        /*Send Email*/
                $arr = $this->getHtmlMessageArray(2, $payload['parent_id'], $args['userid']);//Completion Msg
                $reportpath = "/home/tsmart/public_html/uploads/".$payload['file'];
                $reportname = "Uploaded Report";
                $this->sendEmail($this->adminEmail, "Trainer", "New Training Completed - ".$arr['title'], $arr['message'], $reportpath, $reportname);
                /*End Send Email*/

                $resp = array(
                    'success' => true, 
                    'message' => 'Chunk successfully appended',
                    'chunk_count' => $payload['chunk_count'].' '.$payload['chunk_total'],
                    'saved' => $resp, 
                    'userid' => $args['userid']
                );
            }
        }

        header('content-type: application/json; charset=utf-8');
        echo json_encode($resp);
    }

    private function decode_chumk($data) {
        $data = explode(';base64,', $data);

        if(!is_array($data) || !isset($data[1])) {
            return false;
        }

        $data = base64_decode($data[1]);
        if(!$data){
            return false;
        }

        return $data;
    }

    public function getCompletedTrainingList($request, $response, $args) {
        $userid = $args['userid'];
        $qryParams = $request->getQueryParams();
        $searchQry = $this->prepareSearchQry($qryParams);

        $resp = null;
        $obj = new DataObj();
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('user_id', $userid, DataType::INT);
        DataUtility::AddParameters('search', $searchQry, DataType::STR);
        $data2 = $obj->ReturnObject($resp, DataUtility::Params(),'pr_training_getCompletedTrainingListCount', ObjectEnum::DataRow);
    
        $data = [];

        if($resp){
            $obj = new DataObj();
            $resp = null;
            DataUtility::Init_HashTable();
            DataUtility::AddParameters('user_id', $userid, DataType::INT);
            DataUtility::AddParameters('search', $searchQry, DataType::STR);
            DataUtility::AddParameters('start', (isset($qryParams['_start']) ? $qryParams['_start'] : 0),DataType::INT);
            DataUtility::AddParameters('limit', (isset($qryParams['_limit']) ? $qryParams['_limit'] : 0),DataType::INT);
            DataUtility::AddParameters('sort', (isset($qryParams['_sort']) ? $qryParams['_sort'] : null),DataType::STR);
            DataUtility::AddParameters('order', (isset($qryParams['_order']) ? $qryParams['_order'] : null),DataType::STR);
            $data = $obj->ReturnObject($resp,DataUtility::Params(),'pr_training_getCompletedTrainingList',ObjectEnum::DataTable);
        }

        header('content-type: application/json; charset=utf-8');
        return $response
        ->withHeader('X-Total-Count', $data2['total'])
        ->withJson($data);
    }

    public function getCertApprovalList($request, $response, $args) {
        $resp = null;
        $obj = new DataObj();
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('training_id', $args['id'], DataType::STR);
        $data = $obj->ReturnObject($resp, DataUtility::Params(),'pr_training_getCertApprovalList', ObjectEnum::DataTable);

        header('content-type: application/json; charset=utf-8');
        echo json_encode($data);
    }

    private function sendEmail($email, $name, $subject, $message, $filepath = false, $filename = false) {
        $mail = new PHPMailer(true);                              
        try {
            //Server settings
            $mail->SMTPDebug = 0;                                 
            $mail->isSMTP();                                      
            $mail->Host = $this->emailSettings['host']; //'mail.nascop.or.ke';  
            $mail->SMTPAuth = $this->emailSettings['smtpauth']; //true;                               
            $mail->Username = $this->emailSettings['username']; //'certificates';                 
            $mail->Password = $this->emailSettings['password']; //'tr@1nsm@rt';                          
            $mail->SMTPSecure = $this->emailSettings['smtpsecure']; //'ssl';                            
            $mail->Port = $this->emailSettings['port']; //465;                                    

            //Recipients
            $e = $this->emails['training'];
            $setfrom = $e['setfrom'];
            $repyto = $e['replyto'];

            $mail->setFrom($setfrom['email'],$setfrom['name']);
            $mail->addReplyTo($repyto['email'],$repyto['name']);
            
	        if($e['ccc']!=''){
                $mail->addCC($e['ccc']);
            }

            if($e['bcc']!=''){
                $mail->addBCC($e['bcc']);
            }

            if(is_array($email)) {
                foreach($email as $address){
                    $mail->addAddress($address);                                                   
                }
            } else {
                $mail->addAddress($email);                               
            }
               
            //Content
            $mail->isHTML(true);                                  
            $mail->Subject = $subject;
            $mail->Body    = $message;
            $mail->AltBody = strip_tags($message);

            if(file_exists($filepath)){
                $mail->addAttachment($filepath, $filename);
            }

            $mail->send();
            
        } catch (Exception $e) {
            // echo 'Email could not be sent. Mailer Error: ', $mail->ErrorInfo;
        }
    }

}
?>
