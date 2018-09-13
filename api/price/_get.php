<?php
$qlnt = \Api\QLNT();

if (!isset($_GET["ma"])) {
    throw new Exception("missing param 'ma'");
}

$ma = $_GET["ma"];
$data = $qlnt->getBangGia($ma);
\Api\returnSuccess($data);
