<?php

require_once __DIR__."/../api/default_api/_qlntAPI.php";
$qlnt = new \Api\QLNT();

$data = [
    ["ABC001", "Thuốc sổ mũi", 1, "Dược Cần Thơ", "so", 10, 1000, "admin"],
    ["ABC002", "Thuốc cảm", 1, "Dược Cần Thơ", "cam", 10, 800, "admin"],
    ["ABC003", "Thuốc an thần", 2, "Dược Cần Thơ", "ngu", 10, 1000, "admin"],
    ["ABC004", "Thuốc viêm họng", 1, "Dược Cần Thơ", "vh", 20, 2000, "admin"],
    ["ABC005", "Thuốc đau đầu", 1, "Dược Hậu Giang", "dd", 10, 1200, "admin"],
    ["ABC006", "Thuốc đau chân", 1, "Dược Hậu Giang", "dc", 10, 1100, "admin"],
    ["ABC007", "Thuốc trĩ", 2, "Dược Sài Gòn", "tri", 10, 2000, "admin"],
    ["ABC008", "Thuốc ho", 1, "Dược Sài Gòn", "ho", 10, 500, "admin"],
    ["ABC009", "Thuốc tránh thai", 3, "Dược Bình Dương", "thai", 5, 2000, "admin"],
    ["ABC010", "Thuốc paraxetamol", 3, "Dược Cần Thơ", "para", 10, 2000, "admin"],
    ["ABC011", "Thuốc học giỏi", 1, "Dược Thủ Đức", "hg", 10, 3000, "admin"],
    ["ABC012", "Thuốc điểm cao", 1, "Dược Quận 5", "diem", 10, 3000, "admin"],
    ["ABC013", "Thuốc đẹp trai", 4, "Công ty ABC", "dep", 30, 5000, "admin"],
    ["ABC014", "Thuốc có người yêu", 4, "Công ty XYZ", "ny", 10, 30000, "admin"],
    ["ABC015", "Thuốc chống nhạt", 1, "Nhà làm", "nhat", 10, 50000, "admin"]
];

try {
    foreach ($data as $row) {
        try {
            call_user_func_array([$qlnt, "themMoiThuoc"], $row);
        } catch (PDOException $e) {
            echo "Error: ".$e->getMessage()."\n";
        }
    }
    echo "Done\n";
} catch (Exception $e) {
    echo "Thuoc Data Error: ".$e->getMessage()."\n";
}
