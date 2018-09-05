<?php
require_once __DIR__."/../api/default_api/connectdb.php";

$db = new \Api\ConnectDatabase();

// default accounts
// user = admin, pass = admin

try {
    $res1 = $db->table("user")->find(["username"=>"'admin'"])->execute();
    $res2 = $db->table("user")->find(["username"=>"'admin_2'"])->execute();

    if ($res1->rowCount() > 0) {
        echo "Admin has existed, skip\n";
    } else {
        $db->table("user")->insert([
            "username"=>"'admin'",
            "password"=>"'".password_hash("admin", PASSWORD_BCRYPT)."'"
        ])->execute();
    }

    if ($res2->rowCount() > 0) {
        echo "Admin_2 has existed, skip\n";
    } else {
        $res2 = $db->table("user")->insert([
            "username"=>"'admin_2'",
            "password"=>"'".password_hash("123456", PASSWORD_BCRYPT)."'"
        ])->execute();
    }

    echo "Done\n";
} catch (Exception $e) {
    echo "Error: ".$e."\n";
}
