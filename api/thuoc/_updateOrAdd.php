<?php
$db = new \Api\ConnectDatabase();

$checkParam = new \Api\CheckParam(["ma", "type"], "PUT");
$checkParam->fastCheck(function ($err) {
    \Api\returnError($err);
});

$data = $checkParam->data;
$ma = trim($data["ma"]);
$type = trim($data["type"]);
$res;

if ($type === "update") {
    unset($data["ma"]);
    unset($data["type"]);
    $res = $db->table("thuoc")->update(["ma"=>$ma], $data)->execute();
} elseif ($type === "add") {

} else {
    \Api\returnError("unknown type");
}

if ($res->ok) {
    \Api\returnSuccess($res->last_id);
} else {
    \Api\returnError($res->errMsg);
}