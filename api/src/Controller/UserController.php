<?php 
require_once "src/Controller/EntityController.php";
require_once "src/Repository/UserRepository.php";

class UserController extends EntityController {

    private UserRepository $users;

    public function __construct(){
        $this->users = new UserRepository();
    }

    protected function processGetRequest(HttpRequest $request) {
        $id = $request->getId();
        if ($id){
            $u = $this->users->find($id);
            return $u == null ? false : $u;
        }
        else{
            return $this->users->findAll();
        }
    }

    protected function processPostRequest(HttpRequest $request) {

    if (session_status() === PHP_SESSION_NONE) {
    session_start();
    }  
    
        // Vérifier d'abord si les données sont dans $_POST (FormData)
        if (isset($_POST['action']) && $_POST['action'] === 'update_password') {
            return $this->updatePassword($_POST);
        }

        // Sinon, lire le JSON
        $json = $request->getJson();
        $obj = json_decode($json);
        
        if (isset($obj->action)) {
            if ($obj->action === 'login') {
                return $this->login($obj);
            } elseif ($obj->action === 'register') {
                return $this->register($obj);
            }
            else {
                return ["error" => "Action inconnue"];
            }
        }else {
            return ["error" => "Action non spécifiée"];
        }
        
        return ["error" => "Action non spécifiée"];
    }

protected function processPatchRequest(HttpRequest $request) {
    
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        return ["error" => "Non authentifié"];
    }
    
    $userId = $_SESSION['user_id'];
    $user = $this->users->find($userId);
    
    if (!$user) {
        return ["error" => "Utilisateur introuvable"];
    }
    
    // Lire les données depuis $_POST (FormData)
    if (isset($_POST['prenom'])) {
        $user->setFirstName($_POST['prenom']);
    }
    if (isset($_POST['nom'])) {
        $user->setLastName($_POST['nom']);
    }
    if (isset($_POST['gender'])) {
        $user->setGender($_POST['gender']);
    }
    
    $ok = $this->users->update($user);
    
    if ($ok) {
        // Mettre à jour la session
        $_SESSION['user_nom'] = $user->getFirstName() . ' ' . $user->getLastName();
        
         return [
            "success" => true,
            "message" => "Profil mis à jour",
            "user" => [
                "id" => $user->getId(),
                "prenom" => $user->getFirstName(),
                "nom" => $user->getLastName(),
                "gender" => $user->getGender(),
                "email" => $user->getEmail()
            ]
        ];
    }
    
    return ["error" => "Erreur lors de la mise à jour"];
}

protected function processDeleteRequest(HttpRequest $request) {
    // Vérifier que l'utilisateur est connecté
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        return ["error" => "Non authentifié"];
    }
    
    $userId = $_SESSION['user_id'];
    
    $ok = $this->users->delete($userId);
    
    if ($ok) {
        // Détruire la session
        session_destroy();
        
        return [
            "success" => true,
        ];
    }
    
    return ["error" => "Erreur lors de la suppression"];
}

    /**
     * Mettre à jour le mot de passe
     */
    private function updatePassword($data) {

        // Démarrer la session
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            return ["error" => "Non authentifié"];
        }
        
        $userId = $_SESSION['user_id'];
        $user = $this->users->find($userId);
        
        if (!$user) {
            return ["error" => "Utilisateur introuvable"];
        }
        
        $currentPassword = $data['current_password'] ?? null;
        $newPassword = $data['new_password'] ?? null;
        
        if (!$currentPassword || !$newPassword) {
            return ["error" => "Tous les champs sont requis"];
        }
        
        // Vérifier l'ancien mot de passe
        if (!password_verify($currentPassword, $user->getPassword())) {
            return ["error" => "Mot de passe actuel incorrect"];
        }
        
        // Mettre à jour le mot de passe
        $user->setPassword(password_hash($newPassword, PASSWORD_DEFAULT));
        
        $ok = $this->users->update($user);
        
        if ($ok) {
            return [
                "success" => true,
            ];
        }
        
        return ["error" => "Erreur lors de la mise à jour"];
    }


    
    private function register($data) {
        // Vérifier que tous les champs sont présents
        if (!isset($data->prenom) || !isset($data->nom) || !isset($data->email) || 
            !isset($data->password)) {
            return ["error" => "Tous les champs sont requis"];
        }
        
        // Vérifier si l'email existe déjà
        if ($this->users->findByEmail($data->email)) {
            return ["error" => "Email déjà utilisé"];
        }
        
        // Créer le nouvel utilisateur
        $u = new User(0);
        $u->setFirstName($data->prenom);
        $u->setLastName($data->nom);
        $u->setGender($data->gender ?? null); // ✅ Utiliser gender au lieu de pseudo
        $u->setEmail($data->email);
        // IMPORTANT: Hasher le mot de passe
        $u->setPassword(password_hash($data->password, PASSWORD_DEFAULT));
        
        $ok = $this->users->save($u);
        
        if ($ok) {
            // Démarrer la session
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
            
            $_SESSION['user_id'] = $u->getId();
            $_SESSION['user_email'] = $u->getEmail();
            $_SESSION['user_nom'] = $u->getFirstName() . ' ' . $u->getLastName();
            $_SESSION['user_gender'] = $u->getGender();
            
            return [
                "success" => true,
                "user" => [
                    "id" => $u->getId(),
                    "firstname" => $u->getFirstName(),
                    "lastname" => $u->getLastName(),
                    "gender" => $u->getGender(),
                    "email" => $u->getEmail()
                ]
            ];
        }
        return ["error" => "Erreur lors de l'inscription"];
    }
    
    private function login($data) {
        // Vérifier que les champs sont présents
        if (!isset($data->email) || !isset($data->password)) {
            return ["error" => "Email et mot de passe requis"];
        }
        
        // Chercher l'utilisateur par email
        $user = $this->users->findByEmail($data->email);
        
        if (!$user) {
            return ["error" => "Email ou mot de passe incorrect"];
        }
        
        // Vérifier le mot de passe
        if (!password_verify($data->password, $user->getPassword())) {
            return ["error" => "Email ou mot de passe incorrect"];
        }
        
        // Démarrer la session
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        $_SESSION['user_id'] = $user->getId();
        $_SESSION['user_email'] = $user->getEmail();
        $_SESSION['user_nom'] = $user->getFirstName() . ' ' . $user->getLastName();
        $_SESSION['user_gender'] = $user->getGender();
        
        return [
            "success" => true,
            "user" => [
                "id" => $user->getId(),
                "firstname" => $user->getFirstName(),
                "lastname" => $user->getLastName(),
                "gender" => $user->getGender(),
                "email" => $user->getEmail()
            ]
        ];
    }
}

?>