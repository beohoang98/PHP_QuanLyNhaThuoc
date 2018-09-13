<?php
$qlnt = new \Api\QLNT();

$search = isset($_GET["q"]) ? $_GET["q"] : "";

$data = $qlnt->searchNhaCungCap($search);
\Api\returnSuccess($data);
