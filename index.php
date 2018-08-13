<?php
$ROOT = $_SERVER["DOCUMENT_ROOT"];
require $ROOT."/api/_checkSessionCode.php";
$username = $_SESSION['username'];
?>

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="utf-8"/>
    <title>Quan Ly Nha Thuoc</title>
    <?php require $ROOT.'/page/_layouts/meta.php' ?>
</head>
<body class='home'>
    <nav class="bg-dark sidebar" role="navigation">
        <a onclick='togglemenu()' class="btn text-light sidebar-toggle">
            <div class="menu-icon">
                <span class="fa fa-bars"></span>
            </div>
        </a>
        <a data-target="page-nhap-hoa-don" class='sidebar-switch-page btn text-light' title="Nhập hóa đơn">
            <span>NHẬP HÓA ĐƠN</span>
            <div class="menu-icon">
                <span class='fa fa-tachometer-alt'></span>
            </div>
        </a>
        <a data-target="page-nhap-thuoc" class='sidebar-switch-page btn text-light' title="Nhập thuốc mới">
            <span>NHẬP THUỐC</span>
            <div class="menu-icon">
                <span class='fa fa-pills'></span>
            </div>
        </a>
        <a data-target="page-nhap-nsx" class='sidebar-switch-page btn text-light' title="Nhập nhà sản xuất mới">
            <span>NHẬP NSX</span>
            <div class="menu-icon">
                <span class='fa fa-industry'></span>
            </div>
        </a>
        <a data-target="page-nhap-don-vi" class='sidebar-switch-page btn text-light' title="Nhập đơn vị tính mới">
            <span>NHẬP ĐƠN VỊ</span>
            <div class="menu-icon">
                <span class='fa fa-tachometer-alt'></span>
            </div>
        </a>
        <div class="sidebar-last">
            <a href='./page/user/' class="btn text-light" title="Xem thông tin tài khoản">
                <span id="username"><?php echo $username?></span>
                <div class="menu-icon">
                    <span class='fa fa-user'></span>
                </div>
            </a>
            <a href='/logout.php' class="btn text-light" title="Thoát khỏi tài khoản">
                <span>LOGOUT</span>
                <div class="menu-icon">
                    <span class='fa fa-power-off'></span>
                </div>
            </a>
        </div>
    </nav>
    <div class='frame-container'>
        <div class="frame-slide">
            <div class='page' id='page-nhap-hoa-don'>
                <?php require $ROOT."/page/nhap_hoa_don/index.php"?>
            </div>
            <div class='page' id='page-nhap-thuoc'>
                <?php require $ROOT."/page/nhap_thuoc/index.php"?>
            </div>
            <div class='page' id='page-nhap-nsx'>
                <?php require $ROOT."/page/nhap_nsx/index.php"?>    
            </div>
            <div class='page' id='page-nhap-don-vi'>
                <?php require $ROOT."/page/nhap_don_vi/index.php"?>
            </div>
        </div>
    </div>
    <script src="script.js"></script>
    <script src="/public/static/js/bundle.js"></script>
</body>
</html>
