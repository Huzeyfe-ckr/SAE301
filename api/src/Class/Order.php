<?php


require_once "Entity.php";

class Order extends Entity {

    private ?int $userId;
    private ?string $createdAt;
    private array $items = [];
    private float $totalAmount = 0;

    public function __construct(?int $id = null) {
        parent::__construct($id);
        $this->userId = null;
        $this->createdAt = null;
    }

    // Getters
    public function getUserId(): ?int {
        return $this->userId;
    }

    public function getCreatedAt(): ?string {
        return $this->createdAt;
    }

    public function getItems(): array {
        return $this->items;
    }

    public function getTotalAmount(): float {
        return $this->totalAmount;
    }

    // Setters
    public function setUserId(?int $userId): void {
        $this->userId = $userId;
    }

    public function setCreatedAt(?string $createdAt): void {
        $this->createdAt = $createdAt;
    }

    public function addItem(array $item): void {
        $this->items[] = $item;
    }

    public function setTotalAmount(float $amount): void {
        $this->totalAmount = $amount;
    }

    public function toArray(): array {
        return [
            'id' => $this->getId(),
            'userId' => $this->userId,
            'createdAt' => $this->createdAt,
            'items' => $this->items,
            'totalAmount' => $this->totalAmount
        ];
    }

    public function jsonSerialize(): mixed {
        return $this->toArray();
    }
}