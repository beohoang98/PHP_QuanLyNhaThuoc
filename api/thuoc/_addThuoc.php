<?php
$checkParam = new \Api\CheckParam(["ma_thuoc", "ten_thuoc", "nsx", "viet_tat", "don_vi", "don_gia"], "POST");
if (!$checkParam->isOK()) {
    $msgerr = "";
    foreach ($checkParam->listInvalid as $name) {
        $msgerr = $msgerr." ".$name;
    }

    echo json_encode([
        "err"=>true,
        "msg"=>"missing or invalid parameters: ".$msgerr
    ]);
    exit();
}

$data = $checkParam->data;

$ma_thuoc = trim($data["ma_thuoc"]);
$ten_thuoc = trim($data["ten_thuoc"]);
$nsx = trim($data["nsx"]);
$viet_tat = trim($data["viet_tat"]);
$don_vi = trim($data['don_vi']);
$don_gia = "".trim($data['don_gia']);
$don_gia = preg_replace('/\D/', '', $don_gia);
$don_gia = intval($don_gia);

$db = new \Api\ConnectDatabase();

$res = $db->table("Thuoc")->insert([
    "ma"=>$ma_thuoc,
    "ten"=>"'$ten_thuoc'",
    // "id_nsx"=>"'$nsx'",
    "viet_tat"=>"'$viet_tat'",
    "id_don_vi"=>$don_vi,
    "don_gia"=>$don_gia
])->execute();

if ($res->ok) {
    \Api\returnSuccess($res->data);
} else {
    \Api\returnError($res->errMsg);
}
