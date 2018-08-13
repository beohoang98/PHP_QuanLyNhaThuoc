<?php
	$db = new \Api\ConnectDatabase();
	$res = $db->table("don_vi")->find([])->execute();

	if ($res->ok) {
		\Api\returnSuccess($res->data);
	} else {
		\Api\returnError($res->errMsg);
	}
?>