<?php
	require $_SERVER['DOCUMENT_ROOT']."\\public\\api\\_checkSessionCode.php";
?>
<html>
<head>
	<?php require $_SERVER['DOCUMENT_ROOT'].'\\page\\_layouts\\meta.php' ?>
	<script src="/public/static/js/Donvi.js"></script>
</head>
<body>
	<div class="text-center bg-dark text-light">
		<h2>THÊM ĐƠN VỊ</h2>
	</div>
	<div class="container">
		<form id="form" action="#" role="form" class="form">
			<div class="form-group">
				<label for="ten_don_vi">Tên Đơn vị (*)</label>
				<input class='form-control' type="text" id='ten_don_vi' name='ten_don_vi' required>
			</div>
			<div class="form-group row">
				<div class="col-md-6">
					<label for="id_quy_doi">Đơn vị quy đổi</label>
					<select class='form-control' name="id_quy_doi" id="id_quy_doi" required>
						<option value="null" selected>Đơn vị cơ bản</option>
					</select>
				</div>
				<div class="col-md-6">
					<label for="he_so_quydoi">Hệ số quy đổi</label>
					<input class='form-control' type="number" id='he_so_quydoi' name='he_so_quydoi' min='0' step='0.1' disabled required>
				</div>
			</div>
			<div class="form-group">
				<button class="form-control btn btn-dark btn-outline-dark" type="submit" name="button">THÊM</button>
			</div>
		</form>
		<div>
			<!-- table style -->
			<style>
				#table-body {
					display: block;
					width: 100%;
					max-height:300px;
					overflow-y:auto;
				}
				#table-head, #table-body > tr {
					display: table;
					width: 100%;
					table-layout:fixed;
				}
			</style>
			<h3>ĐƠN VỊ ĐÃ CÓ</h3>
			<table class="table table-striped">
				<thead id='table-head'>
					<tr>
						<th>ID</th>
						<th>Tên</th>
						<th>Quy đổi</th>
					</tr>
				</thead>
				<tbody id='table-body'>
				</tbody>
			</table>
		</div>
	</div>
	<script src="/public/static/js/nhap-don-vi.js"></script>
</body>
</html>