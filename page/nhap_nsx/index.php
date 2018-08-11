<div class="text-center bg-dark text-light">
	<h2>THÊM NHÀ SẢN XUẤT</h2>
</div>
<div class="container">
	<form id="form" action="#" role="form" class="form">
		<div class="form-group">
			<label for="ten_nsx">Tên Nhà sản xuất (*)</label>
			<input class='form-control' type="text" id='ten_nsx' name='ten_nsx' required>
		</div>
		<div class="form-group">
			<label for="thong_tin">Thông tin thêm</label>
			<textarea rows="5" class="form-control" id='thong_tin' name='thong_tin'></textarea>
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
				max-height:200px;
				overflow-y:auto;
			}
			#table-head, #table-body > tr {
				display: table;
				width: 100%;
				table-layout:fixed;
			}
		</style>
		<h3>NHÀ SẢN XUẤT ĐÃ CÓ</h3>
		<table class="table table-striped">
			<thead id='table-head'>
				<tr>
					<th>ID</th>
					<th>Tên</th>
					<th>Thông tin</th>
				</tr>
			</thead>
			<tbody id='table-body'>
			</tbody>
		</table>
	</div>
</div>