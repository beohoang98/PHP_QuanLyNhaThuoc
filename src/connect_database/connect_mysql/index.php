<?php
namespace NoobCoder;

class ConnectMySQL
{
    private $db;
    private $stmt;
    public $res;
    public $error;

    public function __construct()
    {
        // asd
        $ROOT = __DIR__."/../../..";
        $dbConfig = getenv("PHP_ENV") === "production"
                    ? \json_decode(getenv("GEARHOST_DB"), true)["mysql"]
                    : \json_decode(\file_get_contents($ROOT."/local_env.json"), true)["mysql"];

        $this->error = null;

        try {
            $this->db = new \PDO("mysql:host=".$dbConfig["host"].";dbname=".$dbConfig["dbname"], $dbConfig["user"], $dbConfig["pass"]);
            $this->db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        } catch (\PDOException $e) {
            $this->error = $e->getMessage();
        }
    }

    public function query($str)
    {
        $this->error = null;
        try {
            $this->res = $this->db->query($str);
            if ($this->res == false) {
                $this->error = "Result was false";
            }
        } catch (\PDOException $e) {
            $this->error = $e->getMessage();
        }
        return $this;
    }

    public function prepare($str)
    {
        $this->stmt = $this->db->prepare($str);
        return $this;
    }

    public function execute($arr = [])
    {
        $this->res = $this->stmt->execute($arr);
        return $this;
    }

    public function result()
    {
        return $this->res;
    }

    public function toArray()
    {
        if (!$this->res) {
            return [];
        }
        return $this->res->fetchAll(\PDO::FETCH_ASSOC);
    }
}
