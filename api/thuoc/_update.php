<?php
$qlnt = new \Api\QLNT();

$checkParam = new \Api\CheckParam(["ma", "editInfo"], "PUT");
$checkParam->fastCheck(function ($err) {
    \Api\returnError($err);
});

$data = $checkParam->data;
$ma = trim($data["ma"]);
$editInfo = $data["editInfo"];

$rowCount = $qlnt->suaThongTinThuoc($ma, $editInfo); // idk why, but row affected is need to know

\Api\returnSuccess($rowCount);
