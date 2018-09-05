<?php
namespace NoobCoder;

function ConnectMySQL()
{
    $ROOT = __DIR__."/../../..";
    $dbConfig = getenv("PHP_ENV") === "production"
                ? \json_decode(getenv("GEARHOST_DB"), true)["mysql"]
                : \json_decode(\file_get_contents($ROOT."/local_env.json"), true)["mysql"];

    $dbconn = new \PDO("mysql:host=".$dbConfig["host"].";dbname=".$dbConfig["dbname"], $dbConfig["user"], $dbConfig["pass"]);
    $dbconn->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

    return $dbconn;
}
