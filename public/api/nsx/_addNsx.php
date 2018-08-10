<?php
	$checkParam = new CheckParam(["ten_nsx", "thong_tin"], "POST");
	if (!$checkParam->isOK())
	{
		$msgerr = "";
		foreach ($checkParam->listInvalid as $name)
			$msgerr = $msgerr." ".$name;
		echo json_encode([
			"err"=>true,
			"msg"=>"missing or invalid parameters: ".$msgerr
		]);
		exit();
	}
	$ten_nsx 	=  trim($_POST["ten_nsx"]);
	$thong_tin 	=  trim($_POST["thong_tin"]);

	//connect and fetch data to database
	$sql = new mSQL();
	if ($sql->isError())
	{
		echo json_encode([
			"err"=>true,
			"msg"=>"Connect error: ".$sql->errText()
		]);
		exit();
	}

	$ret = $sql->query("SELECT * FROM nsx WHERE ten = '$ten_nsx'");
	if (pg_num_rows($ret) > 0) {
		throwErrJson("Nhà sản  xuất đã có rồi");
	}

	$sql->query("INSERT INTO nsx (ten, thong_tin) VALUES ('$ten_nsx', '$thong_tin')");

	if ($sql->isError())
	{
		echo json_encode([
			"err"=>true,
			"msg"=>$sql->errText()
		]);
		exit();
	}

	echo json_encode([
		'err'=>false,
		'msg'=>'them nsx thanh cong'
	]);
?>