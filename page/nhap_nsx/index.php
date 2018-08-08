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
<script defer>
	$(document).ready(()=>{
		const popup = new StatusPopup();
		popup.create();
		updateNSX();

		function createTableRow(val) {
			let row = $("<tr/>");
			for (let key of Object.keys(val))
			{
				row.append($('<td/>').text(val[key]));
			}
			return row;
		}

		function updateNSX() {
			$('#table-body').children().remove();
			$.getJSON('/public/api/getNsx.php', (json)=>{
				if (!!json.err) {
					popup.setStatus(false, json.msg);
					popup.show();

					return;
				}
				for (let row of json.data) {
					$("#table-body").append(createTableRow(row));
				}
			}).fail(err=>{
				popup.setStatus(false, err.responseText);
				popup.show();

				return;
			});
		}

		$("#form").on('submit', (e)=>{
			e.preventDefault();

			$.ajax('/public/api/addNsx.php', {
				method: 'post',
				xhrFields: {
					withCredentials: 'include'
				},
				data: $("#form").serialize(),
				success: function(json) {
					if (!!json.err) {
						popup.setStatus(false, json.msg);
						popup.show();
						return;
					}

					popup.setStatus(true, json.msg);
					popup.show();
					setTimeout(()=>{
						popup.hide()
					}, 1000);

					$("input, textarea").val("");

					parent.postMessage({
						msg: 'update'
					}, '*');
				},
				error: function(err) {
					popup.setStatus(false, err.responseText);
					popup.show();

					return;
				}
			})
		});

		//update data request
		window.addEventListener('message', function(e) {
			let data = e.data;
			if (data.msg == 'update') {
				updateNSX();
			}
		});
	});
</script>
