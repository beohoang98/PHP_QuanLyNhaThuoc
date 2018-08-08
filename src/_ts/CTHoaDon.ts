const _CTHoaDon = class {
	private ma : number;
	private ten : string;
	private donvi : number;
	private sl : number;
	private thanhtien : number;
	private _element : HTMLElement | null;
	private _childElement : any;


	constructor(ma : number = -1, ten : string = "", 
				donvi : number = -1, sl : number = 0, thanhtien : number = 0)
	{
		this.ma = ma;
		this.ten = ten;
		this.donvi = donvi;
		this.sl = sl;
		this.thanhtien = thanhtien;
		this._childElement = {};
		this._element = null;

		this.createElement();

		this.updateAllValue(ma, ten, donvi, sl, thanhtien);
	}

	/**
	 * create row element for table
	 */
	public createElement()
	{
		this._element = document.createElement('tr');

		const maTD 		= document.createElement('td');
		const tenTD 	= document.createElement('td');
		const donviTD 	= document.createElement('td');
		const slTD 		= document.createElement('td');
		const tienTD	= document.createElement('td');

		maTD	.classList.add('cthd-mthuoc');
		tenTD	.classList.add('cthd-tthuoc');
		donviTD	.classList.add('cthd-donvi');
		slTD	.classList.add('cthd-sl');
		tienTD	.classList.add('cthd-gia');

		this._element.appendChild(maTD);
		this._element.appendChild(tenTD);
		this._element.appendChild(donviTD);
		this._element.appendChild(slTD);
		this._element.appendChild(tienTD);

		this._childElement = {
			"ma_thuoc" 	: maTD,
			"ten_thuoc" : tenTD,
			"don_vi" 	: donviTD,
			"so_luong" 	: slTD,
			"thanhtien" : tienTD
		}
	}

	public getRowElement()
	{
		return this._element;
	}


	/**
	 * 
	 */
	public remove()
	{
		if (!this._element) return;
		const parent = this._element.parentNode;
		if (parent) parent.removeChild(this._element);
	}

	/**
	 * get json data for post form
	 */
	public getDataJSON()
	{
		return {
			'ma_thuoc': this.ma,
			'ten_thuoc'	: this.ten,
			'don_vi'	: this.donvi,
			'so_luong'	: this.sl
		};
	}

	/**
	 * 
	 * @param ma 
	 * @param ten 
	 * @param donvi 
	 * @param sl 
	 * @param thanhtien 
	 */
	public updateAllValue(ma : number, ten : string, 
		donvi : number, sl : number, thanhtien : number)
	{
		this.ma = ma;
		this.ten = ten;
		this.donvi = donvi;
		this.sl = sl;
		this.thanhtien = thanhtien;

		this._childElement['ma_thuoc'].textContent = ma + "";
		this._childElement['ten_thuoc'].textContent = ten + "";
		this._childElement['don_vi'].textContent = donvi + "";
		this._childElement['so_luong'].textContent = sl + "";
		this._childElement['thanhtien'].textContent = thanhtien + "";
	}

	public updateValue(name : string, value: any)
	{
		switch (name)
		{
			case "ma_thuoc"		: this.ma = value;break;
			case "ten_thuoc"	: this.ten = value;break;
			case "don_vi"		: this.donvi = value;break;
			case "so_luong"		: this.sl = value;break;
			case "thanh_tien"	: this.thanhtien = value;break;
		}
		this._childElement[name].textContent = value;
	}
}

export { _CTHoaDon as CTHoaDon };