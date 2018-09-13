<?php
namespace Api;

require_once "connectdb.php";
require_once $_SERVER["DOCUMENT_ROOT"]."/src/connect_app/index.php";

/**
 * Quan Ly Nha Thuoc API to Database
 */
class QLNT
{
    private $dbconn;
    private $dbres;

    public $resultArray;
    public $resultInfo;

    public function __construct()
    {
        $this->dbconn = new ConnectDatabase();
    }

    public function __destruct()
    {
        //
    }

    // built-in function
    public function getThuoc(string $search, int $offset = 0, int $limit = 10)
    {
        $res = $this->dbconn
                    ->query("SELECT thuoc.ma as ma, thuoc.ten as ten, ncc.ten as 'ten_ncc', "
                            ."IFNULL(bang_gia.price,'chua_cap_nhat') as 'don_gia', "
                            ."IFNULL(kho_thuoc.so_luong, 0) as 'so_luong', "
                            ."thuoc.id_don_vi as 'id_don_vi' "
                            ."FROM thuoc "
                            ."LEFT JOIN ncc ON thuoc.id_ncc = ncc.id "
                            ."LEFT JOIN kho_thuoc ON thuoc.ma = kho_thuoc.ma_thuoc "
                            ."LEFT JOIN bang_gia ON thuoc.ma = bang_gia.ma_thuoc "
                            ."AND (bang_gia.edit_id, thuoc.ma) IN ( "
                            ."SELECT MAX(edit_id), ma_thuoc FROM bang_gia bg GROUP BY ma_thuoc "
                            .") "
                    ."WHERE thuoc.ten LIKE '$search%' OR thuoc.ma LIKE '$search%' OR thuoc.viet_tat LIKE '$search%' "
                    ."ORDER BY thuoc.ten")
            ->skip($offset)
            ->limit($limit)
            ->execute();
        
        return $res->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function checkThuoc(string $ma)
    {
        $res = $this->dbconn->table("thuoc")->find(["ma"=>"'$ma'"])->execute();
        return $res->rowCount() > 0;
    }

    /**
     * @param ma ma thuoc
     * @param so_luong so luong them vao
     * @return int so luong hien co
     */
    public function themThuoc(string $ma, int $so_luong): int
    {
        $res = $this->dbconn->table("kho_thuoc")->find(["ma_thuoc"=>"'$ma'"])->execute();
        if ($res->rowCount() === 0) {
            throw new \Exception(" '$ma' khong ton tai de nhap them");
        }

        $soLuongCu = $res->fetchAll(\PDO::FETCH_ASSOC)[0]["so_luong"];
        $soLuongMoi = $soLuongCu + $so_luong;

        $this->dbconn->table("kho_thuoc")->update(["ma_thuoc"=>"'$ma'"], ["so_luong"=>$soLuongMoi])->execute();
        
        $res = $this->dbconn->table("kho_thuoc")->find(["ma_thuoc"=>"'$ma'"])->execute();
        $so_luong_sau_khi_them = intval($res->fetchAll(\PDO::FETCH_ASSOC)[0]["so_luong"]);
        if ($soLuongMoi !== $so_luong_sau_khi_them) {
            throw new \Exception("So-luong-moi and So-luong-sau-khi-them not matched");
        }

        return $soLuongMoi;
    }

    public function themMoiThuoc(string $ma, string $ten, int $id_don_vi, string $ncc, string $viet_tat, int $so_luong_ban_dau, int $don_gia_ban_dau, string $username)
    {
        $res = $this->dbconn->table("ncc")->find(["ten"=>"N'$ncc'"])->execute();
        $id_ncc = null;
        if ($res->rowCount() === 0) {
            // have not yet, create new ncc
            $this->dbconn->table("ncc")->insert(["ten"=>"N'$ncc'"])->execute();
            $id_ncc = intval($this->dbconn->lastInsertId());
        } else {
            $id_ncc = intval($res->fetchAll(\PDO::FETCH_ASSOC)[0]["id"]);
        }
        
        $res = $this->dbconn->table("thuoc")->insert([
            "ma"=>"'$ma'",
            "ten"=>"N'$ten'",
            "id_don_vi"=>$id_don_vi,
            "id_ncc"=>$id_ncc,
            "viet_tat"=>"'$viet_tat'"
        ])->execute();

        $this->dbconn->table("kho_thuoc")->insert([
            "ma_thuoc"=>"'$ma'",
            "so_luong"=>$so_luong_ban_dau
        ])->execute();

        $this->dbconn->table("bang_gia")->insert([
            "ma_thuoc"=>"'$ma'",
            "username"=>"'$username'",
            "price"=>$don_gia_ban_dau,
            "thoi_gian"=>"'".date("Y-m-d H:i:s")."'"
        ])->execute();

        return $this->dbconn->lastInsertId();
    }

    /**
     * @param ma ma thuoc
     * @param editInfo ["field"=>value, ...]
     * @return int number of rows affected
     */
    public function suaThongTinThuoc(string $ma, array $editInfo)
    {
        if (isset($editInfo["ncc"])) {
            $ncc = $editInfo["ncc"];
            unset($editInfo["ncc"]);

            $res = $this->getNhaCungCap($ncc);
            if (count($res) === 0) {
                $res = $this->themNhaCungCap($ncc, "");
                $editInfo["id_ncc"] = $res;
            } else {
                $editInfo["id_ncc"] = $res[0]["id"];
            }
        }
        $res = $this->dbconn->table("thuoc")->update(["ma"=>"'$ma'"], $editInfo)->execute();
        return $res->rowCount();
    }

    /**
     * @param ma ma thuoc
     * @param username username of user edit it
     * @param price price apply for thuoc
     * this function will throw exception when error
     */
    public function editPriceThuoc(string $ma, string $username, int $price): boolean
    {
        $res = $this->dbconn->table("thuoc")->find(["ma"=>"'$ma'"])->execute();
        if ($res->rowCount() === 0) {
            throw new Exception("Thuoc '$ma' khong ton tai");
        }

        $res = $this->dbconn->table("bang_gia")->insert([
            "ma_thuoc"=>"'$ma'",
            "price"=>$price,
            "username"=>"'$username'",
            "thoi_gian"=>"'".date("Y-m-d H:i:s")."'"
        ])->execute();

        if ($res->rowCount() === 0) {
            throw new Exception($res->errorInfo());
        }
    }

    public function getDonVi(): array
    {
        $res = $this->dbconn->table("don_vi")->find([])->execute();
        return $this->dbconn->toArray();
    }

    public function getNhaCungCap($name): array
    {
        $res = $this->dbconn->query("SELECT * FROM ncc WHERE ten = '$name';")->execute();
        return $this->dbconn->toArray();
    }

    public function searchNhaCungCap($name): array
    {
        $res = $this->dbconn->query("SELECT * FROM ncc WHERE ten LIKE '$name%';")->execute();
        return $this->dbconn->toArray();
    }

    public function themNhaCungCap($name, $info = ""): int
    {
        $res = $this->dbconn->table("ncc")->insert(["ten"=>$name, "info"=>$info])->execute();
        return $res->lastInsertId();
    }

    public function getBangGia(string $ma_thuoc): array
    {
        $res = $this->dbconn->table("bang_gia")->find(["ma_thuoc"=>$ma_thuoc])->execute();
        return $this->dbconn->toArray();
    }

    public function themChinhGia($ma_thuoc, $gia_moi, $username)
    {
        $res = $this->dbconn->table("thuoc")->find(["ma"=>$ma_thuoc])->execute();
        if ($res->rowCount() === 0) {
            throw new \Exception("Ma thuoc '$ma_thuoc' khong ton tai");
        }

        $res = $this->dbconn->table("bang_gia")->insert([
            "ma_thuoc"=>$ma_thuoc,
            "price"=>$gia_moi,
            "username"=>$username,
            "thoi_gian"=>"".date("Y:m:d H:i:s")
        ])->execute();
    }

    
    // ----------- HOA DON -----------------
    public function themHoaDon(\App\HoaDon $hoadon)
    {
        $res = $this->dbconn->table("hoa_don")->insert([
            "time"=>$hoadon->getTime(),
            "username"=>$hoadon->getUsername(),
            "so_luong"=>$hoadon->getSoLuong(),
            "kieu_ban"=>$hoadon->getLoai(),
            "tong_gia"=>$hoadon->getTongGia()
        ])->execute();

        $idHoaDon = $res->lastInsertId();

        foreach ($hoadon->getListCTHD() as $cthd) {
            $this->dbconn->table("ct_hoa_don")->insert([
                "id_hoa_don"=>$idHoaDon,
                "ma_thuoc"=>$cthd->getMaThuoc(),
                "so_luong"=>$cthd->getSoLuong()
            ])->execute();
        }

        return $idHoaDon;
    }
}
