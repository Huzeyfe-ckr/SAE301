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
        $json = $request->getJson();
        $obj = json_decode($json);
        
        // Vérifier si c'est une connexion ou une inscription
        if (isset($obj->action)) {
            if ($obj->action === 'login') {
                return $this->login($obj);
            } elseif ($obj->action === 'register') {
                return $this->register($obj);
            }
        }
    }
    
    private function register($data) {
        // Vérifier que tous les champs sont présents
        if (!isset($data->prenom) || !isset($data->nom) || !isset($data->email) || 
            !isset($data->password)) {
        }
        
        // Vérifier si l'email existe déjà
        if ($this->users->findByEmail($data->email)) {
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