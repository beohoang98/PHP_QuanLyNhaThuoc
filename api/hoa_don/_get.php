<?php

$qlnt = new \Api\QLNT();

$arr = [];
$hoaDonList = $qlnt->getHoaDonList("", 0, 100);
foreach ($hoaDonList as $hoaDon) {
    $arr[] = $hoaDon->toArray();
}
\Api\returnSuccess($arr);
