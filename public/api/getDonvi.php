<?php
	header("Access-Control-Allow-Origin: *");
	header("Content-Type: application/json; charset=UTF-8");
	require_once "_checkSessionForApi.php";

	$sql = new mSQL();
	if ($sql->isError())
	{
		echo json_encode([
			"err"=>true,
			"msg"=>"Cannot connect to database"
		]);
		exit();
	}

	$sql->query("SELECT * FROM don_vi");
	
	if ($sql->isError())
	{
		echo json_encode([
			"err"=>true,
			"msg"=>"Cannot connect to database"
		]);
		exit();
	}

	echo json_encode([
		"err"=>false,
		"data"=>$sql->getArrayResult()
	]);
?>