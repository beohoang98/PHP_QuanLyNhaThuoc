<?php
require_once "../default_api/index.php";

\Api\checkSessionAndConnect();
\Api\initHeader();

$method = $_SERVER["REQUEST_METHOD"];
if ($method === "GET") {
    require_once "_getNsx.php";
} else if ($method === "POST") {
    require_once "_addNsx.php";
} else {
    header("HTTP/1.1 404 Not Found");
}

?>