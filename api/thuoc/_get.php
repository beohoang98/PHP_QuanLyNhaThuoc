<?php
$db = new \Api\ConnectDatabase();
$offset = isset($_GET["offset"]) ? $_GET["offset"] : 0;
$limit = isset($_GET["limit"]) ? $_GET["limit"] : 10;
$search = isset($_GET["q"]) ? $_GET["q"] : "";

$res = $db->query("SELECT thuoc.ma as ma, thuoc.ten as ten, ncc.ten as 'ten_ncc',
                        IFNULL(bang_gia.price,'chua_cap_nhat') as 'don_gia',
                        IFNULL(kho_thuoc.so_luong, 0) as 'so_luong'
                    FROM thuoc
                    LEFT JOIN ncc ON thuoc.id_ncc = ncc.id
                    LEFT JOIN kho_thuoc ON thuoc.ma = kho_thuoc.ma_thuoc
                    LEFT JOIN bang_gia ON thuoc.ma = bang_gia.ma_thuoc
                        AND (bang_gia.edit_id, thuoc.ma) IN (
                            SELECT MAX(edit_id), ma_thuoc FROM bang_gia bg GROUP BY ma_thuoc
                        )
                    WHERE thuoc.ten LIKE '$search%' OR thuoc.ma LIKE '$search%'")
            ->skip($offset)
            ->limit($limit)
            ->execute();

if ($res->ok) {
    \Api\returnSuccess($res->data);
} else {
    \Api\returnError($res->errMsg);
}
