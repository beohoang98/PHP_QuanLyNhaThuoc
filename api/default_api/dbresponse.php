<?php

namespace Api;

class DBResponse
{
    public $ok;
    public $data;
    public $errMsg;

    public function __construct($mSQL)
    {
        if ($mSQL->error) {
            $this->ok = false;
            $this->errMsg = $mSQL->error;
        } else {
            $this->ok = true;
            $this->data = $mSQL->toArray();
        }
    }
}
