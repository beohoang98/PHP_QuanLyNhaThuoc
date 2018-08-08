import {HoaDonForm} from '/static/app/HoaDonForm.js';
import {QLNT} from '/static/app/App.js';

const hoaDonForm = new HoaDonForm();
const App = new QLNT();

function displayTime() {
	let now = new Date();
	$("#time-date").text(now.toLocaleDateString());
	$("#time-time").text(now.toLocaleTimeString());
}

function loopShowTime() {
	let id = setInterval(()=>{
		displayTime();
	}, 1000);
}

function displayUser() {
	let username = hoaDonForm.getUsername();
	$("#username").text(username);
}

function focusTenThuocFirst() {
	$("#ten-thuoc").focus();
}

function updateTongGia()
{
	let tong = 0;
	let list = document.querySelectorAll('.cthd-gia');
	for (let val of list) {
		let gia = parseInt(val.textContent.replace(/\D/, ''));
		tong += gia;
	}
	const val = tong.toLocaleString()+' VNĐ'

	$("#sum").attr('curVal', val)	
	if (!$('#kieu-lieu')[0].checked) $('#sum').val(val);
}

function updateTienThoi()
{
	let sum = $("#sum").val().replace(/[\D\s]/g, '');
	let tienkh = $("#tienkh-tra").val().replace(/[\D\s]/g, '');

	let tienThoi = parseInt(tienkh) - parseInt(sum);
	tienThoi = tienThoi >= 0 ? tienThoi.toLocaleString() : '~loi';

	$("#thoitien").val(tienThoi);
}

$(document).ready(function(){
	//------------------------
	loopShowTime();
	displayUser();
	focusTenThuocFirst();
	const popup = new StatusPopup();
	popup.create();

	App.addSelectInput($('#don_vi')[0], {
		title: 'ten',
		value: 'id'
	});
	App.onUpdateAll();

	hoaDonForm.setHeader($("#form-nhap").get(0));
	hoaDonForm.setTable($("#table-nhap").get(0));

	$('#tienkh-tra').moneyInput().on('keyup', ()=>{
		updateTienThoi();
	});

	$('#hoadon-form').submit(e=>{
		e.preventDefault();

		hoaDonForm.pushToDatabase(function() {
			$('#hoadon-form').find('input, select').val('');
			$('#form-nhap').find('input, select').val('');
			hoaDonForm.newHoaDon();
			console.log(hoaDonForm);
			
			popup.setStatus(true, "OK");
			popup.show();
		}, (err)=>{

			popup.setStatus(false, err.messageText);
			popup.show();

			console.log(err);
		});
	});

	App.addNameInputThuoc("ten_thuoc", {
		"ma_thuoc": "ma_thuoc",
		"ten_thuoc": "ten_thuoc",
		"ten_don_vi": "ten_don_vi",
		"don_gia": "don_gia"
	}, {
		"ten_thuoc": "ten_thuoc",
		"ma_thuoc": "ma_thuoc",
		"don_vi" : "id_don_vi",
		"cost" : "don_gia"
	});

	$("#form-nhap").on('submit', (e)=>{
		e.preventDefault();
		$("#form-nhap").find('input, select').val('');
		updateTongGia();
	})

	$("#kieu-lieu").click(() => {
		$('#sum').val(8000)
	})
	$('#kieu-banle').click(() => {
		const sum = $('#sum')
		const val = sum.attr('curVal')
		sum.val(val)
	})
	//-----------------------
});