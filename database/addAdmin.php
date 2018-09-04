<?php
require_once __DIR__."/../api/default_api/connectdb.php";

$db = new \Api\ConnectDatabase();

// default accounts
// user = admin, pass = admin

$res1 = $db->table("user")->find(["username"=>"'admin'"])->execute();
$res2 = $db->table("user")->find(["username"=>"'admin_2'"])->execute();

if (count($res1->data) > 0) {
    echo "Admin has existed, skip\n";
} else {
    $res1 = $db->table("user")->insert([
        "username"=>"'admin'",
        "password"=>"'".password_hash("admin", PASSWORD_BCRYPT)."'"
    ])->execute();
}

if (count($res2->data) > 0) {
    echo "Admin_2 has existed, skip\n";
} else {
    $res2 = $db->table("user")->insert([
        "username"=>"'admin_2'",
        "password"=>"'".password_hash("123456", PASSWORD_BCRYPT)."'"
    ])->execute();
}

if ($res1->ok && $res2->ok) {
    echo "Done\n";
} else {
    echo $res1->errMsg."\n".$res2->errMsg."\n";
}
