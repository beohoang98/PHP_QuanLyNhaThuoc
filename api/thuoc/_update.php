<?php
$db = new \Api\ConnectDatabase();

$checkParam = new \Api\CheckParam(["ma", "type"], "PUT");
$checkParam->fastCheck(function ($err) {
    \Api\returnError($err);
});

$data = $checkParam->data;
$ma = trim($data["ma"]);

if ($res->ok) {
    \Api\returnSuccess($res->last_id);
} else {
    \Api\returnError($res->errMsg);
}