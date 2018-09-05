<?php

namespace Api;

class DBResponse
{
    public $data;
    public $lastInsertId;

    public function __construct($stmt)
    {
        if ($res === true) {
            $this->data = true;
            $this->lastInsertId = $stmt->lastInsertId();
        } elseif ($res === false) {
            throw new \Exception($stmt->errorInfo());
        } elseif (gettype($res) !== "boolean") {
            $this->data = $stmt->toArray();
            $this->lastInsertId = $stmt->lastInsertId();
        }
    }
}
