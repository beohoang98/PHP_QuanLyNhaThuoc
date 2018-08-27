"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CTHoaDon_1 = require("./CTHoaDon");
// import $ from 'jquery';
/**
 * Hóa Đơn Form
 */
const _HoaDonForm = class {
    constructor() {
        this._database = "/public/api/hoa_don/";
        const match = document.cookie.match(/username=(\w+)/);
        this._username = match ? match[1] : "Not Found";
        this._listCTHD = {}; //Object because data has key 'ma_thuoc'
        this._headerForm = undefined;
        this._CTHDTable = undefined;
        this._ghiChu = "";
    }
    setHeader(element) {
        this._headerForm = element;
        this._headerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!e.target)
                return;
            const dataArr = $(e.target).serializeArray();
            const dataObj = {};
            dataArr.forEach((val) => {
                dataObj[val.name] = val.value;
            });
            this.addCTHD(+dataObj['ma_thuoc'], dataObj['ten_thuoc'], +dataObj['so_luong'], +dataObj['don_vi'], +dataObj['cost']);
        });
    }
    setTable(element) {
        this._CTHDTable = element;
    }
    getUsername() {
        console.log(this._username);
        return this._username;
    }
    newHoaDon() {
        for (let el in this._listCTHD) {
            this._listCTHD[el].remove();
        }
    }
    /**
     * get total cash of 1 HoaDon
     */
    getTotalCash() {
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
    addCTHD(ma_thuoc, ten_thuoc, soluong, donvi, totalCash) {
        if (this._listCTHD.hasOwnProperty(ma_thuoc)) {
            const newSl = this._listCTHD[ma_thuoc].sl + soluong;
            this._listCTHD.ma_thuoc.updateValue('so_luong', newSl);
        }
        else {
            const newCTHD = new CTHoaDon_1.CTHoaDon(ma_thuoc, ten_thuoc, donvi, soluong, totalCash * soluong);
            this._listCTHD[ma_thuoc] = newCTHD;
            const rowElement = newCTHD.getRowElement();
            if (!this._CTHDTable || !rowElement)
                return;
            this._CTHDTable.tBodies[0].insertBefore(rowElement, this._CTHDTable.tBodies[0].childNodes[0]);
        }
    }
    /**
     *
     */
    pushToDatabase(successCallback, errorCallback) {
        const hoaDonInfo = {
            username: this._username,
            time: (new Date()).getTime(),
            ghichu: this._ghiChu
        };
        const data = {
            hoa_don: hoaDonInfo,
            cthd: this._listCTHD
        };
        $.ajax(this._database, {
            method: 'POST',
            xhrFields: {
                withCredentials: true
            },
            data: "data=" + JSON.stringify(data),
            dataType: "json",
            success: (json) => {
                if (!!json.err) {
                    errorCallback(json.msg);
                    return;
                }
                successCallback();
            },
            error: (err) => {
                errorCallback(err);
            }
        });
    }
};
exports.HoaDonForm = _HoaDonForm;
//# sourceMappingURL=HoaDonForm.js.map