"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CTHoaDon {
    constructor(ma = -1, ten = "", donvi = -1, sl = 0, thanhtien = 0) {
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
    createElement() {
        this.element = document.createElement("tr");
        const maTD = document.createElement("td");
        const tenTD = document.createElement("td");
        const donviTD = document.createElement("td");
        const slTD = document.createElement("td");
        const tienTD = document.createElement("td");
        maTD.classList.add("cthd-mthuoc");
        tenTD.classList.add("cthd-tthuoc");
        donviTD.classList.add("cthd-donvi");
        slTD.classList.add("cthd-sl");
        tienTD.classList.add("cthd-gia");
        this.element.appendChild(maTD);
        this.element.appendChild(tenTD);
        this.element.appendChild(donviTD);
        this.element.appendChild(slTD);
        this.element.appendChild(tienTD);
        this.childElement = {
            don_vi: donviTD,
            ma_thuoc: maTD,
            so_luong: slTD,
            ten_thuoc: tenTD,
            thanhtien: tienTD,
        };
    }
    getRowElement() {
        return this.element;
    }
    remove() {
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
    getDataJSON() {
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
    updateAllValue(ma, ten, donvi, sl, thanhtien) {
        this.ma = ma;
        this.ten = ten;
        this.donvi = donvi;
        this.sl = sl;
        this.thanhtien = thanhtien;
        this.childElement.ma_thuoc.textContent = ma + "";
        this.childElement.ten_thuoc.textContent = ten + "";
        this.childElement.don_vi.textContent = donvi + "";
        this.childElement.so_luong.textContent = sl + "";
        this.childElement.thanhtien.textContent = thanhtien + "";
    }
    updateValue(name, value) {
        switch (name) {
            case "ma_thuoc":
                this.ma = value;
                break;
            case "ten_thuoc":
                this.ten = value;
                break;
            case "don_vi":
                this.donvi = value;
                break;
            case "so_luong":
                this.sl = value;
                break;
            case "thanh_tien":
                this.thanhtien = value;
                break;
        }
        this.childElement[name].textContent = value;
    }
}
exports.CTHoaDon = CTHoaDon;
//# sourceMappingURL=CTHoaDon.js.map