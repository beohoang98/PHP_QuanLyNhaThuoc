<?php
	header("Access-Control-Allow-Origin: *");
	header("Content-Type: application/json; charset=UTF-8");
	//check session
	require_once "_checkSessionForApi.php";

	if (!isset($_POST['data']))
	{
		throwErrJson("missing post data");
	}

	$data = json_decode($_POST['data'], true);
	$hoadon = $data['hoa_don'];	
	$cthd = $data['cthd'];

	echo json_encode([
		"err"=>false,
		"data"=>$hoadon,
		'cthd'=>$cthd
	])
?>