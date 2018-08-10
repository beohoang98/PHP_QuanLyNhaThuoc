<?php
	$sql = new mSQL();
	if ($sql->isError())
	{
		echo json_encode([
			"err"=>true,
			"msg"=>"Cannot connect to database"
		]);
		exit();
	}

	$sql->query("SELECT * FROM nsx;");
	
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