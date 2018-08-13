<?php
	$ROOT = $_SERVER["DOCUMENT_ROOT"];
	session_start();

	//check session exist
	if (!isset($_SESSION) || !isset($_SESSION['username'])) {
		header("Location: /login.php");
	}

	setcookie('username', $_SESSION['username'], 0, "/");
?>