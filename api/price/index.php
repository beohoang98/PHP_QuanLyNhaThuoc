<?php
require_once "../default_api/index.php";

\Api\checkSessionAndConnect();
\Api\initHeader();

$method = $_SERVER["REQUEST_METHOD"];
try {
    if ($method === "GET") {
        require_once "_get.php";
    } elseif ($method === "POST") {
        require_once "_add.php";
    }
} catch (\Exception $e) {
    \Api\returnError($e->getMessage());
}
