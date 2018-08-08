<?php
	header("Access-Control-Allow-Origin: *");
	header("Content-Type: application/json; charset=UTF-8");

	require_once "_checkSessionForApi.php";

	$sql = new mSQL();
	if ($sql->isError())
	{
		throwErrJson("Cannot connect to database");
	}

	$sql->query("SELECT thuoc.ma as ma_thuoc, thuoc.ten as ten_thuoc
							, don_vi.ten as ten_don_vi, don_vi.id as id_don_vi, don_gia
							, nsx.id as id_nsx, nsx.ten as ten_nsx
							FROM thuoc, nsx, don_vi
							WHERE nsx.id = thuoc.nsx AND don_vi.id = thuoc.id_don_vi");
	
	if ($sql->isError())
	{
		throwErrJson($sql->errText());
	}

	echo json_encode([
		"err"=>false,
		"data"=>$sql->getArrayResult()
	]);
?>