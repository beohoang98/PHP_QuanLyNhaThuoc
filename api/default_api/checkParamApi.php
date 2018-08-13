<?php

namespace Api;

class CheckParam
{
    private $paramList;
    private $method;
    private $errMsg;
    public $listInvalid;

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
                $httpParam = $_POST;
                break;
            case "PUT":
                $httpParam = $_PUT;
                break;
            case "DELETE":
                $httpParam = $_DELETE;
                break;
            default:
                return false;
        }

        $isTrue = true;
        foreach ($this->paramList as $name) {
            if (!isset($httpParam[$name]) || trim($httpParam[$name]) === "") {
                $isTrue = false;
                array_push($this->listInvalid, $name);
            }
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
}
