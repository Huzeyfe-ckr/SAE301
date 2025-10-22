<?php

// require_once("src/Repository/EntityRepository.php");
// require_once("src/Class/User.php");

// class UserRepository extends EntityRepository {

//     public function __construct(){
//         parent::__construct();
//     }

//     public function find($id): ?User{
//         $requete = $this->cnx->prepare("SELECT * FROM User WHERE id=:value");
//         $requete->bindParam(':value', $id);
//         $requete->execute();
//         $answer = $requete->fetch(PDO::FETCH_OBJ);
        
//         if ($answer == false) return null;
        
//         $u = new User($answer->id);
//         $u->setFirstName($answer->prenom);      // prenom dans la BDD
//         $u->setLastName($answer->nom);          // nom dans la BDD
//         $u->setPseudo($answer->pseudo);
//         $u->setEmail($answer->email);
//         $u->setPassword($answer->mot_de_passe); // mot_de_passe dans la BDD

//         return $u;
//     }

//     public function findAll(): array {
//         $requete = $this->cnx->prepare("SELECT * FROM User");
//         $requete->execute();
//         $answer = $requete->fetchAll(PDO::FETCH_OBJ);
        
//         $res = []; // ⚠️ Initialiser le tableau !
        
//         foreach($answer as $obj){
//             $u = new User($obj->id);
//             $u->setFirstName($obj->prenom);      // prenom dans la BDD
//             $u->setLastName($obj->nom);          // nom dans la BDD
//             $u->setPseudo($obj->pseudo);
//             $u->setEmail($obj->email);
//             $u->setPassword($obj->mot_de_passe); // mot_de_passe dans la BDD
            
//             $res[] = $u; // ⚠️ Ajouter l'utilisateur au tableau !
//         }
        
//         return $res;
//     }

//     public function save($user): bool {
//         $requete = $this->cnx->prepare(
//             "INSERT INTO User (prenom, nom, pseudo, email, mot_de_passe) 
//              VALUES (:prenom, :nom, :pseudo, :email, :mot_de_passe)"
//         );
        
//         $prenom = $user->getFirstName();
//         $nom = $user->getLastName();
//         $pseudo = $user->getPseudo();
//         $email = $user->getEmail();
//         $password = $user->getPassword();

//         $requete->bindParam(':prenom', $prenom);
//         $requete->bindParam(':nom', $nom);
//         $requete->bindParam(':pseudo', $pseudo);
//         $requete->bindParam(':email', $email);
//         $requete->bindParam(':mot_de_passe', $password);

//         return $requete->execute();
//     }

//     public function delete($id): bool {
//         $requete = $this->cnx->prepare("DELETE FROM User WHERE id=:id");
//         $requete->bindParam(':id', $id);
//         return $requete->execute();
//     }

//     public function update($user): bool {
//         $requete = $this->cnx->prepare(
//             "UPDATE User SET prenom=:prenom, nom=:nom, pseudo=:pseudo, 
//              email=:email, mot_de_passe=:mot_de_passe WHERE id=:id"
//         );
        
//         $id = $user->getId();
//         $prenom = $user->getFirstName();
//         $nom = $user->getLastName();
//         $pseudo = $user->getPseudo();
//         $email = $user->getEmail();
//         $password = $user->getPassword();
        
//         $requete->bindParam(':id', $id);
//         $requete->bindParam(':prenom', $prenom);
//         $requete->bindParam(':nom', $nom);
//         $requete->bindParam(':pseudo', $pseudo);
//         $requete->bindParam(':email', $email);
//         $requete->bindParam(':mot_de_passe', $password);
        
//         return $requete->execute();
//     }
// }

require_once("src/Repository/EntityRepository.php");
require_once("src/Class/User.php");

class UserRepository extends EntityRepository {

    public function __construct(){
        parent::__construct();
    }

    public function find($id): ?User{
        $requete = $this->cnx->prepare("SELECT * FROM User WHERE id=:value");
        $requete->bindParam(':value', $id);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer == false) return null;
        
        $u = new User($answer->id);
        $u->setFirstName($answer->prenom);
        $u->setLastName($answer->nom);
        $u->setGender($answer->gender);
        $u->setEmail($answer->email);
        $u->setPassword($answer->mot_de_passe);

        return $u;
    }

    public function findAll(): array {
        $requete = $this->cnx->prepare("SELECT * FROM User");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);
        
        $res = [];
        
        foreach($answer as $obj){
            $u = new User($obj->id);
            $u->setFirstName($obj->prenom);
            $u->setLastName($obj->nom);
            $u->setGender($obj->gender);
            $u->setEmail($obj->email);
            $u->setPassword($obj->mot_de_passe);
            
            $res[] = $u;
        }
        
        return $res;
    }

   public function save($user): bool {
    $requete = $this->cnx->prepare(
        "INSERT INTO User (prenom, nom, gender, email, mot_de_passe) 
         VALUES (:prenom, :nom, :gender, :email, :mot_de_passe)"
    );
    
    $prenom = $user->getFirstName();
    $nom = $user->getLastName();
    $gender = $user->getGender();
    $email = $user->getEmail();
    $password = $user->getPassword();

    $requete->bindParam(':prenom', $prenom);
    $requete->bindParam(':nom', $nom);
    $requete->bindParam(':gender', $gender);
    $requete->bindParam(':email', $email);
    $requete->bindParam(':mot_de_passe', $password);

    $success = $requete->execute();
    
    // ✅ Récupérer l'ID du dernier INSERT et le définir dans l'objet User
    if ($success) {
        $user->setId((int)$this->cnx->lastInsertId());
    }
    
    return $success;
}

    public function delete($id): bool {
        $requete = $this->cnx->prepare("DELETE FROM User WHERE id=:id");
        $requete->bindParam(':id', $id);
        return $requete->execute();
    }

    public function update($user): bool {
        $requete = $this->cnx->prepare(
            "UPDATE User SET prenom=:prenom, nom=:nom, gender=:gender, 
             email=:email, mot_de_passe=:mot_de_passe WHERE id=:id"
        );
        
        $id = $user->getId();
        $prenom = $user->getFirstName();
        $nom = $user->getLastName();
        $gender = $user->getGender();
        $email = $user->getEmail();
        $password = $user->getPassword();
        
        $requete->bindParam(':id', $id);
        $requete->bindParam(':prenom', $prenom);
        $requete->bindParam(':nom', $nom);
        $requete->bindParam(':gender', $gender);
        $requete->bindParam(':email', $email);
        $requete->bindParam(':mot_de_passe', $password);
        
        return $requete->execute();
    }

    public function findByEmail(string $email): ?User {
        $requete = $this->cnx->prepare("SELECT * FROM User WHERE email=:email");
        $requete->bindParam(':email', $email);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer == false) return null;
        
        $u = new User($answer->id);
        $u->setFirstName($answer->prenom);
        $u->setLastName($answer->nom);
        $u->setGender($answer->gender);
        $u->setEmail($answer->email);
        $u->setPassword($answer->mot_de_passe);

        return $u;
    }

    public function findByGender(string $gender): ?User {
        $requete = $this->cnx->prepare("SELECT * FROM User WHERE gender=:gender");
        $requete->bindParam(':gender', $gender);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer == false) return null;
        
        $u = new User($answer->id);
        $u->setFirstName($answer->prenom);
        $u->setLastName($answer->nom);
        $u->setGender($answer->gender);
        $u->setEmail($answer->email);
        $u->setPassword($answer->mot_de_passe);

        return $u;
    }
}
?>