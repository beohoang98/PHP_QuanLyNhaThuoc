<?php

namespace App;

class CTHoaDon
{
    private $maThuoc;
    private $soLuong;
    private $gia;

    public function __construct($ma, $gia, $sl)
    {
        $this->maThuoc = $ma;
        $this->soLuong = $sl;
        $this->gia = $gia;
    }

    public function toArray(): array
    {
        return [
            "ma_thuoc"=>$this->maThuoc,
            "so_luong"=>$this->soLuong,
            "don_gia"=>$this->gia
        ];
    }

    public function getGia()
    {
        return $this->gia * $this->soLuong;
    }
}
