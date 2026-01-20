<?php


error_reporting(E_ALL);
ini_set("display_errors", "1");

// En-têtes CORS - À placer TOUT AU DÉBUT
// Autoriser localhost sur différents ports (dev) et la production
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];
$isAllowed = false;

// Vérifier localhost avec n'importe quel port
if (preg_match('/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/', $origin)) {
    $isAllowed = true;
}

// Vérifier les ports localhost spécifiques
if (in_array($origin, $allowedOrigins)) {
    $isAllowed = true;
}

// Autoriser mmi.unilim.fr et ses sous-domaines
if (strpos($origin, 'mmi.unilim.fr') !== false) {
    $isAllowed = true;
}

if ($isAllowed) {
    header("Access-Control-Allow-Origin: $origin");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Gérer les requêtes OPTIONS (preflight) - AVANT session_set_cookie_params
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration des cookies de session APRÈS la gestion OPTIONS
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'None'
]);

// Démarrer la session
session_start();

require_once "src/Controller/ProductController.php";
require_once "src/Controller/UserController.php";
require_once "src/Controller/AuthController.php";
require_once "src/Controller/OrderController.php";
require_once "src/Class/HttpRequest.php";

// ...existing code...

$router = [
    "products" => new ProductController(),
    "users" => new UserController(),
    "auth" => new AuthController(),
    "orders" => new OrderController(),
];

$request = new HttpRequest();

// Supprimer cette partie car déjà gérée en haut
// if ($request->getMethod() == "OPTIONS"){
//     http_response_code(200);
//     exit();
// }

$route = $request->getRessources();

if ( isset($router[$route]) ){
    $ctrl = $router[$route];
    $json = $ctrl->jsonResponse($request);
    if ($json){ 
        header("Content-type: application/json;charset=utf-8");
        echo $json;
    }
    else{
        http_response_code(404);
    }
    die();
}
http_response_code(404);
die();

?>