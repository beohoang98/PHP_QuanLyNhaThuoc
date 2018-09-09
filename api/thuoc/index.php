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
    } elseif ($method === "PUT") {
        require_once "_update.php";
    } elseif ($method === "DELETE") {
        require_once "_delete.php";
    } else {
        \Api\returnError("Undefined Method");
    }
} catch (\Exception $e) {
    \Api\returnError($e->getMessage());
}
