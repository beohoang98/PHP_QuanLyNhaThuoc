<?php
	require "../api/_checkSessionCode.php";
?>
<html>
<head>
	<meta charset='utf-8'>
    <link href="/static/bootstrap/css/bootstrap.min.css" rel="stylesheet">
	<link rel="stylesheet" href="/static/fontawesome/fontawesome-all.min.css">
	<link rel="stylesheet" href="/static/tabulator/css/tabulator.min.css">
	<link rel="stylesheet" href="/static/jqueryui/jquery-ui.min.css">
	<link rel="stylesheet" href="/static/lib/lib.css">
	
	<script src="/static/jquery/jquery-3.3.1.min.js"></script>
	<script src="/static/jqueryui/jquery-ui.min.js"></script>

	<script src="/static/tabulator/js/tabulator.min.js"></script>
	<script src="/static/lib/lib.js"></script>
	<style>
		table tbody {
			display: block;
			width: 100%;
			overflow-y: auto;
			height: 300px;
		}
		table thead, table tr {
			display: table;
			width: 100%;
			table-layout: fixed;
		}
	</style>
</head>
<body>
	<div class="jumbotron bg-dark text-light text-center">
		<h2>TEST APP</h2>
	</div>
	<div class="container">
		<div class="row">
			<div class="col-md-6">
				<h2>THUỐC</h2>
				<table id="thuoc" component="Thuoc" class="table table-striped table-hover">
					<thead>
						<tr>
							<th for="ma_thuoc">ID</th>
							<th for="ten_thuoc">Tên thuốc</th>
							<th for="ten_nsx">NSX</th>
							<th for="ten_don_vi">Đơn vị</th>
							<th for="don_gia">Đơn giá</th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
			</div>
			<div class="col-md-6">
				<h2>ĐƠN VỊ</h2>
				<table id="donvi" component="DonVi" class="table table-striped">
					<thead>
						<tr>
							<th for='id'>ID</th>
							<th for='ten'>Tên</th>
							<th for='textQuyDoi'>Quy đổi</th>
						</tr>
					</thead>
					<tbody></tbody>
				</table>
			</div>
		</div>


		<div>
			<h2>ĐƠN VỊ</h2>
			<table id="nsx" component="Nsx" class="table table-striped">
				<thead>
					<tr>
						<th for='id'>ID</th>
						<th for='ten'>Tên</th>
						<th for='thong_tin'>Thông tin</th>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
		</div>

		<select id="don_vi_input" class="form-control" component="DonVi"></select>
		<select id="test_thuoc" class="form-control" component="Thuoc"></select>
	</div>

	<script type='module'>
		import {QLNT} from '/static/app/App.js';
		const App = new QLNT();

		$(document).ready(()=>{
			App.addTable($("#thuoc").get(0));
			App.addTable($("#donvi").get(0));
			App.addTable($("#nsx").get(0));

			App.addSelectInput($("#don_vi_input").get(0), {
				title: 'ten',
				value: 'id'
			});

			App.addSelectInput($("#test_thuoc").get(0), {
				title: 'ten_thuoc',
				value: 'ma_thuoc'
			});

			App.onUpdateAll();
		});
	</script>
</body>
</html>