
<?php

$app->get('/emailtest','\CertController:sendEmail');

$app->post('/authenticate', '\AuthController:authenticate');

$app->post('/upload/{userid}', '\TrainingController:uploadFile');
$app->get('/filedata/{id}','\TrainingController:getFileUploadData');

$app->get('/cert/{trainingid}/{preview}/{previewid}', '\CertController:printTrainingCertificates');

$app->group('/user', function() {
    $this->get('/list', '\UserController:getUserList');
    $this->get('/item/{id}', '\UserController:getUser');
    $this->post('/add/{userid}', '\UserController:addUser');
    $this->map(['PUT', 'OPTIONS'], '/block/{userid}', '\UserController:blockUser');
});

$app->group('/master', function(){
    $this->get('/{listref}', '\MasterController:getMasterList');
    $this->post('/add/{itemref}/{userid}', '\MasterController:saveUpdateMasterItem');
});


$app->group('/training', function () {
    $this->get('/list/{userid}', '\TrainingController:getTrainingList');
    $this->map(['PUT', 'OPTIONS'], '/del/{userid}', '\TrainingController:deleteTraining');
    $this->post('/add/{userid}', '\TrainingController:addTraining');
    $this->get('/person/{search}/{ids}', '\TrainingController:getPerson');
    $this->get('/item/{id}', '\TrainingController:getTraining');
    $this->get('/print/{id}', '\CertController:printTrainingInfo');
    $this->get('/tests/{id}', '\TrainingController:getTrainingParticipantsTests');
    $this->post('/savetests/{userid}', '\TrainingController:saveUpdateParticipantsTests');
    $this->map(['PUT', 'OPTIONS'], '/approve/{userid}', '\TrainingController:approveTraining');
    $this->get('/completed/{userid}','\TrainingController:getCompletedTrainingList');
    $this->get('/certapproval/{id}', '\TrainingController:getCertApprovalList');
    $this->map(['PUT', 'OPTIONS'], '/review/{userid}/{id}', '\TrainingController:reviewTraining');
    $this->map(['PUT', 'OPTIONS'], '/certapprove/{userid}/{id}', '\TrainingController:approveCertificate');
});

$app->group('/person', function() {
    $this->get('/testlist', '\PersonController:getPersonTestList');
    $this->get('/list/{pagenumber}/{pagesize}', '\PersonController:getPersonList');
    $this->get('/mfl/{search}', '\PersonController:getMflByName');
    $this->map(['PUT', 'OPTIONS'], '/del/{userid}', '\PersonController:deletePerson');
    $this->post('/add/{userid}', '\PersonController:addPerson');
    $this->get('/item/{id}', '\PersonController:getPerson');
    $this->get('/exists/{national_id}', '\PersonController:checkPersonExists');
    $this->get('/trainings/{id}', '\PersonController:getPersonTrainings');
});

$app->group('/reports', function() {
    $this->get('/activity/{id}', '\ReportController:getTrainingActivityReport');
    $this->get('/trainings', '\ReportController:getTrainings');
});

// Pay attention to this when you are using some javascript front-end framework and you are using groups in slim php
/* $app->group('/users/{id:[0-9]+}', function () {
    $this->map(['GET', 'DELETE', 'PATCH', 'PUT'], '', function ($request, $response, $args) {
        // Find, delete, patch or replace user identified by $args['id']
    })->setName('user');
    $this->get('/reset-password', function ($request, $response, $args) {
        // Route for /users/{id:[0-9]+}/reset-password
        // Reset the password for user identified by $args['id']
    })->setName('user-password-reset');
    // Due to the behaviour of browsers when sending PUT or DELETE request, you must add the OPTIONS method. Read about preflight.
    $this->map(['PUT', 'OPTIONS'], '/{user_id:[0-9]+}', function ($request, $response, $arguments) {
        // Your code here...
    });
}); */
