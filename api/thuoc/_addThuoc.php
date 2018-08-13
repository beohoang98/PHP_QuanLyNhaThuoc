<?php
$checkParam = new CheckParam(["ma_thuoc", "ten_thuoc", "nsx", "viet_tat", "don_vi", "don_gia"], "POST");
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
$ma_thuoc = trim($_POST["ma_thuoc"]);
$ten_thuoc = trim($_POST["ten_thuoc"]);
$nsx = trim($_POST["nsx"]);
$viet_tat = trim($_POST["viet_tat"]);
$don_vi = trim($_POST['don_vi']);
$don_gia = "".trim($_POST['don_gia']);
$don_gia = preg_replace('/\D/', '', $don_gia);
$don_gia = intval($don_gia);


//check session
require_once "_checkSessionForApi.php";


//connect and fetch data to database
$sql = new mSQL('127.0.0.1', 'qlnt_access', base64_decode('NDg2MjUxNzkz'));
if ($sql->isError()) {
    echo json_encode([
        "err"=>true,
        "msg"=>"Connect error: ".$sql->errText()
    ]);
    exit();
}

$result = $sql->query("select * from func_addThuoc($ma_thuoc, N'$ten_thuoc', N'$nsx', '$viet_tat', $don_vi, $don_gia)");

if ($sql->isError()) {
    echo json_encode([
        "err"=>true,
        "msg"=>$sql->errText()
    ]);
    exit();
}

echo $sql->getJsonResult();
