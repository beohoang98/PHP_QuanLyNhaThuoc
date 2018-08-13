<?php

namespace Api;

require __DIR__."/dbresponse.php";

class ConnectDatabase {
    private $_mSQL;
    private $_table;
    private $_limit;
    private $_offset;
    private $_query;
    private $_res;

    public function __construct() {
        require_once __DIR__."/../../src/connect_database/connect_pg/index.php";

        $this->_mSQL = new \mSQL();

        $this->_offset = 0;
        $this->_limit = 0;
    }

    public function getQuery() {
        return $this->_query;
    }

    public function table($table_name) {
        $this->_table = $table_name;
        return $this;
    }

    public function skip($offset) {
        $this->_offset = $offset;
        return $this;
    }

    public function limit($limit) {
        $this->_limit = $limit;
        return $this;
    }

    public function execute() {
        if ($this->_limit > 0) $this->_query .= " LIMIT $this->_limit";
        if ($this->_offset > 0) $this->_query .= " OFFSET $this->_offset";

        $this->_mSQL->query($this->_query);
        $res = new \Api\DBResponse($this->_mSQL);

        $this->_res = $res;
        return $res;
    }

    public function clear() {
        $this->_table = "";
        $this->_query = "";
        $this->_limit = 0;
        $this->_offset = 0;
        $this->_res = null;
    }

    public function find($fieldsMatch) {
        $whereStr = join(
            " AND ",
            array_map(function($key, $val) {
                return "$key = $val";
            }, array_keys($fieldsMatch), $fieldsMatch)
        );

        $this->_query = "SELECT * FROM $this->_table";
        if (isset($fieldsMatch) && count($fieldsMatch) > 0) $this->_query .= " WHERE ".$whereStr;

        return $this;
    }

    public function update($fieldsMatch, $fieldsUpdate) {
        if (!isset($fieldsMatch) || !isset($fieldsUpdate)
            || count($fieldsMatch) <= 0 || count($fieldsUpdate) <= 0 )
            die("params must be valid");
        $setStr = join(
            ", ",
            array_map(function($key, $value) {
                return "$key = $value";
            }, array_keys($fieldsUpdate), $fieldsUpdate)
        );
        $whereStr = join(
            " AND ",
            array_map(function($key, $value) {
                return "$key = $value";
            }, array_keys($fieldsMatch), $fieldsMatch)
        );

        $this->_query = "UPDATE $this->_table SET (".$setStr.") WHERE ".$whereStr;

        return $this;
    }
}

?>