<?php
    header("Access-Control-Allow-Origin: /*");
    header("Content-Type: application/json; charset=UTF-8");

    require_once "../../SQL/Connect/connectSQL.php";
    require_once "../../SQL/Connect/sqlToJson.php";
    $sql = new mSQL();

    if ($sql->error()) {
        echo json_encode([
            "res"=>"failed",
            "msg"=>$sql->errText(),
            "data"=>null
        ]);
        return;
    }
    else {
        echo sqlToJson($sql->query("SELECT * FROM BangThuoc;"));
        return;
    }
?>