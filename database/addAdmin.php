<?php
require_once __DIR__."/../api/default_api/connectdb.php";

$db = new \Api\ConnectDatabase();

// default accounts
// user = admin, pass = admin
$res = $db->table("user")->insert([
    "username"=>"'admin'",
    "password"=>"'".password_hash("admin", PASSWORD_BCRYPT)."'"
])->execute();

if ($res->ok) {
    echo "Done\n";
} else {
    echo $res->errMsg."\n";
}
