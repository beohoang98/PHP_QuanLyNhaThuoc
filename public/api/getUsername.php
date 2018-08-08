<?php
	header("Access-Control-Allow-Origin: *");
	header("Content-Type: application/json; charset=UTF-8");

	require_once "_checkSessionForApi.php";

	echo json_encode([
		"err"=>false,
		"username"=>$_SESSION['username']
	])
?>