<?php
	header("Access-Control-Allow-Origin: *");
	header("Content-Type: application/json; charset=UTF-8");

	//check parameters
	require_once "_checkParamApi.php";
	//check session
	require_once "_checkSessionForApi.php";

	$checkParam = new CheckParam(["ten_don_vi", "id_quy_doi", "he_so_quydoi"], "POST");
	if (!$checkParam->isOK())
	{
		$msgerr = "";
		foreach ($checkParam->listInvalid as $name)
			$msgerr = $msgerr." ".$name;
		throwErrJson("missing or invalid parameters: ".$msgerr);
	}

	$ten_don_vi 	=  trim($_POST["ten_don_vi"]);
	$id_quy_doi 	=  trim($_POST["id_quy_doi"]);
	$he_so_quydoi 	=  trim($_POST["he_so_quydoi"]);

	if ($id_quy_doi == "null" || $id_quy_doi == null) 
	{
		$id_quy_doi = 'null';
		$he_so_quydoi = 0;
	}
	else {
		if (floatval($he_so_quydoi) <= 0) {
			throwErrJson("He so phai > 0");
		}
		$he_so_quydoi = floatval($he_so_quydoi);
	}


	//connect and fetch data to database
	$sql = new mSQL();
	if ($sql->isError())
	{
		throwErrJson("Connect error: ".$sql->errText());
	}

	if ($id_quy_doi != 'null') {
		$ret = $sql->query("SELECT * FROM don_vi WHERE id = $id_quy_doi");
		if (pg_num_rows($ret) <= 0) {
			throwErrJson('ID Quy doi khong ton tai');
		}
	}
	$ret = $sql->query("SELECT * FROM don_vi WHERE ten = '$ten_don_vi'");
	if (pg_num_rows($ret) > 0) {
		throwErrJson('Tên đơn vị đã tồn tại');
	}

	$sql->query("INSERT INTO don_vi (ten, id_quy_doi, he_so_quydoi) VALUES ('$ten_don_vi', $id_quy_doi, $he_so_quydoi)");
	if ($sql->isError())
	{
		throwErrJson($sql->errText());
	}

	echo json_encode([
		'err'=>false,
		'msg'=>'them nsx thanh cong'
	]);
?>