<?php
require_once "src/Controller/EntityController.php";
require_once "src/Repository/UserRepository.php";
require_once "src/Class/User.php";

class AuthController extends EntityController {

    private UserRepository $repository;

    public function __construct(){
        $this->repository = new UserRepository();
    }
    
    protected function processPostRequest(HttpRequest $request) {
        $json = $request->getJson();
        $data = json_decode($json);
        
        if (empty($data)) {
            http_response_code(400);
        }

        if (!$data || !isset($data->email) || !isset($data->password)) {
            http_response_code(400);
        }
        
        $email = $data->email;
        $password = $data->password;
        
        $user = $this->repository->findByEmail($email);
        
        if (!$user) {
            http_response_code(401);
        }
        
        // Vérifier le mot de passe
        if (!password_verify($password, $user->getPassword())) {
            http_response_code(401);
        }
        
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        $_SESSION['user_id'] = $user->getId();
        $_SESSION['user_email'] = $user->getEmail();
        $_SESSION['user_firstname'] = $user->getFirstName();
        $_SESSION['user_lastname'] = $user->getLastName();
        $_SESSION['user_gender'] = $user->getGender();
        
        return [
            'success' => true,
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'gender' => $user->getGender(),
                'nom' => $user->getLastName(),
                'prenom' => $user->getFirstName()
            ]
        ];
    }
    
    protected function processGetRequest(HttpRequest $request) {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if (!isset($_SESSION['user_id'])) {
            return [
                'is_authenticated' => false,
            ];
        }
        
        $user = $this->repository->find($_SESSION['user_id']);
        
        if (!$user) {
            return [
                'is_authenticated' => false,
            ];
        }
        
        return [
            'is_authenticated' => true,
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'gender' => $user->getGender(),
                'nom' => $user->getLastName(),
                'prenom' => $user->getFirstName()
            ]
        ];
    }
    
    protected function processDeleteRequest(HttpRequest $request) {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        session_destroy();
        
        return [
            'success' => true,
        ];
    }
    
    protected function processPutRequest(HttpRequest $request) {
        http_response_code(405);
    }
    
    protected function processPatchRequest(HttpRequest $request) {
        http_response_code(405);
    }
}
?>
