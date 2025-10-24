<?php

require_once "src/Controller/EntityController.php";
require_once "src/Repository/OrderRepository.php";
require_once "src/Class/Order.php";

class OrderController extends EntityController {

    private OrderRepository $orders;

    public function __construct(){
        $this->orders = new OrderRepository();
    }

    protected function processGetRequest(HttpRequest $request) {
        $id = $request->getId("id");
        if ($id) {
            $order = $this->orders->find($id);
            return $order == null ? false : $order;
        } else {
            $userId = $request->getParam("user_id");
            if ($userId) {
                return $this->orders->findByUserId(intval($userId));
            }
            return $this->orders->findAll();
        }
    }

    protected function processPostRequest(HttpRequest $request) {
        $json = $request->getJson();
        $data = json_decode($json, true);
        
        if (!$data || !isset($data['items']) || empty($data['items'])) {
            return false;
        }

        $order = new Order(0);
        $order->setUserId($data['userId'] ?? 0);
        $order->setCreatedAt(date('Y-m-d H:i:s'));

        foreach ($data['items'] as $item) {
            $order->addItem([
                'productId' => $item['id'],
                'productName' => $item['name'],
                'quantity' => $item['quantity'],
                'unitPrice' => floatval($item['price']),
                'totalPrice' => floatval($item['price']) * intval($item['quantity'])
            ]);
        }

        $ok = $this->orders->createOrder($order);
        return $ok ? $order : false;
    }
}