<?php
require_once "../default_api/index.php";

\Api\checkSessionAndConnect();
\Api\initHeader();

$method = $_SERVER["REQUEST_METHOD"];
if ($method === "GET") {
    require "_get_nsx.php";
} else if ($method === "POST") {
    require "_create_nsx.php";
} else if ($method === "PUT") {
    require "_update_nsx.php"; 
} else if ($method === "DELETE") {
    require "_remove_nsx.php";
} else {
    header("HTTP/1.1 404 Not Found");
}

?>