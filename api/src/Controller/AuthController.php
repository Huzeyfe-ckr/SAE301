<?php



// ✅ DÉMARRER LA SESSION (c'était manquant !)
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once "src/Controller/EntityController.php";
require_once "src/Repository/UserRepository.php";
require_once "src/Class/User.php";

class AuthController extends EntityController {

    private UserRepository $repository;

    public function __construct(){
        $this->repository = new UserRepository();
    }
    
    protected function processGetRequest(HttpRequest $request) {
        // Vérifier si l'utilisateur est connecté
        if (isset($_SESSION['user_id'])) {
            $user = $this->repository->find($_SESSION['user_id']);
            
            if ($user) {
                return [
                    "is_authenticated" => true,
                    "user" => [
                        "id" => $user->getId(),
                        "prenom" => $user->getFirstName(),
                        "nom" => $user->getLastName(),
                        "gender" => $user->getGender(),
                        "email" => $user->getEmail()
                    ]
                ];
            }
        }
        
        return ["is_authenticated" => false];
    }
    
    protected function processPostRequest(HttpRequest $request) {
        // Lire le JSON
        $json = $request->getJson();
        $data = json_decode($json);
        
        if (!$data) {
            return ["error" => "Données invalides"];
        }
        
        if (!isset($data->action)) {
            return ["error" => "Action non spécifiée"];
        }
        
        if ($data->action === 'login') {
            return $this->login($data);
        }
        
        return ["error" => "Action inconnue"];
    }
    
    protected function processDeleteRequest(HttpRequest $request) {
        // Déconnexion
        if (isset($_SESSION['user_id'])) {
            session_destroy();
            return [
                "success" => true,
                "message" => "Déconnexion réussie"
            ];
        }
        
        return ["error" => "Aucune session active"];
    }
    
    protected function processPatchRequest(HttpRequest $request) {
        return ["error" => "PATCH non supporté pour auth"];
    }
    
    /**
     * Connexion
     */
    private function login($data) {
        if (!isset($data->email) || !isset($data->password)) {
            return ["error" => "Email et mot de passe requis"];
        }
        
        $user = $this->repository->findByEmail($data->email);
        
        if (!$user) {
            return ["error" => "Email ou mot de passe incorrect"];
        }
        
        if (!password_verify($data->password, $user->getPassword())) {
            return ["error" => "Email ou mot de passe incorrect"];
        }
        
        // Créer la session
        $_SESSION['user_id'] = $user->getId();
        $_SESSION['user_email'] = $user->getEmail();
        $_SESSION['user_nom'] = $user->getFirstName() . ' ' . $user->getLastName();
        $_SESSION['user_gender'] = $user->getGender();
        
        return [
            "success" => true,
            "message" => "Connexion réussie",
            "user" => [
                "id" => $user->getId(),
                "prenom" => $user->getFirstName(),
                "nom" => $user->getLastName(),
                "gender" => $user->getGender(),
                "email" => $user->getEmail()
            ]
        ];
    }
}
?>