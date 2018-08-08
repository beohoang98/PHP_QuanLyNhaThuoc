<div class="text-center bg-dark text-light">
	<h2>THÊM ĐƠN VỊ</h2>
</div>
<div class="container">
	<form id="nhap_don_vi--form" action="#" role="form" class="form">
		<div class="form-group">
			<label for="ten_don_vi">Tên Đơn vị (*)</label>
			<input class='form-control' type="text" id='nhap_don_vi--ten_don_vi' name='ten_don_vi' required>
		</div>
		<div class="form-group row">
			<div class="col-md-6">
				<label for="id_quy_doi">Đơn vị quy đổi</label>
				<select class='form-control' name="id_quy_doi" id="nhap_don_vi--id_quy_doi" required>
					<option value="null" selected>Đơn vị cơ bản</option>
				</select>
			</div>
			<div class="col-md-6">
				<label for="he_so_quydoi">Hệ số quy đổi</label>
				<input class='form-control' type="number" id='nhap_don_vi--he_so_quydoi' name='he_so_quydoi' min='0' step='0.1' disabled required>
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
			<tbody id='nhap_don_vi--table-body'>
			</tbody>
		</table>
	</div>
</div>