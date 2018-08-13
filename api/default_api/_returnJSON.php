<?php

namespace Api {
    function returnError($msg) {
        echo json_encode([
            "err"=>true,
            "msg"=>$msg
        ]);
        exit();
    }

    function returnSuccess($data) {
        echo json_encode([
            "err"=>false,
            "data"=>$data
        ]);
        exit();
    }
}

?>