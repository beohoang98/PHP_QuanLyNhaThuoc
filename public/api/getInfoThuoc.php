<?php
	header("Access-Control-Allow-Origin: *");
	header("Content-Type: application/json; charset=UTF-8");

	//check parameters
	require_once "_checkParamApi.php";

	$checkParam = new CheckParam(["name"], "GET");
	if (!$checkParam->isOK())
	{
		echo json_encode([
			"err"=>true,
			"msg"=>"missing or invalid parameters"
		]);
		exit();
	}

	$name = trim($_GET["name"]);

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

	$sql->query("SELECT thuoc.ma as ma_thuoc, thuoc.ten as ten_thuoc, don_gia
							, nsx.id as id_nsx, don_vi.ten as ten_don_vi, don_vi.id as id_don_vi, nsx.ten as ten_nsx
							FROM thuoc, nsx, don_vi
							WHERE nsx.id = thuoc.nsx AND don_vi.id = thuoc.id_don_vi
							AND (thuoc.ten LIKE N'$name%' OR thuoc.viet_tat LIKE '%$name%')");
	
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