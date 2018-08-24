<?php
namespace Api;

class ConnectDatabase
{
    private $mSQL;
    private $table;
    private $limit;
    private $offset;
    private $query;
    private $res;

    public function __construct()
    {
        require_once __DIR__."/dbresponse.php";
        require_once __DIR__."/../../src/connect_database/connect_mysql/index.php";

        $this->mSQL = new \NoobCoder\ConnectMySQL();
        if ($this->mSQL->error) {
            throw new \Exception($this->mSQL->error);
        }

        $this->mSQL->query("SET NAMES utf8");
        $this->offset = 0;
        $this->limit = 0;
    }

    public function getQuery()
    {
        return $this->query;
    }

    public function query($query)
    {
        $this->query = $query;
        return $this;
    }

    public function table($table_name)
    {
        $this->table = $table_name;
        return $this;
    }

    public function skip($offset)
    {
        $this->offset = $offset;
        return $this;
    }

    public function limit($limit)
    {
        $this->limit = $limit;
        return $this;
    }

    public function execute()
    {
        if ($this->limit > 0) {
            $this->query .= " LIMIT $this->limit";
        }
        if ($this->offset > 0) {
            $this->query .= " OFFSET $this->offset";
        }

        $this->mSQL->query($this->query);
        $res = new \Api\DBResponse($this->mSQL);

        $this->res = $res;
        $this->clear();
        return $res;
    }

    public function clear()
    {
        $this->table = "";
        $this->query = "";
        $this->limit = 0;
        $this->offset = 0;
        $this->res = null;
    }

    public function find($fieldsMatch)
    {
        $whereStr = join(
            " AND ",
            array_map(function ($key, $val) {
                return "$key = $val";
            }, array_keys($fieldsMatch), $fieldsMatch)
        );

        $this->query = "SELECT * FROM $this->table";
        if (isset($fieldsMatch) && count($fieldsMatch) > 0) {
            $this->query .= " WHERE ".$whereStr;
        }

        return $this;
    }

    public function insert($fieldAndValue)
    {
        $fieldStr = join(", ", array_keys($fieldAndValue));
        $valueStr = join(", ", array_values($fieldAndValue));
        $this->query = "INSERT INTO $this->table ($fieldStr) VALUES ($valueStr)";
        return $this;
    }

    public function update($fieldsMatch, $fieldsUpdate)
    {
        if (!isset($fieldsMatch) || !isset($fieldsUpdate)
        || count($fieldsMatch) <= 0 || count($fieldsUpdate) <= 0) {
            die("params must be valid");
        }

        $setStr = join(
            ", ",
            array_map(function ($key, $value) {
                return "$key = $value";
            }, array_keys($fieldsUpdate), $fieldsUpdate)
        );
        $whereStr = join(
            " AND ",
            array_map(function ($key, $value) {
                return "$key = $value";
            }, array_keys($fieldsMatch), $fieldsMatch)
        );

        $this->query = "UPDATE $this->table SET (".$setStr.") WHERE ".$whereStr;

        return $this;
    }
}
