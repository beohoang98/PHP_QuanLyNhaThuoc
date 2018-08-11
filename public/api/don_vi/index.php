<?php
require_once "../default_api/index.php";

\Api\checkSessionAndConnect();
\Api\initHeader();

$method = $_SERVER["REQUEST_METHOD"];
if ($method === "GET") {
    require "./_get_don_vi.php";
} else if ($method === "POST") {
    require "./_add_don_vi.php";
} else {
    header("HTTP/1.1 404 Not Found");
    header("Status: 404 Not Found");
}

?>
