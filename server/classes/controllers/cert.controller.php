<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class CertController {
    protected $emailSettings;
    protected $emails;

    public function __construct(){
        $this->emailSettings = Settings::getEmailSettings();
        $this->emails = Settings::getEmails();
    }

    private function getBasePath() {
        /* WILL CHANGE IF YOU MOVE THIS INTO A DIFFERENT DIRECTORY */
        $path = str_replace("\src\controllers","",__DIR__);
        $path = str_replace("/", "\\", $path);
        return $path;
    }

    public function printTrainingInfo($request, $response, $args) {
        
        $basePath = $this->getBasePath();
        $directoryName = $basePath."\\certs\\test\\training.pdf";

        $obj = new DataObj();        
        $resp = null;
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('id', $args['id'], DataType::INT);
        $general = $obj->ReturnObject($resp, DataUtility::Params(), 'pr_printTrainingInfoGeneral', ObjectEnum::DataRow);
        
        if($resp) {
            $resp = null;
            $result = $obj->ReturnObject($resp, DataUtility::Params(), 'pr_printTrainingInfo', ObjectEnum::DataTable);
            
            $font = 'Helvetica';
            $pdf = new PDF('P');
            $pdf->AddPage();

            /* GENERAL */
            $pdf->SetFillColor(192);
            $pdf->Rect(5,5,200,10,'DF');
            $pdf->SetFont('Arial','B',12);
            $pdf->Cell(0,0,'TRAINING INFORMATION',0,0,'C');
            $pdf->Ln(10);

            $pdf->SetFont('Arial','',10);
            $pdf->Cell(0,0,'Organizer: '.$general['training_organizer_phrase'],0,0,'L');
            $pdf->Ln(8);
            $pdf->Cell(0,0,'Training Title: '.$general['training_title_phrase'],0,0,'L');
            $pdf->Ln(8);
            $pdf->Cell(0,0,'Level: '.$general['training_level_phrase'],0,0,'L');
            $pdf->Ln(8);
            $pdf->Cell(0,0,'Location: '.$general['location_name'],0,0,'L');
            $pdf->Ln(8);
            $pdf->Cell(0,0,'CPD Points: '.$general['cpd'],0,0,'L');
            $pdf->Ln(8);
            $pdf->Cell(0,0,'Start Date: '.$general['training_start_date'].' End Date: '.$general['training_end_date'],0,0,'L');
            $pdf->Ln(10);

            $pdf->SetDash();

            /* PARTICIPANTS */
            $pdf->SetFont('Arial','BU',8);
            $pdf->Cell(0,0,'PARTICIPANTS',0,0,'C');
            $pdf->Ln(10);
            $heading = array('NAME','GENDER','NATIONAL ID','CERT APPROVED');

            // TABLE HEADERS
            $pdf->SetFont('Arial','B',8);
            foreach($heading as $column_heading){
                $w = $column_heading === 'NAME' ? 90 : 30;
                $pdf->Cell($w,10,$column_heading,1,0,'C');
            }
            $pdf->Ln(10);
            // TABLE BODY
            $pdf->SetFont('Arial','',8);
            $keystocenter = array('gendername','certapproved');
            foreach($result as $row) {
                foreach($row as $key => $value) {
                    $w = $key === 'name' ? 90 : 30;
                    if(in_array($key,$keystocenter)){
                    $pdf->Cell($w,10,$value,1,0,'C');
                    }else{
                    $pdf->Cell($w,10,$value,1,0,'L');
                    }
                }
                $pdf->Ln(10);
            } 
            $pdf->Output('I',$directoryName);
        }
        echo NULL;
    }

    public function printTrainingCertificates($request, $response, $args) {      
        
        $preview = $args['preview'] == 1 ? true : false;
        $trainingid = $args['trainingid'];

        $previewid = isset($args['previewid']) ? $args['previewid'] : 0;

        $obj = new DataObj();      
        $resp = null;
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('trainingid', $trainingid, DataType::INT);
        $training = $obj->ReturnObject($resp, DataUtility::Params(), 'pr_cert_getTrainingById', ObjectEnum::DataRow);

	    $userid = $training['created_by'];
        $cpd = $training['cpd'];
        $cpd = $cpd ? $cpd : 'N/A';
		$mainTitle = strtoupper($training['training_sub_category_phrase']);
        $title = $training['training_title_phrase'];
        $endDate = $training['training_end_date'];
        $venue = $training['training_venue'].', '.$training['county'].' County';

        if($training['training_length_interval'] == "week") {
			$length = $training['training_length_value'].' Week';
		} elseif($training['training_length_interval'] == "day") {
			$length = $training['training_length_value'].' Day';
		} elseif($training['training_length_interval'] == "hour") {
			$length = $training['training_length_value'].' Hour';
		}
		
		$certification = $length;
		$title  = str_ireplace("Cluster", "", $training['training_title_phrase']);
        $certification .= " " . $title . " Course in";
        $certification = strtoupper($certification);

        $resp = null;
        $checkcertapproved = $preview ? 0 : 1;
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('trainingid', $trainingid, DataType::INT);
        DataUtility::AddParameters('checkcertapproved', $checkcertapproved, DataType::INT);
        $participantList = $obj->ReturnObject($resp, DataUtility::Params(), 'pr_cert_getApprovedParticipants', ObjectEnum::DataTable);
        $trainerList = $obj->ReturnObject($resp, DataUtility::Params(), 'pr_cert_getApprovedTrainers', ObjectEnum::DataTable);
        
        // Merge the two list
        $mergedList = array_merge($participantList, $trainerList);
	
	    $files = array();
        
        foreach($mergedList as $participant) {
            $middlename = $participant['middle_name'] ? substr($participant['middle_name'], 0, 1).'. ' : '';
            $participantName = ucwords(strtolower($participant['first_name'].' '.$middlename.$participant['last_name']));          
	        $participantEmail =  $participant['email'];
            $trainingid = $participant['training_id'];
            $participantid = $participant['person_id'];
            
            $mentor = $participant['is_mentor'] ? true : false;

            if($preview && $previewid != 0 && $participantid != $previewid) continue;

            $this->createPDF($participantName, $certification, $endDate, $trainingid, $participantid, $venue, $cpd, $mentor, $mainTitle, $preview);

            if($preview) break;

	        $files[] = array('name' => $participantName, 'email' => $participantEmail, 'mentor' => ($mentor ? 'Y' : 'N'));
        }

        if(!$preview){
	        DataUtility::Init_HashTable();
            DataUtility::AddParameters('id', $userid, DataType::INT);
            $sysuser = $obj->ReturnObject($resp,DataUtility::Params(),'pr_user_getUser',ObjectEnum::DataRow);
            $useremail = $sysuser['email'];

            $subject = "Training Certification $certification $mainTitle";
            $zippedfile = $this->zipfiles($files, $endDate, $trainingid);
            $this->emailZipped($useremail, $subject, $zippedfile, $files);
        }

    }

    private function createPDF($participant, $certifiaction, $endDate, $trainingid, $participantid, $venue, $cpdPoints, $mentor, $courseNameMain, $preview = false) {

        $basePath = $this->getBasePath();
        $font = 'Helvetica';

        /* Landscape */
        $pdf=new PDF('landscape');
        $pdf->AddPage();

        /* Create backdrop */
        $pdf->SetTextColor(226,226,226);
        $pdf->SetFont($font,'',40);
        for ($i = 1; $i<=5; $i++) {
            for ($j = 0; $j<=15; $j++) {
                $x = 1 + ( ( $i-1 ) * 60);
                $y = $j*15;
                $pdf->RotatedText($x, $y,'NASCOP',0);
            }
        }
        /* LOGO */
        $logo = __DIR__."/../images/gok_logo.png";
        $pdf->Image($logo,130,6,30);
        $pdf->SetTextColor(0,0,0); // Black Color
        
        /* SERIAL NO */
        if($mentor == true) {
            $serialNo = sprintf("%04d%05dTR", $trainingid, $participantid);
        } else {
            $serialNo = sprintf("%04d%05d", $trainingid, $participantid);
        }
        $y_serialno = 10;
        $pdf->SetFont($font,'B', 18);
        $pdf->SetXY(220,$y_serialno);
        $pdf->Cell(0,0,'Serial No:',0,0,'');
        $pdf->SetFont('COURIER','B', 18);
        $pdf->SetXY(250,$y_serialno);
        $pdf->Cell(0,0,$serialNo,0,0,'');
        
        $pdf->SetFont($font,'B',24);
        $pdf->SetY(40);
        $pdf->Cell(0,0,'MINISTRY OF HEALTH',0,0,'C');
        $pdf->SetFont($font,'B',20);
        $pdf->SetY(50);
        $pdf->Cell(0,0,'NATIONAL AIDS AND STI CONTROL PROGRAM (NASCOP)',0,0,'C');
        $pdf->SetFont($font,'', 16);
        $pdf->SetY(60);
        $pdf->Cell(0,0,'This Certificate is Awarded to',0,0,'C');
        
        $pdf->AddFont('Edwardian','','edwardian.php');
        $pdf->SetFont('Edwardian','', 40); // Edwardian Script ITC
        $pdf->SetY(70);
        $pdf->Cell(0,0,$participant,0,0,'C');
        
        $pdf->SetFont($font,'', 16);
        $pdf->SetY(85);
        if($mentor == true) {
            $pdf->Cell(0,0,'As a mentor of a',0,0,'C');
        } else {
            $pdf->Cell(0,0,'Having successfully completed a',0,0,'C');
        }
        
        $pdf->SetFont('Times','B', 20);
        $pdf->SetY(95);
        $pdf->Cell(0,0,$certifiaction,0,0,'C');
        
        $pdf->SetY(105);
        $pdf->Cell(0,0,$courseNameMain,0,0,'C');
        
        $pdf->SetFont($font, '', 16);
        $pdf->SetY(115);
        $pdf->Cell(0,0,"Ended on: $endDate",0,0,'C');
    
        $pdf->SetY(125);
        $pdf->Cell(0,0,"Venue: $venue",0,0,'C');
        
        if (!$mentor) {
            $pdf->SetY(135);
            $pdf->Cell(0,0,"CPD Points Earned: $cpdPoints",0,0,'C');
        }
        
        /* SIGNATURE */
        $img = __DIR__. "/../images/director_signature.png";
        $pdf->Image($img,120,135,0);
        $pdf->Line(115,175,185,175);
        
        $pdf->SetFont('Times','', 21);
        $pdf->SetY(180);
        $pdf->Cell(0,0,"Dr. Kigen B. Bartilol",0,0,'C'); // Dr. Martin Sirengo W
        $pdf->SetY(187);
        $pdf->Cell(0,0,"Head NASCOP",0,0,'C');

        if($preview){
            /* Place watermark if it is a preview */
            $pdf->SetFont('Arial','B',50);
            $pdf->SetTextColor(139,0,0);//(255,192,203);(255,159,159)
            $str = 'P r e v i e w';
            $x = (($pdf->getPageWidth() - $pdf->getStringWidth($str)) / 4)*3 - (($pdf->getPageWidth() - $pdf->getStringWidth($str)) / 4)/2;
            $y = ($pdf->getPageHeight() / 4)*3 - ($pdf->getPageHeight() / 4)/2;
            $pdf->RotatedText($x,$y,$str,45); 
        }
        
        /* Create file name */
        date_default_timezone_set('africa/nairobi');
        $filename = $participant . "_".$endDate.".pdf";

        //The name of the directory that we need to create.
        $directoryName = "/home/tsmart/public_html/certs";// __DIR__ . "/../../api/certs";
        $certFilePath = $directoryName . "/$filename";

        //Check if the directory already exists.
        if(!is_dir($directoryName)){
            //Directory does not exist, so lets create it.
            mkdir($directoryName, 0777, true);
        }


        if($preview == true) {
            // Preview File
	        $pdf->Output('I', 'downdloaded.pdf');
        }else {
            // Print file to disk
            $pdf->Output('F', $certFilePath);
        }

    }

    public function sendEmail($request, $response, $args) {
	
    }

    private function zipfiles($files, $endDate, $trainingid) {

        $dir = "/home/tsmart/public_html/certs"; // __DIR__."/../../api/certs";

        try{
            if(sizeof($files) == 0) return null;

            $zipname = $dir."/certificates_$trainingid.zip";
            $zip = new ZipArchive;
            $zip->open($zipname, ZipArchive::CREATE);
            foreach($files as $file){

                $filepath = $dir."/".$file['name']."_".$endDate.".pdf";

                if(file_exists($filepath)){
                    $zip->addFile($filepath, $file['name']);
                }
            }
            $zip->close();
	        chmod($zipname, 0755); 
            return $zipname;
         }catch (Exception $e){
            return null;
        }
    }

    private function emailZipped($email, $subject, $zippedfile, $files) {
        $mail = new PHPMailer(true);                              // Passing `true` enables exceptions
        try {
            //Server settings
            $mail->SMTPDebug = 0;                                 
            $mail->isSMTP();                                      
            $mail->Host = $this->emailSettings['host']; //'mail.nascop.or.ke';  
            $mail->SMTPAuth = $this->emailSettings['smtpauth']; //true;                               
            $mail->Username = $this->emailSettings['username']; //'certificates';                 
            $mail->Password = $this->emailSettings['password']; //'tr@1nsm@rt';                          
            $mail->SMTPSecure = $this->emailSettings['smtpsecure']; //'ssl' or tls;                            
            $mail->Port = $this->emailSettings['port']; //465 or 25;   

            //Recipients
            $e = $this->emails['certificates'];
            $setfrom = $e['setfrom'];
            $repyto = $e['replyto'];

            $mail->setFrom($setfrom['email'],$setfrom['name']);
            $mail->addReplyTo($repyto['email'],$repyto['name']);
            $mail->addAddress($email); 
            
	        if($e['ccc']!=''){
                $mail->addCC($e['ccc']);
            }

            if($e['bcc']!=''){
                $mail->addBCC($e['bcc']);
            }

            $specs = '<ul><li>Material: 40 lb Bright White Paper</li>';
            $specs .= '<li>Weight: 1.19 lbs</li>';
            $specs .= '<li>Dimensions:  8.5" x 11" (A4)</li></ul>';

            $message = '<html><body>';
	        $message.= "<div style='align:left;'><img src='http://trainsmart.nascop.org/assets/images/trainsmart_logo.jpg' alt='TrainSMART' /></div>";
            $message.= "Dear Coordinator,<br><br>";
            $message.= "Please find attached a zipped document with certificates to the list of attendants far below. ";
            $message.= "Kindly verify the emails listed and send the certificates to the relevant persons.<br><br>Kind Regards,<br><br>Admin<br><br>";
            $message.= '<table width="100%">';
            $message.= '<tr style="background: #eee;"><td><h3>Participant Template</h3></td></tr>';
            $message.= '<tr><td>Congratulations on successful completion of the Training.<br />
                        Attached please find your certificate of completion.<br />
                        Well done!<br /><br />
                        Print the certificate on a paper with the following specifications:';
            $message.= $specs.'</td></tr>';
            $message.= '<tr style="background: #eee;"><td><h3>Trainer Template</h3></td></tr>';
            $message.= '<tr><td>Congratulations on successful completion of the Training as a trainer.<br />
                        Attached please find your certificate.<br />
                        Well done!<br /><br />
                        Print the certificate on a paper with the following specifications:';
            $message.= $specs.'</td></tr>';
            $message.= '<tr style="background: #eee;"><td><h1>List of Attendants With Approved Certificates</h1></td></tr>';
            $message.= '</table>';
            $message.= '<table rules="all" style="border-color: #666;" cellpadding="10">';
            $message.= "<tr style='background: #eee;'><td><strong>Name</strong> </td><td><strong>Listed Email</strong> </td><td><strong>Trainer</strong></td></tr>";
            foreach($files as $file)
                $message.= "<tr><td>".$file['name']."</td><td>".$file['email']."</td><td>".$file['mentor']."</td></tr>";
            $message.= "</table>";
            $message.= "</body></html>";
	        $htmlBody = $message;

            //Content
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $htmlBody;
            $mail->AltBody = strip_tags($htmlBody);

            if(file_exists($zippedfile)){
                $mail->addAttachment($zippedfile, 'Certificates');
            }

            $mail->send();
            // echo 'Email has been sent';
        } catch (Exception $e) {
            echo 'Email could not be sent. Mailer Error: ', $mail->ErrorInfo;
        }
    }

}
