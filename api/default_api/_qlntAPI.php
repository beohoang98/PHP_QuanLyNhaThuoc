<?php
namespace Api;

require_once "connectdb.php";

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
        $res = $this->dbconn->query("SELECT thuoc.ma as ma, thuoc.ten as ten, ncc.ten as 'ten_ncc',
                        IFNULL(bang_gia.price,'chua_cap_nhat') as 'don_gia',
                        IFNULL(kho_thuoc.so_luong, 0) as 'so_luong'
                    FROM thuoc
                    LEFT JOIN ncc ON thuoc.id_ncc = ncc.id
                    LEFT JOIN kho_thuoc ON thuoc.ma = kho_thuoc.ma_thuoc
                    LEFT JOIN bang_gia ON thuoc.ma = bang_gia.ma_thuoc
                        AND (bang_gia.edit_id, thuoc.ma) IN (
                            SELECT MAX(edit_id), ma_thuoc FROM bang_gia bg GROUP BY ma_thuoc
                        )
                    WHERE thuoc.ten LIKE '$search%' OR thuoc.ma LIKE '$search%' OR thuoc.viet_tat LIKE '$search%'
                    ORDER BY thuoc.ten")
            ->skip($offset)
            ->limit($limit)
            ->execute();
        
        return $res->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function themThuoc(string $ma, int $so_luong)
    {
        $res = $this->dbconn->table("kho_thuoc")->find(["ma_thuoc"=>"'$ma'"])->execute();
        if ($res->rowCount() === 0) {
            throw new \Exception(" '$ma' khong ton tai de nhap them");
        }

        $soLuongCu = $res->fetchAll(\PDO::FETCH_ASSOC)[0]["so_luong"];
        $soLuongMoi = $soLuongCu + $so_luong;

        $this->dbconn->table("kho_thuoc")->update(["ma_thuoc"=>"'$ma'"], ["so_luong"=>$soLuongMoi]);
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

    public function suaThongTinThuoc()
    {
        //
    }
}
