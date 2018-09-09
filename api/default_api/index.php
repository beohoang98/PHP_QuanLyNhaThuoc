<?php
namespace Api;

require_once "checkParamApi.php";
require_once "checkSessionForApi.php";
require_once "connectdb.php";
require_once "_returnJSON.php";
require_once "_qlntAPI.php";

function checkSessionAndConnect()
{
    \Api\checkSession();
}

function initHeader()
{
    header("Access-Control-Allow-Origin: /");
    header("Content-Type: application/json; charset=UTF-8");

    set_error_handler(function ($errno, $errstr, $errfile, $errline) {
        throw new \Exception($errstr." File:".$errfile." Line:".$errline);
    });
}
