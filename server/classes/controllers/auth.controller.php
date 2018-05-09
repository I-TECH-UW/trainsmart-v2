<?php
use \Firebase\JWT\JWT;

class AuthController {
    public function __construct() {}
    
    public function authenticate($request, $response, $args) {
        $body = $request->getParsedBody();

        $obj = new DataObj();
        $resp = null;
        DataUtility::Init_HashTable();
        DataUtility::AddParameters('id', $body['username'], DataType::STR);
        DataUtility::AddParameters('name', $body['password'], DataType::STR);
        $data = $obj->ReturnObject($resp, DataUtility::Params(), "pr_user_checkCredentials", ObjectEnum::DataRow);
 
        header('content-type: application/json; charset=utf-8');

        if(!$resp) {
            echo json_encode(false);
        }else{
            // Find a corresponding token
            $obj = new DataObj();
            $resp = null;
            DataUtility::Init_HashTable();
            DataUtility::AddParameters('id', $data['id'], DataType::INT);
            DataUtility::AddParameters('time', time(), DataType::INT);
            $token = $obj->ReturnObject($resp, DataUtility::Params(), "pr_token_getToken", ObjectEnum::DataRow);

            if($token) {
                echo json_encode([
                    "access_token"      => $token['value'],
                    "token_type" => "bearer",
                    "expires_in" => $token['date_expiration'],
                    "user_id" => $token['user_id'],
                    "user" => $data
                ]);
            }

            // Create a new token if a user is found but not a token corresponding to whom.
            if($data && !$token) {
                $key = "your_secret_key";
                $payload = array(
                    "iss"     => "http://localhost:4200",
                    "iat"     => time(),
                    "exp"     => time() + (3600 * 24 * 15),
                    "context" => [
                        "user" => [
                            "user_login" => $data['username'],
                            "user_id"    => $data['id']
                        ]
                    ]
                );

                try {
                    $jwt = JWT::encode($payload, $key);
                } catch (Exception $e) {
                    echo json_encode($e);
                }

                $obj = new DataObj();
                $resp = null;
                DataUtility::Init_HashTable();                
                DataUtility::AddParameters('value', $jwt, DataType::STR);
                DataUtility::AddParameters('user_id', $data['id'], DataType::INT);
                DataUtility::AddParameters('date_created', $payload['iat'], DataType::INT);
                DataUtility::AddParameters('date_expiration', $payload['exp'], DataType::INT);
                $obj->ReturnObject($resp,DataUtility::Params(),'pr_token_saveToken',ObjectEnum::ExecuteNonQuery);

                echo json_encode([
                    "access_token"      => $jwt,
                    "token_type" => "bearer",
                    "expires_in" => $payload['exp'],
                    "user_id" => $data['id'],
                    "user" => $data
                ]);
            }
        }
        
    }
}