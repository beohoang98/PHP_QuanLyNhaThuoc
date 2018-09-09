<?php
$offset = isset($_GET["offset"]) ? $_GET["offset"] : 0;
$limit = isset($_GET["limit"]) ? $_GET["limit"] : 10;
$search = isset($_GET["q"]) ? $_GET["q"] : "";

$qlnt = new \Api\QLNT();
$data = $qlnt->getThuoc($search, $offset, $limit);

\Api\returnSuccess($data);
