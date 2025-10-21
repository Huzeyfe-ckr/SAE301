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
}







?>