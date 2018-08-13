<?php

namespace Api {
    function checkSession() {
        $ROOT = $_SERVER["DOCUMENT_ROOT"];
        session_start();
        if (!isset($_SESSION) || !isset($_SESSION["username"])) {
            echo json_encode(
                [
                    "err"=>true,
                    "msg"=>"unknown session"
                ]
            );
            exit();
        }
    }
}
?>
