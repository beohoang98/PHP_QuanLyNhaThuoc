<?php
	require "../api/_checkSessionCode.php";
?>
<html>
<head>
    <link href="/static/bootstrap/css/bootstrap.min.css" rel="stylesheet">
	<link rel="stylesheet" href="/static/fontawesome/fontawesome-all.min.css">
	<link rel="stylesheet" href="/static/lib/lib.css">
	
	<script src="/static/jquery/jquery-3.3.1.min.js"></script>
	<script src="/static/lib/lib.js"></script>
	<link rel="stylesheet" href="/css/style.min.css">
    
    <style media="screen">
        body {
            background-color: #f8f8f8;
        }
		#nhapinput-cost {
			width: 200px;
		}
		footer {
			position: absolute;
			padding: 1em;
			width: 100%;
			bottom: 0;
			left: 0;
		}
		table thead, table tbody tr {
			display: table;
			table-layout: fixed;
			width: 100%;
		}
		table tbody {
			display: block;
			overflow: auto;

			max-height: 300px;
		}
    </style>
</head>
<body>
	<div class="bg-dark text-center text-light">
        <h2>NHẬP HÓA ĐƠN</h2>
    </div>
	<div class="container scrollable">

		<!-- Hien thi thong tin -->
		<div class="row">
			<div class="col-md-3">
				<div><strong>USER:</strong></div>
				<div id='username'></div>
			</div>
			<div class="col-md-3">
				<div><strong>TIME:</strong></div>
				<div id="time-date"></div>
				<div id="time-time"></div>
			</div>
			<div class="form-group col-md-3">
				<div><strong>GHI CHÚ:</strong></div>
				<textarea class='form-control' id="ghichu" cols="30" rows="2"></textarea>
			</div>
			<div class='col-md-3'>
				<div class="form-group">
					<label for="kieu-lieu">
						<input type="radio" name="kieu" value="lieu" id="kieu-lieu">
						BÁN THEO LIỀU
					</label>
				</div>
				<div class="form-group">
					<label for="kieu-banle">
						<input type="radio" name="kieu" value="banle" id="kieu-banle">
						BÁN LẺ
					</label>
					
				</div>
			</div>
		</div>

		<!-- Bang nhap -->
		<form id='form-nhap' action="#" class='relative-par'>
			<button type="submit" style='display: none'></button>
			<table id="table-nhap" class="table table-striped">
				<thead class='sticky'>
					<tr>
						<th>Mã thuốc</th>
						<th>Tên thuốc</th>
						<th>Đơn vị</th>
						<th>Số lượng</th>
						<th>Thành tiền</th>
					</tr>
					<tr>
						<td>
							<input class='form-control' id="ma_thuoc" name='ma_thuoc' type="number" required/>
						</td>
						<td>
							<input class='form-control' id="ten_thuoc" name='ten_thuoc' type="text" required/>
						</td>
						<td>
							<select class='form-control' name="don_vi" id="don_vi" component="DonVi"></select>
						</td>
						
						<td>
							<input class='form-control' name='so_luong' type="number" value=1 min=1 required/>
						</td>
						<td>
							<input class='form-control' id="cost" name="cost" type="number" value=1 min=1 readonly required/>
						</td>
						<td>
							<button class="btn btn-dark">
								<i class="fa fa-plus"></i>
							</button>
						</td>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</form>

		<footer class='footer'>
			<form id='hoadon-form' class="form row">
				<div class="col-md-3 form-group">
					<label for='sum'>TỔNG: </label>
					<input type="text" name="sum" id="sum" class='form-control' readonly value=0 >
				</div>
				<div class="col-md-3 form-group">
					<label for="tienkh-tra">TIỀN KHÁCH ĐƯA</label>
					<input id='tienkh-tra' class='form-control' type="text" step=500 value=0>
				</div>
				<div class="col-md-3 form-group">
					<label for="thoitien">THỒI TIỀN:</label>
					<input id="thoitien" name='thoitien' type='text' class='form-control' readonly>
				</div> 
				<div class="col-md-3 form-group">
					<br>
					<input class='form-control btn btn-dark btn-outline-dark' type="submit" value="Thanh toán">
				</div>
			</form>
		</footer>
	</div>
	<script type='module' src='script.js'></script>
</body>
</html>
