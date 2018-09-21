<?php
use \PHPUnit\Framework\TestCase;

$_SERVER["DOCUMENT"] = (__DIR__."/..");
require_once __DIR__."/../src/connect_app/index.php";

class CTHDTest extends TestCase
{
    public function testConstruct()
    {
        $cthd = new \App\CTHoaDon("ABC001", 3000, 2);
        $val = $cthd->toArray();
        $expected = [
            "ma_thuoc"=>"ABC001",
            "don_gia"=>3000,
            "so_luong"=>2
        ];
        $this->assertEquals($val, $expected);
    }
}
