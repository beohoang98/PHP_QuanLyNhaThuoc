<?php

class CheckParam {
    private $paramList;
    private $method;
    private $errMsg;
    public $listInvalid;

    public function __construct($dataJSON = array(), $method = "GET")
    {
        $this->errMsg = "";
        $this->method = $method;
        $this->paramList = $dataJSON;
        $this->listInvalid = array();
    }

    public function addParam($array)
    {
        if (gettype($array) != "array")
        {
            throw new Error("invalid array");
            return;
        }

        foreach ($array as $name)
        {
            array_push($this->paramList, $name);
        }
    }

    /**
     * check if param is valid
     * @return bool
     */
    public function isOK()
    {
        if (gettype($this->paramList) != "array")
        {
            $this->errMsg = "data in must be array";
            return false;
        }

        $httpParam = null;
        if ($this->method == "GET") $httpParam = $_GET;
        else if ($this->method == "POST") $httpParam = $_POST;
        else return false;

        $isTrue = true;
        foreach ($this->paramList as $name)
        {
            if (!isset($httpParam[$name]))
            {
                $isTrue = false;
                array_push($this->listInvalid, $name);
            }
            else if (trim($httpParam[$name]) == "")
            {
                $isTrue = false;
                array_push($this->listInvalid, $name);
            }
        }

        if ($isTrue) return true;
        return false;
    }

    /**
     * @return string
     */
    public function getErrMsg()
    {
        return $this->errMsg;
    }
}
?>