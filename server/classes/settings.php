<?php

class Settings {
    protected static $config;

    public static function getSettings() {
        return [
            'settings' => [
                'displayErrorDetails' => true, // set to true in production
                'addContentLengthHeader' => false,
                "determineRouteBeforeAppMiddleware" => true, // required for the cors middleware to work
                  'db' =>[
                        'host'=> 'localhost',
                        'user'=> 'root',
                        'password'=> 'mysql',
                        'dbname'=> 'trainsmart',
                    ]  
                
            ],
        ];
    }

    public static function getEmailSettings() {
        return [
            'host' => 'mail.nascop.or.ke',
            'smtpauth' => true,
            'username' => 'certificates', //Actually the email sending username. In this case certificates for certificates@nascop.or.ke
            'password' => 'tr@1nsm@rt', //Email password
            'smtpsecure' => 'ssl', // ssl or tls
            'port' => 465 //ssl uses port 465 while tls uses 587 this can however be changed
        ];
    }

    public static function getEmails() {
        /** Mandatory fields
         * @admin
         * @setfrom
         * @replyto
        */
        return [
            'admin' => 'luchacha.s@gmail.com', 
            'training' => [
                'setfrom' => ['email' => 'training@nascop.or.ke', 'name' => 'NASCOP  TrainSMART Admin'],
                'replyto' => ['email'=> 'training@nascop.or.ke', 'name' => 'NASCOP TrainSMART Admin'],
                'ccc' => '', //'certificates@nascop.or.ke', 
                'bcc' => '', //'nascoptraining@gmail.com',
            ],
            'certificates' => [
                'setfrom' => ['email' => 'certificates@nascop.or.ke', 'name' => 'NASCOP Certificates'],
                'replyto' => ['email'=> 'training@nascop.or.ke', 'name' => 'NASCOP TrainSMART Admin'],
                'ccc' => '', //'certificates@nascop.or.ke',
                'bcc' => '', //'nascoptraining@gmail.com'
            ],
        ];
    }

}

