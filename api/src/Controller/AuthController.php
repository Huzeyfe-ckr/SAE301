<?php
require_once "src/Controller/EntityController.php";
require_once "src/Repository/UserRepository.php";
require_once "src/Class/User.php";

/**
 * AuthController
 * Gère les requêtes d'authentification (login, logout, session check)
 */
class AuthController extends EntityController {

    private UserRepository $users;

    public function __construct(){
        $this->users = new UserRepository();
        // Assurer que la session est démarrée
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }
    
    // Connexion (Login)
    protected function processPostRequest(HttpRequest $request) {
        try {
            // Vérifier d'abord si les données sont dans $_POST (FormData)
            if (isset($_POST['action']) && $_POST['action'] === 'login') {
                $email = $_POST['email'] ?? null;
                $mot_de_passe = $_POST['mot_de_passe'] ?? null;
            } else {
                // Sinon, lire le JSON
                $json = $request->getJson();
                $obj = json_decode($json);
                $email = $obj->email ?? null;
                $mot_de_passe = $obj->mot_de_passe ?? null;
            }

            if (!$email || !$mot_de_passe) {
                http_response_code(400);
                return ["error" => "Email et mot de passe requis"];
            }
            
            // Rechercher l'utilisateur par email
            $users = $this->users->findBy(['email' => $email]);
            
            if (empty($users)) {
                http_response_code(401);
                return ["error" => "Email ou mot de passe incorrect"];
            }
            
            $user = $users[0];
            
            // Vérifier le mot de passe
            if (password_verify($mot_de_passe, $user->getPassword())) {
                // Connexion réussie : régénérer l'ID de session pour la sécurité
                session_regenerate_id(true);
                
                $_SESSION['user_id'] = $user->getId();
                $_SESSION['user_email'] = $user->getEmail();
                $_SESSION['user_pseudo'] = $user->getPseudo();
                $_SESSION['user_nom'] = $user->getFirstName() . ' ' . $user->getLastName();
                
                // Retourner les infos non sensibles de l'utilisateur
                return [
                    "success" => true,
                    "message" => "Connexion réussie",
                    "user" => [
                        "id" => $user->getId(),
                        "email" => $user->getEmail(),
                        "pseudo" => $user->getPseudo(),
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
    
    // Déconnexion (Logout)
    protected function processDeleteRequest(HttpRequest $request) {
        // Destruction complète de la session
        $_SESSION = [];
        
        // Supprimer le cookie de session
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
    
    // Vérification de session (GET /auth)
    protected function processGetRequest(HttpRequest $request) {
        if (isset($_SESSION['user_id'])) {
            $user = $this->users->find($_SESSION['user_id']);
            
            if ($user) {
                return [
                    "is_authenticated" => true,
                    "user" => [
                        "id" => $user->getId(),
                        "email" => $user->getEmail(),
                        "pseudo" => $user->getPseudo(),
                        "nom" => $user->getLastName(),
                        "prenom" => $user->getFirstName()
                    ]
                ];
            } else {
                // Utilisateur introuvable, détruire la session
                session_destroy();
                return ["is_authenticated" => false];
            }
        }
        
        return ["is_authenticated" => false];
    }
    
    // Désactiver les autres méthodes HTTP
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