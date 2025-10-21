<?php

require_once ("Entity.php");

class User extends Entity {
    private int $id;
    private ?string $firstname = null;
    private ?string $lastname = null;
    private ?string $pseudo = null;
    private ?string $email = null;
    private ?string $password = null;



     public function __construct(int $id){
        $this->id = $id;
    }

       public function jsonSerialize(): mixed {
        return [
            'id' => $this->id,
            'firstname' => $this->firstname,
            'lastname' => $this->lastname,
            'pseudo' => $this->pseudo,
            'email' => $this->email
            // Note: We do not include the password in the JSON representation for security reasons.
        ];
    }

   


    public function getFirstName(): ?string {
        return $this->firstname;
    }

    public function setFirstName(string $firstname): self {
        $this->firstname = $firstname;
        return $this;
    }



    public function getLastName(): ?string {
        return $this->lastname;
    }

    public function setLastName(string $lastname): self {
        $this->lastname = $lastname;
        return $this;
    }



    public function getPseudo(): ?string {
        return $this->pseudo;
    }

    public function setPseudo(string $pseudo): self {
        $this->pseudo = $pseudo;
        return $this;
    }

    public function getEmail(): ?string {
        return $this->email;
    }
    public function setEmail(string $email): self {
        $this->email = $email;
        return $this;
    }
    public function getPassword(): ?string {
        return $this->password;
    }
    public function setPassword(string $password): self {
        $this->password = $password;
        return $this;
    }
 
}


?>