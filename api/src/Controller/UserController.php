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
        
        if (isset($obj->action)) {
            if ($obj->action === 'login') {
                return $this->login($obj);
            } elseif ($obj->action === 'register') {
                return $this->register($obj);
            }
        }
        
        return ["error" => "Action non spécifiée"];
    }
    
    private function register($data) {
        if (!isset($data->prenom) || !isset($data->nom) || !isset($data->email) || 
            !isset($data->mot_de_passe)) {
            return ["error" => "Tous les champs obligatoires doivent être remplis"];
        }
        
        if ($this->users->findByEmail($data->email)) {
            return ["error" => "Cet email est déjà utilisé"];
        }
        
        $pseudo = isset($data->pseudo) ? $data->pseudo : 
                  strtolower(substr($data->prenom, 0, 1) . $data->nom);
        
        if ($this->users->findByPseudo($pseudo)) {
            $pseudo = $pseudo . rand(100, 999);
        }
        
        $u = new User(0);
        $u->setFirstName($data->prenom);
        $u->setLastName($data->nom);
        $u->setPseudo($pseudo);
        $u->setEmail($data->email);
        $u->setPassword(password_hash($data->mot_de_passe, PASSWORD_DEFAULT));
        
        $ok = $this->users->save($u);
        
        if ($ok) {
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
            
            $_SESSION['user_id'] = $u->getId();
            $_SESSION['user_pseudo'] = $u->getPseudo();
            $_SESSION['user_email'] = $u->getEmail();
            $_SESSION['user_nom'] = $u->getFirstName() . ' ' . $u->getLastName();
            
            return [
                "success" => true,
                "message" => "Inscription réussie",
                "user" => $u
            ];
        }
        
        return ["error" => "Erreur lors de l'inscription"];
    }
    
    private function login($data) {
        if (!isset($data->email) || !isset($data->mot_de_passe)) {
            return ["error" => "Email et mot de passe requis"];
        }
        
        $user = $this->users->findByEmail($data->email);
        
        if (!$user) {
            return ["error" => "Email ou mot de passe incorrect"];
        }
        
        if (!password_verify($data->mot_de_passe, $user->getPassword())) {
            return ["error" => "Email ou mot de passe incorrect"];
        }
        
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        $_SESSION['user_id'] = $user->getId();
        $_SESSION['user_pseudo'] = $user->getPseudo();
        $_SESSION['user_email'] = $user->getEmail();
        $_SESSION['user_nom'] = $user->getFirstName() . ' ' . $user->getLastName();
        
        return [
            "success" => true,
            "message" => "Connexion réussie",
            "user" => $user
        ];
    }
}







?>