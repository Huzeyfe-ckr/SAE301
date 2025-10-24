<?php
// ...existing code...

require_once "src/Class/Order.php";
require_once "src/Repository/EntityRepository.php";

class OrderRepository extends EntityRepository {

    public function __construct(){
        parent::__construct();
    }

    /**
     * Créer une nouvelle commande avec ses items
     */
    public function createOrder(Order $order): bool {
        if (!$this->cnx->beginTransaction()) {
            error_log("OrderRepository::createOrder - beginTransaction failed");
            return false;
        }

        $stmt = $this->cnx->prepare(
            "INSERT INTO Orders (user_id, created_at) VALUES (:user_id, :created_at)"
        );

        $stmt->bindValue(':user_id', $order->getUserId(), PDO::PARAM_INT);
        $stmt->bindValue(':created_at', $order->getCreatedAt(), PDO::PARAM_STR);

        if ($stmt->execute() === false) {
            $err = $stmt->errorInfo();
            $this->cnx->rollBack();
            error_log("OrderRepository::createOrder - insert order failed: " . ($err[2] ?? json_encode($err)));
            return false;
        }

        $orderId = $this->cnx->lastInsertId();
        $order->setId($orderId);

        $stmtItem = $this->cnx->prepare(
            "INSERT INTO OrderItems (order_id, product_id, product_name, quantity, unit_price, total_price) 
             VALUES (:order_id, :product_id, :product_name, :quantity, :unit_price, :total_price)"
        );

        foreach ($order->getItems() as $item) {
            $stmtItem->bindValue(':order_id', $orderId, PDO::PARAM_INT);
            $stmtItem->bindValue(':product_id', $item['productId'], PDO::PARAM_INT);
            $stmtItem->bindValue(':product_name', $item['productName'], PDO::PARAM_STR);
            $stmtItem->bindValue(':quantity', $item['quantity'], PDO::PARAM_INT);
            $stmtItem->bindValue(':unit_price', $item['unitPrice'], PDO::PARAM_STR);
            $stmtItem->bindValue(':total_price', $item['totalPrice'], PDO::PARAM_STR);

            if ($stmtItem->execute() === false) {
                $err = $stmtItem->errorInfo();
                $this->cnx->rollBack();
                error_log("OrderRepository::createOrder - insert item failed: " . ($err[2] ?? json_encode($err)));
                return false;
            }
        }

        if ($this->cnx->commit() === false) {
            error_log("OrderRepository::createOrder - commit failed");
            return false;
        }

        return true;
    }

    /**
     * Récupérer une commande par son ID avec ses items
     */
    public function find($id): ?Order {
        $stmt = $this->cnx->prepare(
            "SELECT * FROM Orders WHERE id = :id"
        );
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        if ($stmt->execute() === false) {
            $err = $stmt->errorInfo();
            error_log("OrderRepository::find - select order failed: " . ($err[2] ?? json_encode($err)));
            return null;
        }

        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$data) {
            return null;
        }

        $order = new Order($data['id']);
        $order->setUserId($data['user_id']);
        $order->setCreatedAt($data['created_at']);

        $stmtItems = $this->cnx->prepare(
            "SELECT * FROM OrderItems WHERE order_id = :order_id"
        );
        $stmtItems->bindValue(':order_id', $id, PDO::PARAM_INT);
        if ($stmtItems->execute() === false) {
            $err = $stmtItems->errorInfo();
            error_log("OrderRepository::find - select items failed: " . ($err[2] ?? json_encode($err)));
            return $order; // retourner la commande sans items si échec items
        }

        $items = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

        $totalAmount = 0;
        foreach ($items as $item) {
            $order->addItem([
                'productId' => $item['product_id'],
                'productName' => $item['product_name'],
                'quantity' => $item['quantity'],
                'unitPrice' => floatval($item['unit_price']),
                'totalPrice' => floatval($item['total_price'])
            ]);
            $totalAmount += floatval($item['total_price']);
        }

        $order->setTotalAmount($totalAmount);

        return $order;
    }

    /**
     * Récupérer toutes les commandes
     */
    public function findAll(): array {
        $stmt = $this->cnx->prepare("SELECT * FROM Orders ORDER BY created_at DESC");
        if ($stmt->execute() === false) {
            $err = $stmt->errorInfo();
            error_log("OrderRepository::findAll - select all orders failed: " . ($err[2] ?? json_encode($err)));
            return [];
        }

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $orders = [];
        foreach ($data as $row) {
            $order = $this->find($row['id']);
            if ($order) {
                $orders[] = $order;
            }
        }

        return $orders;
    }

    /**
     * Récupérer toutes les commandes d'un utilisateur
     */
    public function findByUserId(int $userId): array {
        $stmt = $this->cnx->prepare(
            "SELECT * FROM Orders WHERE user_id = :user_id ORDER BY created_at DESC"
        );
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        if ($stmt->execute() === false) {
            $err = $stmt->errorInfo();
            error_log("OrderRepository::findByUserId - select orders by user failed: " . ($err[2] ?? json_encode($err)));
            return [];
        }

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $orders = [];
        foreach ($data as $row) {
            $order = $this->find($row['id']);
            if ($order) {
                $orders[] = $order;
            }
        }

        return $orders;
    }

    public function save($product){
        // Not implemented ! TODO when needed !
        return false;
    }

    public function delete($id){
        // Not implemented ! TODO when needed !
        return false;
    }

    public function update($product, $id){
        // Not implemented ! TODO when needed !
        return false;
    }
}
