<?php
$qlnt = new \Api\QLNT();
$data = $qlnt->getDonVi();

\Api\returnSuccess($data);
