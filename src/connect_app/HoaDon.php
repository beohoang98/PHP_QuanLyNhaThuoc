<?php

namespace App;

require_once __DIR__."/CTHoaDon.php";

class HoaDon
{
    // const enum
    const BAN_LE = 0;
    const BAN_LIEU = 1;
    const BAN_DEFAULT = HoaDon::BAN_LIEU;

    // member
    private $id;
    private $listCTHD = [];
    private $loai = HoaDon::BAN_DEFAULT;
    private $tongGia = 0;
    private $customGia;

    public function __construct($giaCustom = 8000)
    {
        $this->customGia = $giaCustom;
    }

    public function getListCTHD()
    {
        return $this->listCTHD;
    }

    public function getLoai()
    {
        return $this->loai;
    }

    public function getTongGia()
    {
        return $this->tongGia;
    }

    public function addCTHD(CTHoaDon $cthd)
    {
        array_push($this->listCTHD, $cthd);
        $this->updateTongGia();
    }

    public function setLoai(int $loai)
    {
        $this->loai = $loai;
        $this->updateTongGia();
    }

    public function toArray(): array
    {
        $cthdArr = array_map(function ($val) {
            return $val->toArray();
        }, $this->listCTHD);

        return [
            // "id"=>$this->id,
            "loai"=>$this->loai,
            "tongGia"=>$this->tongGia,
            "customGia"=>$this->customGia,
            "cthd"=>$cthdArr
        ];
    }

    private function updateTongGia()
    {
        $tong = 0;
        foreach ($this->listCTHD as $cthd) {
            $tong += $cthd->getGia();
        }
        if ($this->loai === HoaDon::BAN_LE) {
            $this->tongGia = $tong;
        } elseif ($this->loai === HoaDon::BAN_LIEU) {
            $this->tongGia = $this->customGia;
        }
    }
}
