<?php
/**
 * Asd
 */

$ROOT = $_SERVER["DOCUMENT_ROOT"];
session_start();

if (!isset($_SESSION) || !$_SESSION["username"]) {
    echo json_encode(
        [
            "err"=>true,
            "msg"=>"unknown session"
        ]
    );
    exit();
}

require_once realpath($ROOT."/src/connect-database/ConnectPG/index.php");
?>
