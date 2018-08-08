<?php
function throwErrJson($msg)
{
	echo json_encode([
		"err"=>true,
		"msg"=>$msg
	]);
	exit();
}