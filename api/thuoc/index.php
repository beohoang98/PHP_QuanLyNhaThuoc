<?php
require_once "../default_api/index.php";

\Api\checkSessionAndConnect();
\Api\initHeader();

$method = $_SERVER["REQUEST_METHOD"];
if ($method === "GET") {
    require_once "_getThuoc.php";
} else if ($method === "POST") {
    require_once "_addThuoc.php";
} else {
    header("HTTP/1.1 404 Not Found");
}

?>