<?php
$checkParam = new \Api\CheckParam([
    "id", // id of nsx
    "fields" // fields will be update
], "PUT");

if (!$checkParam->isOK()) {
    \Api\returnError($checkParam->getErrMsg());
}

$id = $_PUT["id"];
$fields = json_decode($_PUT["fields"], true);

$database = new ConnectDatabase();
$response = $database->table("ncc")
                    ->update(["id"=>$id], ["fields"=>$fields])
                    ->execute();

if ($response->ok) {
    \Api\returnSuccess($response->data);
} else {
    \Api\returnError($response->errMsg);
}
