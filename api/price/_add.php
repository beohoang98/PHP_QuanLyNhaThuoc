<?php
$qlnt = new \Api\QLNT();

$check = new \Api\CheckParam(["ma", "price"], "POST");
$check->fastCheck(function ($err) {
    \Api\returnError($err);
});

$body = $check->data;
$ma = $body["ma"];
$price = $body["price"];
$username = $_SESSION["username"];

$data = $qlnt->themChinhGia($ma, $price, $username);
\Api\returnSuccess($data);
