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
	<script src="Donvi.js"></script>
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
	<script defer>
		function fetchToTable(data) {
			$("#table-body").children().remove();
			$('.will-be-update').remove();

			for (let id of Object.keys(data))
			{
				let ten = data[id]['ten'];
				let quydoiText = data[id]['quydoiText'];

				let row = $("<tr/>");
				row.append($('<td/>').text(id))
					.append($('<td/>').text(ten))
					.append($('<td/>').text(quydoiText));

				let opt = $('<option/>').val(id).text(ten).addClass('will-be-update');
				$("#id_quy_doi").append(opt);
				
				$('#table-body').append(row);
			}
		}

		$(document).ready(async ()=>{
			const bangDonvi = new BangDonVi();
			bangDonvi.addDatabaseURL('/api/getDonvi.php');
			await bangDonvi.update();
			fetchToTable(bangDonvi.table);
			
			const popup = new StatusPopup();
			popup.create();

			$("#form").on('submit', (e)=>{
				e.preventDefault();

				const ten_don_vi = $('#ten_don_vi').val();
				const id_quy_doi = $('#id_quy_doi').val();
				const he_so_quydoi = id_quy_doi == "null" ? 0 : $("#he_so_quydoi").val(); 

				$.ajax('/api/addDonvi.php', {
					method: 'post',
					xhrFields: {
						withCredentials: 'include'
					},
					data: `ten_don_vi=${ten_don_vi}&id_quy_doi=${id_quy_doi}&he_so_quydoi=${he_so_quydoi}`,
					success: function(json) {
						if (!!json.err) {
							popup.setStatus(false, json.msg);
							popup.show();
							return;
						}

						parent.postMessage({
							msg: 'update'
						}, "*");

						popup.setStatus(true, json.msg);
						popup.show();
						setTimeout(()=>{
							popup.hide()
						}, 1000);

						$("input").val("");
						$("#id_quy_doi").val("null");
					},
					error: function(err) {
						popup.setStatus(false, err.responseText);
						popup.show();

						return;
					}
				})
			});


			//on input quy doi don vi
			$('#id_quy_doi').on('change', function(e){
				let val = $(this).val();
				$('#he_so_quydoi').prop('disabled', val == 'null');
			});

			//update data request
            window.addEventListener('message', async function(e) {
                let data = e.data;
                if (data.msg == 'update') {
					await bangDonvi.update();
					fetchToTable(bangDonvi.table);
                }
            });
		});
	</script>
</body>
</html>