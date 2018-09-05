<?php

$data = $_POST;

$ma_thuoc = trim($data["ma"]);
$ten_thuoc = trim($data["ten"]);
$nsx = trim($data["nsx"]);
$viet_tat = trim($data["viet_tat"]);
$don_vi = intval($data['id_don_vi']);
$id_nsx = -1;

$username = $_COOKIE["user"];
$now = time();

$db = new \Api\ConnectDatabase();

// check ncc if not exist, create one
$res = $db->table("ncc")->find(["ten"=>$nsx])->execute();
if (count($res->data) === 0) {
    $res = $db->table("ncc")->insert([
        "ten"=>"'$nsx'"
    ])->execute();
    $id_nsx = $res->lastInsertId;
} else {
    $id_nsx = intval($res->data[0]["id"]);
}

// check thuoc if not exist, create one
$res = $db->table("thuoc")->find(["ma"=>$ma])->execute();
if (count($res->data) === 0) {
    // not exist, create one
    $db->table("thuoc")->insert([
        "ma"=>$ma_thuoc,
        "ten"=>"N'$ten_thuoc'",
        "id_nsx"=>$id_nsx,
        "viet_tat"=>"'$viet_tat'",
        "id_don_vi"=>$don_vi
    ])->execute();
    
    // update initial price
    $db->table("bang_gia")->insert([
        "ma_thuoc"=>"'$ma'",
        "username"=>"'$username'",
        "thoi_gian"=>$now,
        "time_start"=>$now,
        "price"=>$gia,
    ]);

    // and update so_luong
    $db->table("kho_thuoc")->update();
} else {
    $res = $db->table("kho_thuoc")->find(["ma_thuoc"=>"'$ma'"])->execute();
}

\Api\returnSuccess($res->last_id);
