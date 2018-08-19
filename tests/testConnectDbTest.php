<?php
use \PHPUnit\Framework\TestCase;

$_SERVER["DOCUMENT"] = (__DIR__."/..");
require_once __DIR__."/../api/default_api/connectdb.php";

class ConnectDatabaseTest extends TestCase
{
    protected static $db;

    protected function setUp()
    {
        self::$db = new \Api\ConnectDatabase();
    }

    public function testFindGenerateQuery()
    {
        self::$db->clear();
        self::$db->table("TABLE")->find(["id"=>"1"]);
        $this->assertEquals(
            "SELECT * FROM TABLE WHERE id = 1",
            self::$db->getQuery()
        );
    }

    public function testFindAll()
    {
        self::$db->clear();
        self::$db->table("TABLE")->find([]);
        $this->assertEquals(
            "SELECT * FROM TABLE",
            self::$db->getQuery()
        );
    }

    public function testUpdateGenerateQuery()
    {
        self::$db->clear();
        self::$db->table("User")->update(["id"=>"1"], [
            "first_name"=>"hello",
            "last_name"=>"world"
        ]);
        $this->assertEquals(
            "UPDATE User SET (first_name = hello, last_name = world) WHERE id = 1",
            self::$db->getQuery()
        );
    }

    public function testInsertQuery()
    {
        self::$db->clear();
        self::$db->table("User")->insert([
            "id"=>1,
            "name"=>"'Hello'",
            "age"=>18
        ]);
        $this->assertEquals(
            "INSERT INTO User (id, name, age) VALUES (1, 'Hello', 18)",
            self::$db->getQuery()
        );
    }
}
