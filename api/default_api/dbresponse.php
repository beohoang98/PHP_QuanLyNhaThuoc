<?php

namespace Api;

class DBResponse {
    public $ok;
    public $data;
    public $errMsg;

    public function __construct($mSQL) {
        if ($mSQL->isError()) {
            $this->ok = false;
            $this->errMsg = $mSQL->errText();
        } else {
            $this->ok = true;
            $this->data = $mSQL->getArrayResult();
        }
    }
}

?>