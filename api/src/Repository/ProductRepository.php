<?php

require_once("src/Repository/EntityRepository.php");
require_once("src/Class/Product.php");


/**
 *  Classe ProductRepository
 * 
 *  Cette classe représente le "stock" de Product.
 *  Toutes les opérations sur les Product doivent se faire via cette classe 
 *  qui tient "synchro" la bdd en conséquence.
 * 
 *  La classe hérite de EntityRepository ce qui oblige à définir les méthodes  (find, findAll ... )
 *  Mais il est tout à fait possible d'ajouter des méthodes supplémentaires si
 *  c'est utile !
 *  
 */
class ProductRepository extends EntityRepository {

    public function __construct(){
        // appel au constructeur de la classe mère (va ouvrir la connexion à la bdd)
        parent::__construct();
    }

    public function find($id): ?Product{
        /*
            La façon de faire une requête SQL ci-dessous est "meilleur" que celle vue
            au précédent semestre (cnx->query). Notamment l'utilisation de bindParam
            permet de vérifier que la valeur transmise est "safe" et de se prémunir
            d'injection SQL.
        */
        $requete = $this->cnx->prepare("select * from Product where id=:value"); // prepare la requête SQL
        $requete->bindParam(':value', $id); // fait le lien entre le "tag" :value et la valeur de $id
        $requete->execute(); // execute la requête
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer==false) return null; // may be false if the sql request failed (wrong $id value for example)
        
        $p = new Product($answer->id);
        $p->setName($answer->name);
        $p->setIdcategory($answer->category);
        $p->setPrice($answer->price);
        $p->setDescription($answer->description);


        $requeteimages = $this->cnx->prepare("SELECT url FROM ProductImage WHERE id_product = :id_product");
        $requeteimages->bindParam(':id_product', $answer->id); // fait le lien entre le "tag" :value et la valeur de $id
        $requeteimages->execute(); // execute la requête
        $answerimages = $requeteimages->fetchAll(PDO::FETCH_OBJ); 
        $tabimages = [];

        foreach($answerimages as $image){
            $tabimages[] = $image->url;
        }

        $p->setImages($tabimages);

        return $p;
    }






    public function findAll(): array {
        $requete = $this->cnx->prepare("select * from Product");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        // Parcourt chaque objet retourné par la requête SQL
        foreach($answer as $obj){
            // Crée une nouvelle instance de Product avec l'id du produit
            $p = new Product($obj->id);
            // Définit le nom du produit
            $p->setName($obj->name);
            // Définit la catégorie du produit
            $p->setIdcategory($obj->category);
            // Définit le prix du produit
            $p->setPrice($obj->price);
            // Définit la description du produit
            $p->setDescription($obj->description);

            // Prépare une requête pour récupérer les images associées au produit
            $requeteimages = $this->cnx->prepare("SELECT url FROM ProductImage WHERE id_product = :id_product");
            // Lie l'id du produit au paramètre de la requête
            $requeteimages->bindParam(':id_product', $obj->id);
            // Exécute la requête
            $requeteimages->execute();
            // Récupère toutes les images sous forme d'objets
            $answerimages = $requeteimages->fetchAll(PDO::FETCH_OBJ); 
            // Initialise un tableau pour stocker les URLs des images
            $tabimages = [];

            // Parcourt chaque image et ajoute son URL au tableau
            foreach($answerimages as $image){
                $tabimages[] = $image->url;
            }

            // Ajoute le tableau d'images à l'objet Product
            $p->setImages($tabimages);

            // Ajoute l'objet Product au tableau de résultats
            array_push($res, $p);
        }
       
        return $res;
    }

    public function findAllByCategory($category): array {
    $requete = $this->cnx->prepare("SELECT * FROM Product WHERE category = :category");
    $requete->bindParam(':category', $category);
    $requete->execute();
    $answer = $requete->fetchAll(PDO::FETCH_OBJ);

    $res = [];
    foreach ($answer as $obj) {
        $p = new Product($obj->id);
        $p->setName($obj->name);
        $p->setIdcategory($obj->category);
        $p->setPrice($obj->price);
        $p->setDescription($obj->description);


        $requeteimages = $this->cnx->prepare("SELECT url FROM ProductImage WHERE id_product = :id_product");
        $requeteimages->bindParam(':id_product', $obj->id); // fait le lien entre le "tag" :value et la valeur de $id
        $requeteimages->execute(); // execute la requête
        $answerimages = $requeteimages->fetchAll(PDO::FETCH_OBJ); 
        $tabimages = [];

        foreach($answerimages as $image){
            $tabimages[] = $image->url;
        }

        $p->setImages($tabimages);
        array_push($res, $p);
    }
    return $res;
}

    


    public function save($product){
        $requete = $this->cnx->prepare("insert into Product (name, category, price, description, image) values (:name, :idcategory, :price, :description, :image)");
        $name = $product->getName();
        $idcat = $product->getIdcategory();
        $price = $product->getPrice();
        $description = $product->getDescription();
        $images = $product->getImages();
        $requete->bindParam(':name', $name );
        $requete->bindParam(':idcategory', $idcat);
        $requete->bindParam(':price', $price );
        $requete->bindParam(':description', $description);
        $requete->bindParam(':images', $images);
        $answer = $requete->execute(); // an insert query returns true or false. $answer is a boolean.

        if ($answer){
            $id = $this->cnx->lastInsertId(); // retrieve the id of the last insert query
            $product->setId($id); // set the product id to its real value.
            return true;
        }
          
        return false;
    }

    public function delete($id){
        // Not implemented ! TODO when needed !
        return false;
    }

    public function update($product){
        // Not implemented ! TODO when needed !
        return false;
    }

   
    
}