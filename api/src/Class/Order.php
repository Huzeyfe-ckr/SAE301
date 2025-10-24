<?php

require_once require_once ('Entity.php');


class Order extends Entity {
    private ?int $id = null;
    private ?int $iduser = null;
    private ?float $totalprice = null;
    private ?string $status = null;
    private ?string $createdat = null;

    public function __construct(array $data = []) {
        parent::__construct($data);
    }

    public function jsonSerialize(): mixed {
        return [
            'id' => $this->id,
            'iduser' => $this->iduser,
            'totalprice' => $this->totalprice,
            'status' => $this->status,
            'createdat' => $this->createdat
        ];
    }

    public function getId(): ?int {
        return $this->id;
    }
    public function getIduser(): ?int {
        return $this->iduser;
    }
    public function setIduser(int $iduser): self {
        $this->iduser = $iduser;
        return $this;
    }
    public function getTotalprice(): ?float {
        return $this->totalprice;
    }
    public function setTotalprice(float $totalprice): self {
        $this->totalprice = $totalprice;
        return $this;
    }
    public function getStatus(): ?string {
        return $this->status;
    }
    public function setStatus(string $status): self {
        $this->status = $status;
        return $this;
    }
    public function getCreatedat(): ?string {
        return $this->createdat;
    }
    public function setCreatedat(string $createdat): self {
        $this->createdat = $createdat;
        return $this;
    }
}   
  




?>