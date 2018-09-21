<?php
use \PHPUnit\Framework\TestCase;

$_SERVER["DOCUMENT"] = (__DIR__."/..");
require_once __DIR__."/../src/connect_app/index.php";

class HoaDonTest extends TestCase
{
    public function testConstructDefault()
    {
        $hoaDon = new \App\HoaDon();
        $expect = [
            "loai"=>\App\HoaDon::BAN_DEFAULT,
            "tongGia"=>0,
            "customGia"=>8000,
            "cthd"=>[]
        ];
        $val = $hoaDon->toArray();
        $this->assertEquals($expect, $val);
    }

    public function testAddOneCTHD()
    {
        $hoaDon = new \App\HoaDon();
        $hoaDon->setLoai(\App\HoaDon::BAN_LE);

        $cthd = new \App\CTHoaDon("ABC001", 1500, 2);
        $hoaDon->addCTHD($cthd);

        $val = $hoaDon->toArray();
        $expect = [
            "loai"=>\App\HoaDon::BAN_LE,
            "tongGia"=>3000,
            "customGia"=>8000,
            "cthd"=> [
                [
                    "ma_thuoc"=>"ABC001",
                    "don_gia"=>1500,
                    "so_luong"=>2
                ]
            ]
        ];

        $val = $hoaDon->toArray();
        $this->assertEquals($expect, $val);
    }
}
