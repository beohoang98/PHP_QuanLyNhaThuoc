import {CTHoaDon} from './CTHoaDon.js';
// import $ from 'jquery';

/**
 * Hóa Đơn Form
 */
const _HoaDonForm = class {
	private _username		: string;
	private _ghiChu			: string;
	private _listCTHD 		: any;
	private _database		: string;

	private _headerForm		: HTMLFormElement | undefined;
	private _CTHDTable		: HTMLTableElement | undefined;

	public constructor() {
		this._database = "/api/addHoaDon.php";
		const match = document.cookie.match(/username=(\w+)/);

		this._username = match ? match[1] : "";
		this._listCTHD = {}; //Object because data has key 'ma_thuoc'

		this._headerForm = undefined;
		this._CTHDTable = undefined;

		this._ghiChu = "";
	}

	public setHeader(element: HTMLFormElement)
	{
		this._headerForm = element;
		
		this._headerForm.addEventListener('submit', (e)=>{
			e.preventDefault();
			if (!e.target) return;

			const dataArr = $(e.target).serializeArray();
			const dataObj:any = {};
			dataArr.forEach((val:{name: any, value: any})=>{
				dataObj[val.name] = val.value;
			});

			this.addCTHD(+dataObj['ma_thuoc'],
						dataObj['ten_thuoc'],
						+dataObj['so_luong'],
						+dataObj['don_vi'],
						+dataObj['cost']);
		});
	}

	public setTable(element : HTMLTableElement)
	{
		this._CTHDTable = element;
	}

	public getUsername()
	{
		return this._username;
	}


	public newHoaDon()
	{
		for (let el in this._listCTHD) {
			this._listCTHD[el].remove();
		}
	}
	/**
	 * get total cash of 1 HoaDon
	 */
	public getTotalCash() {
		let sum = 0;

		for (const ma_thuoc of Array.from(Object.keys(this._listCTHD))) {
			const cthd = this._listCTHD[ma_thuoc];
			sum += cthd.totalCash;
		}

		return sum;
	}

	/**
	 * 
	 * @param {number} ma_thuoc 
	 * @param {number} soluong 
	 * @param {number} donvi 
	 * @param {number} totalCash 
	 */
	public addCTHD(ma_thuoc: number, ten_thuoc: string, soluong: number, donvi: number, totalCash: number)
	{
		if (this._listCTHD.hasOwnProperty(ma_thuoc)) {
			const newSl = this._listCTHD[ma_thuoc].sl + soluong;
			this._listCTHD.ma_thuoc.updateValue('so_luong', newSl);
		}
		else {
			const newCTHD = new CTHoaDon(ma_thuoc, ten_thuoc, donvi, soluong, totalCash*soluong);
			this._listCTHD[ma_thuoc] = newCTHD;
			const rowElement = newCTHD.getRowElement();
			
			if (!this._CTHDTable || !rowElement) return;
			this._CTHDTable.tBodies[0].insertBefore(rowElement, this._CTHDTable.tBodies[0].childNodes[0]);
		}
	}

	/**
	 * 
	 */
	public pushToDatabase(successCallback: Function, errorCallback: Function)
	{
		const hoaDonInfo = {
			username: this._username,
			time: (new Date()).getTime(),
			ghichu: this._ghiChu
		}
		const data = {
			hoa_don: hoaDonInfo,
			cthd: this._listCTHD
		}

		$.ajax(this._database, {
			method: 'POST',
			xhrFields: {
				withCredentials: true
			},
			data: "data="+JSON.stringify(data),
			dataType: "json",
			success: (json: any)=>{
				if (!!json.err) {
					errorCallback(json.msg);
					return;
				}
				successCallback();
			},
			error: (err: any)=>{
				errorCallback(err);
			}
		});
	}
}

export { _HoaDonForm as HoaDonForm };