<?php
	require "./api/_checkSessionCode.php";

	$username = $_SESSION['username'];
?>

<!DOCTYPE html>
<html lang="vi">
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta charset="utf-8"/>
	<title>Quan Ly Nha Thuoc</title>
	<link href="/static/bootstrap/css/bootstrap.min.css" rel="stylesheet">
	<link rel="stylesheet" href="/static/fontawesome/fontawesome-all.min.css">
	<link rel="stylesheet" href="/static/jquery/jquery-ui.min.css">
	<script src="/static/jquery/jquery-3.3.1.min.js"></script>
	<script src="/static/jquery/jquery-ui.min.js"></script>
	<link rel="stylesheet" href="/static/css/style.min.css">
</head>
<body class='home'>
	<nav class="bg-dark sidebar" role="navigation">
		<a onclick='togglemenu()' class="btn text-light sidebar-toggle">
			<div class="menu-icon">
				<span class="fa fa-bars"></span>
			</div>
		</a>
		<a onclick="nhapHoaDon()" class='btn text-light' title="Nhập hóa đơn">
			<span>NHẬP HÓA ĐƠN</span>
			<div class="menu-icon">
				<span class='fa fa-tachometer-alt'></span>
			</div>
		</a>
		<a onclick="nhapThuoc()" class='btn text-light' title="Nhập thuốc mới">
			<span>NHẬP THUỐC</span>
			<div class="menu-icon">
				<span class='fa fa-pills'></span>
			</div>
		</a>
		<a onclick="nhapNSX()" class='btn text-light' title="Nhập nhà sản xuất mới">
			<span>NHẬP NSX</span>
			<div class="menu-icon">
				<span class='fa fa-industry'></span>
			</div>
		</a>
		<a onclick="nhapDonVi()" class='btn text-light' title="Nhập đơn vị tính mới">
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
			<div>
				<iframe id="frameNhapHoaDon" src="/page/nhap_hoa_don/" scrolling="auto" onload="resizeiframe(this);"></iframe>
			</div>
			<div>
				<iframe id="frameNhapThuoc" src="/page/nhap_thuoc/" scrolling="auto" onload="resizeiframe(this);"></iframe>
			</div>
			<div>
				<iframe id="frameNhapNSX" src="/page/nhap_nsx/" scrolling="auto" onload="resizeiframe(this);"></iframe>
			</div>
			<div>
				<iframe id="frameNhapDonVi" src="/page/nhap_don_vi/" scrolling="auto" onload="resizeiframe(this);"></iframe>
			</div>
		</div>
	</div>
	<script src="script.js"></script>
</body>
</html>
