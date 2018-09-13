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
    private $listCTHD;
    private $loai;
    private $tongGia;
    private $customGia;

    public function __contruct($giaCustom = 8000)
    {
        $this->listCTHD = [];
        $this->loai = BAN_DEFAULT;
        $this->tongGia = 0;
        $this->customGia = $giaCustom;
    }

    public function getListCTHD()
    {
        return $this->lishCTHD;
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

    public function setLoai(string $loai)
    {
        $this->loai = $loai;
        $this->updateTongGia();
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
