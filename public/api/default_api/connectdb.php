<?php

namespace Api {
    function connectDatabase() {
        $ROOT = $_SERVER['DOCUMENT_ROOT'];
        require_once (join(DIRECTORY_SEPARATOR, preg_split("/[\/\\\\]+/", $ROOT."/src/connect_database/connect_pg/index.php")));
    }
}

?>