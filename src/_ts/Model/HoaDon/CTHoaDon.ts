class CTHoaDon {
    private ma: number;
    private ten: string;
    private donvi: number;
    private sl: number;
    private thanhtien: number;
    private element: HTMLElement;
    private childElement: any;

    constructor(ma: number = -1, ten: string = "",
                donvi: number = -1, sl: number = 0, thanhtien: number = 0) {
        this.ma = ma;
        this.ten = ten;
        this.donvi = donvi;
        this.sl = sl;
        this.thanhtien = thanhtien;
        this.childElement = {};
        this.element = null;

        this.createElement();

        this.updateAllValue(ma, ten, donvi, sl, thanhtien);
    }

    /**
     * create row element for table
     */
    public createElement() {
        this.element = document.createElement("tr");

        const maTD 		= document.createElement("td");
        const tenTD 	= document.createElement("td");
        const donviTD 	= document.createElement("td");
        const slTD 		= document.createElement("td");
        const tienTD	= document.createElement("td");

        maTD	.classList.add("cthd-mthuoc");
        tenTD	.classList.add("cthd-tthuoc");
        donviTD	.classList.add("cthd-donvi");
        slTD	.classList.add("cthd-sl");
        tienTD	.classList.add("cthd-gia");

        this.element.appendChild(maTD);
        this.element.appendChild(tenTD);
        this.element.appendChild(donviTD);
        this.element.appendChild(slTD);
        this.element.appendChild(tienTD);

        this.childElement = {
            don_vi      : donviTD,
            ma_thuoc    : maTD,
            so_luong    : slTD,
            ten_thuoc   : tenTD,
            thanhtien   : tienTD,
        };
    }

    public getRowElement() {
        return this.element;
    }

    public remove() {
        if (!this.element) {
            return;
        }
        const parent = this.element.parentNode;
        if (parent) {
            parent.removeChild(this.element);
        }
    }

    /**
     * get json data for post form
     */
    public getDataJSON() {
        return {
            don_vi: this.donvi,
            ma_thuoc: this.ma,
            so_luong: this.sl,
            ten_thuoc: this.ten,
        };
    }

    /**
     * @param ma
     * @param ten
     * @param donvi
     * @param sl
     * @param thanhtien
     */
    public updateAllValue(ma: number, ten: string,
                          donvi: number, sl: number, thanhtien: number) {
        this.ma = ma;
        this.ten = ten;
        this.donvi = donvi;
        this.sl = sl;
        this.thanhtien = thanhtien;

        this.childElement.ma_thuoc  .textContent = ma + "";
        this.childElement.ten_thuoc .textContent = ten + "";
        this.childElement.don_vi    .textContent = donvi + "";
        this.childElement.so_luong  .textContent = sl + "";
        this.childElement.thanhtien .textContent = thanhtien + "";
    }

    public updateValue(name: string, value: any) {
        switch (name) {
            case "ma_thuoc"		: this.ma = value; break;
            case "ten_thuoc"	: this.ten = value; break;
            case "don_vi"		: this.donvi = value; break;
            case "so_luong"		: this.sl = value; break;
            case "thanh_tien"	: this.thanhtien = value; break;
        }
        this.childElement[name].textContent = value;
    }
}

export { CTHoaDon };
