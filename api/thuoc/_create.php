<?php
$checkParam = new \Api\CheckParam(["ma", "ten", "nsx", "viet_tat", "id_don_vi"], "POST");
$checkParam->fastCheck(function ($missingParam) {
    \Api\returnError($missingParam);
});

$data = $checkParam->data;

$ma_thuoc = trim($data["ma"]);
$ten_thuoc = trim($data["ten"]);
$nsx = trim($data["nsx"]);
$viet_tat = trim($data["viet_tat"]);
$don_vi = intval($data['id_don_vi']);
$id_nsx = -1;

$db = new \Api\ConnectDatabase();

$res = $db->table("ncc")->find(["ten"=>$nsx])->execute();
if (count($res->data)===0) {
    $res = $db->table("ncc")->insert([
        "ten"=>"'$nsx'"
    ])->execute();
    $id_nsx = $res->last_id;
} else {
    $id_nsx = intval($res->data[0]["id"]);
}

$res = $db->table("thuoc")->insert([
    "ma"=>$ma_thuoc,
    "ten"=>"N'$ten_thuoc'",
    "id_nsx"=>$id_nsx,
    "viet_tat"=>"'$viet_tat'",
    "id_don_vi"=>$don_vi
])->execute();

if ($res->ok) {
    \Api\returnSuccess($res->last_id);
} else {
    \Api\returnError($res->errMsg);
}
