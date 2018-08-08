<?php
    require_once "connectPG.php";

    $sql = new pgSQL();

    if ($sql->isError())
    {
        echo $sql->errorText();
    }
    else {
        $s ="SELECT * FROM test;\0";

        $sql->query($s);
        echo $sql->getJsonResult();
    }
?>