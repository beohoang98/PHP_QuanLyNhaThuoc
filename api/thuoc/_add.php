<?php

$qlnt = new \Api\QLNT();

$data = json_decode(file_get_contents("php://input"), true);
$ma_thuoc = trim($data["ma"]);

if ($qlnt->checkThuoc($ma_thuoc)) {
    // update kho
    $so_luong = intval($data["so_luong"]);
    $qlnt->themThuoc($ma_thuoc, $so_luong);
    \Api\returnSuccess($ma_thuoc);
}

// else create one
$ten_thuoc = trim($data["ten"]);
$ncc = trim($data["ncc"]);
$viet_tat = trim($data["viet_tat"]);
$don_vi = intval($data['id_don_vi']);
$soLuongBanDau = intval($data["so_luong_ban_dau"]);
$donGiaBanDau = intval($data["don_gia_ban_dau"]);
$username = $_COOKIE["username"];

$idInserted = $qlnt->themMoiThuoc($ma_thuoc, $ten_thuoc, $don_vi, $ncc, $viet_tat, $soLuongBanDau, $donGiaBanDau, $username);

\Api\returnSuccess($idInserted);
