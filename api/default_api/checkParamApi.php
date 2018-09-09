<?php

namespace Api;

class CheckParam
{
    private $paramList;
    private $method;
    private $errMsg;
    public $listInvalid;
    public $data; // after check

    public function __construct($dataJSON = array(), $method = "GET")
    {
        if (gettype($dataJSON) != "array") {
            throw new Error("invalid array");
            return;
        }
        $this->errMsg = "";
        $this->method = $method;
        $this->paramList = $dataJSON;
        $this->listInvalid = array();
    }

    public function addParam($array)
    {
        if (gettype($array) != "array") {
            throw new Error("invalid array");
            return;
        }

        foreach ($array as $name) {
            array_push($this->paramList, $name);
        }
    }

    /**
     * check if param is valid
     * @return bool
     */
    public function isOK()
    {
        $httpParam = null;
        switch ($this->method) {
            case "GET":
                $httpParam = $_GET;
                break;
            case "POST":
            case "PUT":
            case "DELETE":
                $httpParam = \json_decode(\file_get_contents("php://input"), true);
                break;
            default:
                return false;
        }

        $isTrue = true;
        foreach ($this->paramList as $name) {
            if (!isset($httpParam[$name])) {
                $isTrue = false;
                array_push($this->listInvalid, $name);
            }
        }
        if ($isTrue) {
            $this->data = $httpParam;
        }
        return $isTrue;
    }

    /**
     * @return string
     */
    public function getErrMsg()
    {
        return $this->errMsg;
    }

    public function fastCheck($onError)
    {
        if (!$this->isOK()) {
            $msgerr = "";
            foreach ($checkParam->listInvalid as $name) {
                $msgerr = $msgerr." ".$name;
            }
            $onError($msgerr);
        }
    }
}
