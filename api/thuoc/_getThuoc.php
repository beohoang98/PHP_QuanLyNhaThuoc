<?php
$db = new \Api\ConnectDatabase();
$res = $db->query("SELECT thuoc.ma as ma, thuoc.ten as ten, ncc.ten as 'ten_nsx'
                    FROM thuoc, ncc
                    WHERE thuoc.id_ncc = ncc.id")
            ->execute();

if ($res->ok) {
    \Api\returnSuccess($res->data);
} else {
    \Api\returnError($res->errMsg);
}
