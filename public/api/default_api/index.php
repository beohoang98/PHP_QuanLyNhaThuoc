<?php
namespace Api;

require_once "checkParamApi.php";
require_once "checkSessionForApi.php";
require_once "connectdb.php";

function checkSessionAndConnect() {
    \Api\checkSession();
    \Api\connectDatabase();
}

function initHeader() {
    header("Access-Control-Allow-Origin: /");
    header("Content-Type: application/json; charset=UTF-8");
}

?>