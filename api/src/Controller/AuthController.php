<?php
require_once "src/Controller/EntityController.php";
require_once "src/Repository/UserRepository.php";
require_once "src/Class/User.php";

class AuthController extends EntityController {

    private UserRepository $users;

    public function __construct(){
        $this->users = new UserRepository();
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }
    
    protected function processPostRequest(HttpRequest $request) {
        try {
            // Lire le JSON
            $json = $request->getJson();
            $obj = json_decode($json);
            $email = $obj->email ?? null;
            $password = $obj->password ?? null; // ✅ Utiliser "password" comme dans UserController

            if (!$email || !$password) {
                http_response_code(400);
                return ["error" => "Email et mot de passe requis"];
            }
            
            // ✅ Utiliser findByEmail au lieu de findBy
            $user = $this->users->findByEmail($email);
            
            if (!$user) {
                http_response_code(401);
                return ["error" => "Email ou mot de passe incorrect"];
            }
            
            // Vérifier le mot de passe
            if (password_verify($password, $user->getPassword())) {
                session_regenerate_id(true);
                
                $_SESSION['user_id'] = $user->getId();
                $_SESSION['user_email'] = $user->getEmail();
                $_SESSION['user_nom'] = $user->getFirstName() . ' ' . $user->getLastName();
                $_SESSION['user_gender'] = $user->getGender(); // ✅ Utiliser gender au lieu de pseudo
                
                return [
                    "success" => true,
                    "message" => "Connexion réussie",
                    "user" => [
                        "id" => $user->getId(),
                        "email" => $user->getEmail(),
                        "gender" => $user->getGender(), // ✅ Utiliser gender
                        "nom" => $user->getLastName(),
                        "prenom" => $user->getFirstName()
                    ]
                ];
            } else {
                http_response_code(401);
                return ["error" => "Email ou mot de passe incorrect"];
            }
            
        } catch (Exception $e) {
            error_log("Erreur login: " . $e->getMessage());
            http_response_code(500);
            return ["error" => "Erreur serveur"];
        }
    }
    
    protected function processDeleteRequest(HttpRequest $request) {
        $_SESSION = [];
        
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params["path"],
                $params["domain"],
                $params["secure"],
                $params["httponly"]
            );
        }
        
        session_destroy();
        
        return [
            "success" => true,
            "message" => "Déconnexion réussie"
        ];
    }
    
    protected function processGetRequest(HttpRequest $request) {
        if (isset($_SESSION['user_id'])) {
            $user = $this->users->find($_SESSION['user_id']);
            
            if ($user) {
                return [
                    "is_authenticated" => true,
                    "user" => [
                        "id" => $user->getId(),
                        "email" => $user->getEmail(),
                        "gender" => $user->getGender(), // ✅ Utiliser gender
                        "nom" => $user->getLastName(),
                        "prenom" => $user->getFirstName()
                    ]
                ];
            } else {
                session_destroy();
                return ["is_authenticated" => false];
            }
        }
        
        return ["is_authenticated" => false];
    }
    
    protected function processPutRequest(HttpRequest $request) {
        http_response_code(405);
        return ["error" => "Méthode non autorisée"];
    }
    
    protected function processPatchRequest(HttpRequest $request) {
        http_response_code(405);
        return ["error" => "Méthode non autorisée"];
    }
}
?>