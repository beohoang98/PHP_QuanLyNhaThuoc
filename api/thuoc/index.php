<?php
require_once "../default_api/index.php";

\Api\checkSessionAndConnect();
\Api\initHeader();

$method = $_SERVER["REQUEST_METHOD"];
if ($method === "GET") {
    require_once "_get.php";
} elseif ($method === "POST") {
    require_once "_create.php";
} elseif ($method === "PUT") {
    require_once "_updateOrAdd.php";
} elseif ($method === "DELETE") {
    require_once "_delete.php";
} else {
    header("HTTP/1.1 404 Not Found");
}
