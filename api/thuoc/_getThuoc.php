<?php
	$db = new \Api\ConnectDatabase();
	$res = $db->table("thuoc")->find([])->execute();

	if ($res->ok) {
		\Api\returnSuccess($res->data);
	} else {
		\Api\returnError($res->errMsg);
	}
?>