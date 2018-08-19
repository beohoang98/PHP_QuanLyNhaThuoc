<?php

class mSQL {
    private $_host;
    private $_port;
    private $_dbname;
    private $_user;
    private $_pass;

    public $sql;
    private $_isError = false;
    private $_errText = "";
    private $_result;

    /**
     * Contructor
     * @param string $user username
     * @param string $pass password
     */
    public function __construct()
    {
        if (getenv("PHP_ENV") === "production") {
            $db = parse_url(getenv("DATABASE_URL"));
            $this->_host = $db['host'];
            $this->_port = $db['port'];
            $this->_dbname = ltrim($db['path'], '/');
            $this->_user = $db['user'];
            $this->_pass = $db['pass'];
        } else {
            if (getenv("PHP_ENV") === "test" || getenv("CI") === true) {
                return; // it will not connect to any database
            }
            $ROOT = $_SERVER['DOCUMENT_ROOT'];
            
            $configText = file_get_contents($ROOT."/local_env.json");
            $config = json_decode($configText, true);
            $this->_host = $config['host'];
            $this->_port = $config['port'];
            $this->_dbname = $config['dbname'];
            $this->_user = $config['user'];
            $this->_pass = $config['pass'];
        }

        $this->_isError = false;
        $this->_errText = "";

        $this->sql = pg_connect("host=$this->_host port=$this->_port dbname=$this->_dbname
            user=$this->_user password=$this->_pass");

        if (!$this->sql) {
            $this->_isError = true;
            $this->_errText = "Khong the ket noi server";
        }
    }

    public function isError()
    {
        return $this->_isError;
    }

    public function errText()
    {
        return $this->_errText;
    }

    public function query($query)
    {
        $this->_isError = false;
        $this->_errText = "";

        $this->_result = pg_query($this->sql, $query);

        if (!$this->_result) {
            $this->_isError = true;
            $this->_errText = pg_last_error();
        }

        return $this->_result;
    }

    public function getArrayResult()
    {
        $arr = array();
        $result = $this->_result;
        while ($row = pg_fetch_assoc($result)) {
            array_push($arr, $row);
        }
        
        return $arr;
    }


    public function getJsonResult()
    {
        $arr = $this->getArrayResult();
        return json_encode($arr);
    }
}
