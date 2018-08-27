(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = {
    "GIA_BAN_THEO_LIEU": 8000,
};

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = require("./Controller");
const inputPreview2_1 = require("./inputPreview2");
const _QLNT = class extends Controller_1.Controller {
    constructor() {
        super();
        this.addModel('DonVi', 'DonVi');
        this.addModel('Thuoc', 'Thuoc');
        this.addModel('Nsx', 'Nsx');
    }
    addTable(element) {
        let nameTHs = element.querySelectorAll("th");
        let compoName = element.getAttribute('component');
        const lookName = Array.from(nameTHs).map((val) => val.getAttribute('for'));
        const updateTable = function (err, data) {
            if (err)
                return;
            let body = element.querySelector('tbody');
            // delete old row
            while (body.lastChild)
                body.removeChild(body.lastChild);
            // updata new row
            for (let row of data) {
                let rowEl = document.createElement('tr');
                for (let name of lookName) {
                    let newTD = document.createElement('td');
                    newTD.textContent = row[name];
                    rowEl.appendChild(newTD);
                }
                body.appendChild(rowEl);
            }
        };
        this.addUpdateFunc(compoName, updateTable);
    }
    addNameInputThuoc(idElement, optListen, optChange) {
        const preview = new inputPreview2_1.default();
        preview.addLookup(optListen);
        preview.listen(idElement, (data) => {
            for (let idEl of Object.keys(optChange)) {
                const field = optChange[idEl];
                $('#' + idEl).val(data[field]);
            }
        });
        const onUpdate = function (err, data) {
            if (err) {
                console.log(err);
                return;
            }
            preview.addData(data);
        };
        this.addUpdateFunc('Thuoc', onUpdate);
    }
    addSelectInput(element, opt) {
        const valueKey = opt.value;
        const titleKey = opt.title;
        const compoName = $(element).attr('component');
        const onUpdate = function (err, data) {
            if (err) {
                console.log(err);
                return;
            }
            // remove old options
            while (element.lastChild)
                element.removeChild(element.lastChild);
            // add updated option
            for (const row of data) {
                const newOpt = $("<option/>");
                newOpt.attr('value', row[valueKey])
                    .text(row[titleKey])
                    .appendTo(element);
            }
        };
        this.addUpdateFunc(compoName, onUpdate);
    }
};
exports.QLNT = _QLNT;

},{"./Controller":4,"./inputPreview2":13}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _CTHoaDon = class {
    constructor(ma = -1, ten = "", donvi = -1, sl = 0, thanhtien = 0) {
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
    createElement() {
        this._element = document.createElement('tr');
        const maTD = document.createElement('td');
        const tenTD = document.createElement('td');
        const donviTD = document.createElement('td');
        const slTD = document.createElement('td');
        const tienTD = document.createElement('td');
        maTD.classList.add('cthd-mthuoc');
        tenTD.classList.add('cthd-tthuoc');
        donviTD.classList.add('cthd-donvi');
        slTD.classList.add('cthd-sl');
        tienTD.classList.add('cthd-gia');
        this._element.appendChild(maTD);
        this._element.appendChild(tenTD);
        this._element.appendChild(donviTD);
        this._element.appendChild(slTD);
        this._element.appendChild(tienTD);
        this._childElement = {
            "ma_thuoc": maTD,
            "ten_thuoc": tenTD,
            "don_vi": donviTD,
            "so_luong": slTD,
            "thanhtien": tienTD
        };
    }
    getRowElement() {
        return this._element;
    }
    /**
     *
     */
    remove() {
        if (!this._element)
            return;
        const parent = this._element.parentNode;
        if (parent)
            parent.removeChild(this._element);
    }
    /**
     * get json data for post form
     */
    getDataJSON() {
        return {
            'ma_thuoc': this.ma,
            'ten_thuoc': this.ten,
            'don_vi': this.donvi,
            'so_luong': this.sl
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
    updateAllValue(ma, ten, donvi, sl, thanhtien) {
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
        this._childElement[name].textContent = value;
    }
};
exports.CTHoaDon = _CTHoaDon;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DonVi_1 = require("./Model/DonVi");
const Thuoc_1 = require("./Model/Thuoc");
const Nsx_1 = require("./Model/Nsx");
const _Controller = class {
    constructor() {
        this._componentList = {};
        this._event = {};
    }
    /**
     * @param {string} name name of model
     * @param {string} typename type of model (DonVi | Thuoc | Nsx)
     */
    addModel(name, typename) {
        if (this._componentList.hasOwnProperty(name)) {
            throw Error(name + " is existing model");
        }
        let newObj = null;
        switch (typename) {
            case "DonVi":
                newObj = new DonVi_1.DonVi();
                break;
            case "Thuoc":
                newObj = new Thuoc_1.Thuoc();
                break;
            case "Nsx":
                newObj = new Nsx_1.Nsx();
                break;
            default: {
                throw Error("unknown typename: " + typename);
            }
        }
        this._componentList[name] = newObj;
        this._event[name] = [];
    }
    /**
     * @param {string} compoName component name
     * @param {Function} func callback function
     * @return {(err, data)=>{}}
     */
    addUpdateFunc(compoName, func = (err, data) => { }) {
        if (!this._event.hasOwnProperty(compoName)) {
            console.log("Not found " + compoName);
        }
        this._event[compoName].push(func);
    }
    /**
     * update all model and call callback event
     */
    onUpdateAll() {
        for (const compoName of Object.keys(this._componentList)) {
            const that = this;
            this._componentList[compoName].get(function (err, data) {
                for (const func of that._event[compoName]) {
                    func(err, data);
                }
            });
        }
    }
};
exports.Controller = _Controller;

},{"./Model/DonVi":7,"./Model/Nsx":9,"./Model/Thuoc":12}],5:[function(require,module,exports){
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

},{"./CTHoaDon":3}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BootstrapModal {
    constructor(id) {
        this.id = id;
        this._element = this._createModal(id);
        document.body.appendChild(this._element[0]);
    }
    setTitle(text) {
        this._element.find('.modal-title').text(text);
    }
    setContent(html) {
        this._element.find('.modal-body').html(html);
    }
    show(title, content) {
        this.setTitle(title);
        this.setContent(content);
        this.open();
    }
    open() {
        this._element.modal('show');
    }
    close() {
        this._element.modal('hide');
    }
    _createModal(id) {
        const div = $("<div/>");
        div.attr('id', id);
        div.addClass('modal fade').data('toggle', 'modal');
        div.html(`
        <div class='modal-dialog modal-lg modal-center'>
            <div class='modal-content'>
                <div class='modal-header'>
                    <div class='modal-title'></div>
                    <div class='close' data-dismiss='modal'>
                        <i class='fa fa-times'></i>
                    </div>
                </div>
                <div class='modal-body'>
                </div>
                <div class='modal-footer'>
                    <button class='btn btn-secondary' data-dismiss='modal'>Close</button>
                    <button class='btn btn-primary'>OK</button>
                </div>
            </div>
        </div>
        `);
        return div;
    }
}
exports.BootstrapModal = BootstrapModal;

},{}],7:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ModelClass_1 = require("../ModelClass");
class _DonVi extends ModelClass_1.Model {
    constructor() {
        super();
        this.database = "/api/don_vi/";
        this.fetchData = null;
    }
    get(callback = (err, data) => { }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._get({});
                this.fetchData = this._filter(data);
                callback(false, this.fetchData);
                return this.fetchData;
            }
            catch (err) {
                callback(err);
            }
        });
    }
    _filter(rawData) {
        const newData = rawData.slice();
        const map = {};
        for (const row of newData) {
            const heso = row.he_so_quydoi;
            map[row.id] = row;
            row.textQuyDoi = heso ? "" : "đơn vị cơ bản";
        }
        for (let row of newData) {
            let id_co_ban = row.id_quy_doi;
            let heso = +row.he_so_quydoi;
            while (map.hasOwnProperty(id_co_ban)) {
                row['textQuyDoi'] += `=${heso}x[${map[id_co_ban]['ten']}]`;
                heso *= +map[id_co_ban]['he_so_quydoi'];
                id_co_ban = map[id_co_ban]['id_quy_doi'];
            }
        }
        return newData;
    }
}
exports.DonVi = _DonVi;

},{"../ModelClass":8}],8:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Model {
    constructor() {
        this.database = "";
        this.data = [];
    }
    get response() {
        return Object.assign({}, this.res);
    }
    // =============== INHERIT FUNC
    get(params, offset, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    /**
     * update record
     * @param fieldMatch match field to update record
     * @param fieldUpdate the data need update
     */
    update(fieldMatch, fieldUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    /**
     * remove a record
     * @param fieldMatch field match to remove
     * @return true of false
     */
    remove(fieldMatch) {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    // =============== CORE FUNC
    /**
     * fetch data from database and do thing
     * @param params
     * @param callback callback function
     */
    _get(params, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            this.data = [];
            const requestURL = this.database + this._urlparams(params);
            try {
                const res = yield fetch(requestURL, { credentials: "include" });
                const json = yield res.json();
                if (json.err) {
                    throw new Error(json.msg);
                }
                this.data = json.data;
                if (typeof callback === "function") {
                    callback(false, json.data);
                }
                return json.data;
            }
            catch (err) {
                if (typeof callback === "function") {
                    callback(err);
                }
                else {
                    throw err;
                }
            }
        });
    }
    /**
     * post request
     * @param {any} data
     * @param {Function} [callback]
     */
    _post(data, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            this.res = "";
            try {
                const res = yield fetch(this.database, {
                    body: JSON.stringify(data),
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                });
                const json = yield res.json();
                if (json.err) {
                    throw new Error(json.msg);
                }
                this.res = json.data;
                if (typeof callback === "function") {
                    callback(false, json.data);
                }
                return json.data;
            }
            catch (err) {
                if (typeof callback === "function") {
                    callback(err);
                }
                else {
                    throw err;
                }
            }
        });
    }
    _urlparams(params) {
        const url = Object.keys(params).map((k) => {
            return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
        }).join("&");
        return url;
    }
}
exports.Model = Model;

},{}],9:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ModelClass_1 = require("../ModelClass");
class _Nsx extends ModelClass_1.Model {
    constructor() {
        super();
        this.database = "/api/ncc/";
    }
    /**
     * get data of nsx
     * @param callback callback function
     */
    get(params, offset, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._get({ params, offset, limit });
            return data;
        });
    }
}
exports.Nsx = _Nsx;

},{"../ModelClass":8}],10:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Display data under table
 */
class TableData {
    constructor() {
        this._map = {};
        this._list = [];
        this._isConnect = false;
        this._connectStatus = "";
        this._isFetched = false;
        this._dbURL = "";
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield fetch(this._dbURL, { method: "GET", credentials: 'include' });
            if (!res.ok) {
                this._isConnect = false;
                this._connectStatus = res.statusText;
                return;
            }
            this._isConnect = true;
            this._connectStatus = "";
            let json = yield res.json();
            if (!!json.err) {
                this._isFetched = false;
                this._connectStatus = json.msg;
                return;
            }
            this._isFetched = true;
            this._connectStatus = "OK";
            this._list = json.data;
        });
    }
    get table() {
        return this._map;
    }
    get list() {
        return this._list;
    }
}
exports.default = TableData;

},{}],11:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const TableData_1 = require("../TableData");
class BangThuoc extends TableData_1.default {
    constructor() {
        super();
        this._dbURL = "/api/thuoc/";
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getData();
            for (let row of this._list) {
                let id = row['id'];
                this._map[id] = row;
            }
        });
    }
}
exports.BangThuoc = BangThuoc;

},{"../TableData":10}],12:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ModelClass_1 = require("../ModelClass");
const BangThuoc_1 = require("./BangThuoc");
exports.BangThuoc = BangThuoc_1.BangThuoc;
class Thuoc extends ModelClass_1.Model {
    constructor() {
        super();
        this.database = "/api/thuoc/";
    }
    get(params, offset, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._get({ params, offset, limit });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.res = yield this._post(data);
            return (!this.res.err);
        });
    }
}
exports.Thuoc = Thuoc;

},{"../ModelClass":8,"./BangThuoc":11}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class inputPreview2 {
    constructor(target = document) {
        this._list = {};
        this._data = [];
        this._lookup = {};
        this._target = target;
        this._preview_div = null;
        this._currentPreviewData = [];
        // constructor    
        document.addEventListener("click", (e) => {
            const target = e.target;
            if (!target.classList.hasOwnProperty("preview-row"))
                this._deletePreview();
        });
    }
    /**
     * add lookup to json name
     * @param {{idEl: String}} arr { id_element : name_of_field}
     */
    addLookup(arr) {
        if (typeof arr != "object") {
            // console.log(Object.call(arr));
            throw new Error("parameter must be json obj");
            return;
        }
        for (let key of Object.keys(arr)) {
            this._lookup[key] = arr[key];
            let el = document.getElementById(key);
            if (!el) {
                console.log(Error(`Cannot find #${key} element`));
            }
            else {
                this._list[key] = el;
            }
        }
    }
    ;
    /**
     * add host to fetch database
     * @param {string} url asd
     */
    addData(data) {
        if (typeof (data) != "object") {
            throw new Error("parameter must be json");
            return;
        }
        this._data = data;
    }
    ;
    listen(id, callback) {
        let element = document.getElementById(id);
        let cur = 0;
        element.addEventListener("keydown", (e) => {
            let code = e.keyCode;
            if (code === 27) { // esc
                this._deletePreview();
            }
            else if (code == 38 || code == 40) { // up-down
                e.preventDefault();
                this._preview_div.children[cur].classList.remove("preview-row-active");
                let len = this._preview_div.children.length;
                cur = (code == 38) ? cur - 1 : cur + 1;
                if (cur < 0)
                    cur = len - 1;
                if (cur > len - 1)
                    cur = 0;
                this._preview_div.children[cur].classList.add("preview-row-active");
                this._preview_div.setAttribute("cur", cur + "");
            }
            else if (code == 13) { // enter
                e.preventDefault();
                callback(this._currentPreviewData[cur]);
                this._deletePreview();
            }
            else {
                this.fetchOn(id, callback);
            }
        });
    }
    /**
     *
     * fetch database and show in input
     * @param {string} id id of html element input need to fetch by value
     */
    fetchOn(id, callback) {
        this._deletePreview();
        this._currentPreviewData.length = 0; //clear current preview suggest name
        if (!this._list.hasOwnProperty(id)) {
            console.log("Cannot find " + id);
            return;
        }
        ;
        let input = this._list[id];
        let input_preview = this._createFlyWrap(input);
        let value = input.value;
        this._preview_div = input_preview;
        input.setAttribute('autocomplete', 'off');
        for (const row of this._data) {
            if (!this._isLike(row[this._lookup[id]], value))
                continue;
            this._currentPreviewData.push(row);
            let arr = [];
            for (const name of Object.keys(this._lookup)) {
                const field = this._lookup[name];
                arr.push(row[field]);
            }
            let newRow = this._createFlyRow(arr);
            newRow.addEventListener("click", (e) => {
                callback(row);
                this._deletePreview();
            });
            input_preview.appendChild(newRow);
            document.body.appendChild(input_preview);
        }
    }
    ;
    /**
     * @param {HTMLDivElement} element
     * @param {string} value
     */
    _createFlyWrap(element) {
        if (!element)
            return null;
        let rect = element.getBoundingClientRect();
        let div = document.createElement("div");
        div.className = "preview-input";
        div.style.minWidth = rect.width + "px";
        div.style.top = +rect.top + rect.height + "px";
        div.style.left = +rect.left + "px";
        div.setAttribute("cur", "0");
        return div;
    }
    /**
     * @return {true} if str1 like str2
     * @param {String} str1
     * @param {String} str2
     */
    _isLike(str1, str2) {
        str1 = str1.trim();
        str2 = str2.trim();
        if (str1 == "" || str2 == "")
            return false;
        str1 = str1.normalize();
        str2 = str2.normalize();
        str1 = str1.toLowerCase();
        str2 = str2.toLowerCase();
        let reg = new RegExp(`^.*${str2}.*$`);
        return str1.match(reg);
    }
    /**
     * @param {Array} arrValues
     */
    _createFlyRow(arrValues) {
        if (!Array.isArray(arrValues)) {
            return null;
        }
        let row = document.createElement("div");
        row.className = "preview-row";
        for (let value of arrValues) {
            let col = document.createElement("div");
            col.style.margin = "auto";
            col.textContent = value;
            row.appendChild(col);
        }
        return row;
    }
    _deletePreview() {
        document.querySelectorAll(".preview-input").forEach((val) => {
            val.remove();
        });
    }
}
exports.default = inputPreview2;

},{}],14:[function(require,module,exports){
const {DonVi} = require('../app/Model/DonVi/');
const {BootstrapModal} = require('../app/Model/BoostrapModal');

const donvi = new DonVi();

$(document).ready(async ()=>{
    async function updateTable() {
        const table = $("#nhap_don_vi--table tbody");
        table.children().remove();
        const data = await donvi.get();
        for (const row of data) {
            const tr = $('<tr/>').html(`
                <td>${row.id}</td>
                <td>${row.ten}</td>
            `);
            table.append(tr);
        }
    }

    updateTable();

});

},{"../app/Model/BoostrapModal":6,"../app/Model/DonVi/":7}],15:[function(require,module,exports){
const {HoaDonForm} = require('../app/HoaDonForm');
const {QLNT} = require('../app/App');
const {BootstrapModal} = require('../app/Model/BoostrapModal');
const CONFIG = require('../../config');

const hoaDonForm = new HoaDonForm();
const App = new QLNT();
const popup = new BootstrapModal('nhap_hoa_don--popup');

function displayTime() {
    let now = new Date();
    $("#time-date").text(now.toLocaleDateString());
    $("#time-time").text(now.toLocaleTimeString());
}

function loopShowTime() {
    setInterval(()=>{
        displayTime();
    }, 1000);
}

function displayUser() {
    let username = hoaDonForm.getUsername();
    $("#nhap_hoa_don--username").text(username);
}

function focusTenThuocFirst() {
    $("#nhap_hoa_don--ten-thuoc").focus();
}

function updateTongGia() {
    let tong = 0;
    let list = document.querySelectorAll('.cthd-gia');
    for (let val of list) {
        let gia = parseInt(val.textContent.replace(/\D/, ''));
        tong += gia;
    }
    const val = tong.toLocaleString()+' VNĐ';

    $("#nhap_hoa_don--sum").attr('curVal', val);
    if (!$('#kieu-lieu')[0].checked) $('#nhap_hoa_don--sum').val(val);
}

function updateTienThoi() {
    let sum = $("#nhap_hoa_don--sum").val().replace(/[\D\s]/g, '');
    let tienkh = $("#nhap_hoa_don--tienkh-tra").val().replace(/[\D\s]/g, '');

    let tienThoi = parseInt(tienkh) - parseInt(sum);
    tienThoi = tienThoi >= 0 ? tienThoi.toLocaleString() : '~loi';

    $("#nhap_hoa_don--thoitien").val(tienThoi);
}

$(document).ready(function() {
    loopShowTime();
    displayUser();
    focusTenThuocFirst();

    App.addSelectInput($('[component="DonVi"]'), {
        title: 'ten',
        value: 'id',
    });

    App.onUpdateAll();

    $('#nhap_hoa_don--tienkh-tra').moneyInput().on('keyup', ()=>{
        updateTienThoi();
    });

    $('#nhap_hoa_don--hoadon-form').submit((e)=>{
        e.preventDefault();

        hoaDonForm.pushToDatabase(function() {
            $('#nhap_hoa_don--hoadon-form').find('input, select').val('');
            $('#nhap_hoa_don--form-nhap').find('input, select').val('');
            hoaDonForm.newHoaDon();
            console.log(hoaDonForm);
            popup.show('OK', '');
        }, (err)=>{
            popup.show('Error', err.responseText);
            console.log(err);
        });
    });

    App.addNameInputThuoc("nhap_hoa_don--ten_thuoc", {
        "nhap_hoa_don--ma_thuoc": "ma",
        "nhap_hoa_don--ten_thuoc": "ten",
        "nhap_hoa_don--don_vi": "don_vi",
        "nhap_hoa_don--cost": "don_gia",
    }, {
        "nhap_hoa_don--ten_thuoc": "ten",
        "nhap_hoa_don--ma_thuoc": "ma",
        "nhap_hoa_don--don_vi": "don_vi",
        "nhap_hoa_don--cost": "don_gia",
    });

    $("#nhap_hoa_don--form-nhap").on('submit', (e)=>{
        e.preventDefault();
        $("#nhap_hoa_don--form-nhap").find('input, select').val('');
        updateTongGia();
    });

    $("#kieu-lieu").click(() => {
        $('#nhap_hoa_don--sum').val(CONFIG.GIA_BAN_THEO_LIEU);
    });
    $('#kieu-banle').click(() => {
        const sum = $('#sum');
        const val = sum.attr('curVal');
        sum.val(val);
    });
    // -----------------------
});

},{"../../config":1,"../app/App":2,"../app/HoaDonForm":5,"../app/Model/BoostrapModal":6}],16:[function(require,module,exports){
const {Nsx} = require('../app/Model/Nsx');

$(document).ready(()=>{
    const popup = new StatusPopup();
    const nsx = new Nsx();

    popup.create();
    updateNSX();

    function createTableRow(val) {
        let row = $("<tr/>");
        for (let key of Object.keys(val)) {
            row.append($('<td/>').text(val[key]));
        }
        return row;
    }

    function updateNSX() {
        $('#table-body').children().remove();
        nsx.get((err, data)=>{
            if (err) {
                throw new Error(err);
            }
            for (let row of data) {
                $("#table-body").append(createTableRow(row));
            }
        });
    }

    // update data request
    window.addEventListener('message', function(e) {
        let data = e.data;
        if (data.msg == 'update') {
            updateNSX();
        }
    });
});

},{"../app/Model/Nsx":9}],17:[function(require,module,exports){
const {Thuoc, BangThuoc} = require('../app/Model/Thuoc');
const thuoc = new Thuoc();
const bangThuoc = new BangThuoc();

$(document).ready(function() {
    async function updateTable() {
        const table = $("#nhap_thuoc--table tbody");
        table.children().remove();
        await bangThuoc.update();
        for (const row of bangThuoc.list) {
            const priceString = (+row.don_gia).toLocaleString();
            const tr = $('<tr/>').html(`
                <td>${row.ma}</td>
                <td>${row.ten}</td>
                <td>${row.ten_nsx}</td>
                <td>${priceString}</td>
                <td>${row.so_luong}</td>
            `);
            table.append(tr);
        }
    }

    $("#nhap_thuoc--form").on("submit", function NhapThuocFormSubmit(e) {
        e.preventDefault();
        const data = {};
        $(this).serializeArray().forEach((val)=>{
            data[val.name] = val.value;
        });
        thuoc.create(data, (err)=>{
            if (err) {
                throw err;
            }
            window.location.reload();
        });
    });

    updateTable();
});

},{"../app/Model/Thuoc":12}]},{},[14,15,16,17])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb25maWcvaW5kZXguanMiLCJzcmMvYXBwL0FwcC5qcyIsInNyYy9hcHAvQ1RIb2FEb24uanMiLCJzcmMvYXBwL0NvbnRyb2xsZXIuanMiLCJzcmMvYXBwL0hvYURvbkZvcm0uanMiLCJzcmMvYXBwL01vZGVsL0Jvb3N0cmFwTW9kYWwvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL0RvblZpL2luZGV4LmpzIiwic3JjL2FwcC9Nb2RlbC9Nb2RlbENsYXNzL2luZGV4LmpzIiwic3JjL2FwcC9Nb2RlbC9Oc3gvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL1RhYmxlRGF0YS9pbmRleC5qcyIsInNyYy9hcHAvTW9kZWwvVGh1b2MvQmFuZ1RodW9jLmpzIiwic3JjL2FwcC9Nb2RlbC9UaHVvYy9pbmRleC5qcyIsInNyYy9hcHAvaW5wdXRQcmV2aWV3Mi5qcyIsInNyYy9zY3JpcHQvbmhhcC1kb24tdmkuanMiLCJzcmMvc2NyaXB0L25oYXAtaG9hLWRvbi5qcyIsInNyYy9zY3JpcHQvbmhhcC1uc3guanMiLCJzcmMvc2NyaXB0L25oYXAtdGh1b2MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgXCJHSUFfQkFOX1RIRU9fTElFVVwiOiA4MDAwLFxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgQ29udHJvbGxlcl8xID0gcmVxdWlyZShcIi4vQ29udHJvbGxlclwiKTtcbmNvbnN0IGlucHV0UHJldmlldzJfMSA9IHJlcXVpcmUoXCIuL2lucHV0UHJldmlldzJcIik7XG5jb25zdCBfUUxOVCA9IGNsYXNzIGV4dGVuZHMgQ29udHJvbGxlcl8xLkNvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmFkZE1vZGVsKCdEb25WaScsICdEb25WaScpO1xuICAgICAgICB0aGlzLmFkZE1vZGVsKCdUaHVvYycsICdUaHVvYycpO1xuICAgICAgICB0aGlzLmFkZE1vZGVsKCdOc3gnLCAnTnN4Jyk7XG4gICAgfVxuICAgIGFkZFRhYmxlKGVsZW1lbnQpIHtcbiAgICAgICAgbGV0IG5hbWVUSHMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0aFwiKTtcbiAgICAgICAgbGV0IGNvbXBvTmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjb21wb25lbnQnKTtcbiAgICAgICAgY29uc3QgbG9va05hbWUgPSBBcnJheS5mcm9tKG5hbWVUSHMpLm1hcCgodmFsKSA9PiB2YWwuZ2V0QXR0cmlidXRlKCdmb3InKSk7XG4gICAgICAgIGNvbnN0IHVwZGF0ZVRhYmxlID0gZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBsZXQgYm9keSA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcigndGJvZHknKTtcbiAgICAgICAgICAgIC8vIGRlbGV0ZSBvbGQgcm93XG4gICAgICAgICAgICB3aGlsZSAoYm9keS5sYXN0Q2hpbGQpXG4gICAgICAgICAgICAgICAgYm9keS5yZW1vdmVDaGlsZChib2R5Lmxhc3RDaGlsZCk7XG4gICAgICAgICAgICAvLyB1cGRhdGEgbmV3IHJvd1xuICAgICAgICAgICAgZm9yIChsZXQgcm93IG9mIGRhdGEpIHtcbiAgICAgICAgICAgICAgICBsZXQgcm93RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IG5hbWUgb2YgbG9va05hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld1REID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3VEQudGV4dENvbnRlbnQgPSByb3dbbmFtZV07XG4gICAgICAgICAgICAgICAgICAgIHJvd0VsLmFwcGVuZENoaWxkKG5ld1REKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYm9keS5hcHBlbmRDaGlsZChyb3dFbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYWRkVXBkYXRlRnVuYyhjb21wb05hbWUsIHVwZGF0ZVRhYmxlKTtcbiAgICB9XG4gICAgYWRkTmFtZUlucHV0VGh1b2MoaWRFbGVtZW50LCBvcHRMaXN0ZW4sIG9wdENoYW5nZSkge1xuICAgICAgICBjb25zdCBwcmV2aWV3ID0gbmV3IGlucHV0UHJldmlldzJfMS5kZWZhdWx0KCk7XG4gICAgICAgIHByZXZpZXcuYWRkTG9va3VwKG9wdExpc3Rlbik7XG4gICAgICAgIHByZXZpZXcubGlzdGVuKGlkRWxlbWVudCwgKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGlkRWwgb2YgT2JqZWN0LmtleXMob3B0Q2hhbmdlKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gb3B0Q2hhbmdlW2lkRWxdO1xuICAgICAgICAgICAgICAgICQoJyMnICsgaWRFbCkudmFsKGRhdGFbZmllbGRdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IG9uVXBkYXRlID0gZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJldmlldy5hZGREYXRhKGRhdGEpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmFkZFVwZGF0ZUZ1bmMoJ1RodW9jJywgb25VcGRhdGUpO1xuICAgIH1cbiAgICBhZGRTZWxlY3RJbnB1dChlbGVtZW50LCBvcHQpIHtcbiAgICAgICAgY29uc3QgdmFsdWVLZXkgPSBvcHQudmFsdWU7XG4gICAgICAgIGNvbnN0IHRpdGxlS2V5ID0gb3B0LnRpdGxlO1xuICAgICAgICBjb25zdCBjb21wb05hbWUgPSAkKGVsZW1lbnQpLmF0dHIoJ2NvbXBvbmVudCcpO1xuICAgICAgICBjb25zdCBvblVwZGF0ZSA9IGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHJlbW92ZSBvbGQgb3B0aW9uc1xuICAgICAgICAgICAgd2hpbGUgKGVsZW1lbnQubGFzdENoaWxkKVxuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQoZWxlbWVudC5sYXN0Q2hpbGQpO1xuICAgICAgICAgICAgLy8gYWRkIHVwZGF0ZWQgb3B0aW9uXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3T3B0ID0gJChcIjxvcHRpb24vPlwiKTtcbiAgICAgICAgICAgICAgICBuZXdPcHQuYXR0cigndmFsdWUnLCByb3dbdmFsdWVLZXldKVxuICAgICAgICAgICAgICAgICAgICAudGV4dChyb3dbdGl0bGVLZXldKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYWRkVXBkYXRlRnVuYyhjb21wb05hbWUsIG9uVXBkYXRlKTtcbiAgICB9XG59O1xuZXhwb3J0cy5RTE5UID0gX1FMTlQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1BcHAuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBfQ1RIb2FEb24gPSBjbGFzcyB7XG4gICAgY29uc3RydWN0b3IobWEgPSAtMSwgdGVuID0gXCJcIiwgZG9udmkgPSAtMSwgc2wgPSAwLCB0aGFuaHRpZW4gPSAwKSB7XG4gICAgICAgIHRoaXMubWEgPSBtYTtcbiAgICAgICAgdGhpcy50ZW4gPSB0ZW47XG4gICAgICAgIHRoaXMuZG9udmkgPSBkb252aTtcbiAgICAgICAgdGhpcy5zbCA9IHNsO1xuICAgICAgICB0aGlzLnRoYW5odGllbiA9IHRoYW5odGllbjtcbiAgICAgICAgdGhpcy5fY2hpbGRFbGVtZW50ID0ge307XG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBudWxsO1xuICAgICAgICB0aGlzLmNyZWF0ZUVsZW1lbnQoKTtcbiAgICAgICAgdGhpcy51cGRhdGVBbGxWYWx1ZShtYSwgdGVuLCBkb252aSwgc2wsIHRoYW5odGllbik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGNyZWF0ZSByb3cgZWxlbWVudCBmb3IgdGFibGVcbiAgICAgKi9cbiAgICBjcmVhdGVFbGVtZW50KCkge1xuICAgICAgICB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcbiAgICAgICAgY29uc3QgbWFURCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgICAgIGNvbnN0IHRlblREID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICAgICAgY29uc3QgZG9udmlURCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgICAgIGNvbnN0IHNsVEQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgICAgICBjb25zdCB0aWVuVEQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgICAgICBtYVRELmNsYXNzTGlzdC5hZGQoJ2N0aGQtbXRodW9jJyk7XG4gICAgICAgIHRlblRELmNsYXNzTGlzdC5hZGQoJ2N0aGQtdHRodW9jJyk7XG4gICAgICAgIGRvbnZpVEQuY2xhc3NMaXN0LmFkZCgnY3RoZC1kb252aScpO1xuICAgICAgICBzbFRELmNsYXNzTGlzdC5hZGQoJ2N0aGQtc2wnKTtcbiAgICAgICAgdGllblRELmNsYXNzTGlzdC5hZGQoJ2N0aGQtZ2lhJyk7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQobWFURCk7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGVuVEQpO1xuICAgICAgICB0aGlzLl9lbGVtZW50LmFwcGVuZENoaWxkKGRvbnZpVEQpO1xuICAgICAgICB0aGlzLl9lbGVtZW50LmFwcGVuZENoaWxkKHNsVEQpO1xuICAgICAgICB0aGlzLl9lbGVtZW50LmFwcGVuZENoaWxkKHRpZW5URCk7XG4gICAgICAgIHRoaXMuX2NoaWxkRWxlbWVudCA9IHtcbiAgICAgICAgICAgIFwibWFfdGh1b2NcIjogbWFURCxcbiAgICAgICAgICAgIFwidGVuX3RodW9jXCI6IHRlblRELFxuICAgICAgICAgICAgXCJkb25fdmlcIjogZG9udmlURCxcbiAgICAgICAgICAgIFwic29fbHVvbmdcIjogc2xURCxcbiAgICAgICAgICAgIFwidGhhbmh0aWVuXCI6IHRpZW5URFxuICAgICAgICB9O1xuICAgIH1cbiAgICBnZXRSb3dFbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudDtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICByZW1vdmUoKSB7XG4gICAgICAgIGlmICghdGhpcy5fZWxlbWVudClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5fZWxlbWVudC5wYXJlbnROb2RlO1xuICAgICAgICBpZiAocGFyZW50KVxuICAgICAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMuX2VsZW1lbnQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBnZXQganNvbiBkYXRhIGZvciBwb3N0IGZvcm1cbiAgICAgKi9cbiAgICBnZXREYXRhSlNPTigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdtYV90aHVvYyc6IHRoaXMubWEsXG4gICAgICAgICAgICAndGVuX3RodW9jJzogdGhpcy50ZW4sXG4gICAgICAgICAgICAnZG9uX3ZpJzogdGhpcy5kb252aSxcbiAgICAgICAgICAgICdzb19sdW9uZyc6IHRoaXMuc2xcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbWFcbiAgICAgKiBAcGFyYW0gdGVuXG4gICAgICogQHBhcmFtIGRvbnZpXG4gICAgICogQHBhcmFtIHNsXG4gICAgICogQHBhcmFtIHRoYW5odGllblxuICAgICAqL1xuICAgIHVwZGF0ZUFsbFZhbHVlKG1hLCB0ZW4sIGRvbnZpLCBzbCwgdGhhbmh0aWVuKSB7XG4gICAgICAgIHRoaXMubWEgPSBtYTtcbiAgICAgICAgdGhpcy50ZW4gPSB0ZW47XG4gICAgICAgIHRoaXMuZG9udmkgPSBkb252aTtcbiAgICAgICAgdGhpcy5zbCA9IHNsO1xuICAgICAgICB0aGlzLnRoYW5odGllbiA9IHRoYW5odGllbjtcbiAgICAgICAgdGhpcy5fY2hpbGRFbGVtZW50WydtYV90aHVvYyddLnRleHRDb250ZW50ID0gbWEgKyBcIlwiO1xuICAgICAgICB0aGlzLl9jaGlsZEVsZW1lbnRbJ3Rlbl90aHVvYyddLnRleHRDb250ZW50ID0gdGVuICsgXCJcIjtcbiAgICAgICAgdGhpcy5fY2hpbGRFbGVtZW50Wydkb25fdmknXS50ZXh0Q29udGVudCA9IGRvbnZpICsgXCJcIjtcbiAgICAgICAgdGhpcy5fY2hpbGRFbGVtZW50Wydzb19sdW9uZyddLnRleHRDb250ZW50ID0gc2wgKyBcIlwiO1xuICAgICAgICB0aGlzLl9jaGlsZEVsZW1lbnRbJ3RoYW5odGllbiddLnRleHRDb250ZW50ID0gdGhhbmh0aWVuICsgXCJcIjtcbiAgICB9XG4gICAgdXBkYXRlVmFsdWUobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICAgICAgICBjYXNlIFwibWFfdGh1b2NcIjpcbiAgICAgICAgICAgICAgICB0aGlzLm1hID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwidGVuX3RodW9jXCI6XG4gICAgICAgICAgICAgICAgdGhpcy50ZW4gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJkb25fdmlcIjpcbiAgICAgICAgICAgICAgICB0aGlzLmRvbnZpID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwic29fbHVvbmdcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnNsID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwidGhhbmhfdGllblwiOlxuICAgICAgICAgICAgICAgIHRoaXMudGhhbmh0aWVuID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY2hpbGRFbGVtZW50W25hbWVdLnRleHRDb250ZW50ID0gdmFsdWU7XG4gICAgfVxufTtcbmV4cG9ydHMuQ1RIb2FEb24gPSBfQ1RIb2FEb247XG4vLyMgc291cmNlTWFwcGluZ1VSTD1DVEhvYURvbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IERvblZpXzEgPSByZXF1aXJlKFwiLi9Nb2RlbC9Eb25WaVwiKTtcbmNvbnN0IFRodW9jXzEgPSByZXF1aXJlKFwiLi9Nb2RlbC9UaHVvY1wiKTtcbmNvbnN0IE5zeF8xID0gcmVxdWlyZShcIi4vTW9kZWwvTnN4XCIpO1xuY29uc3QgX0NvbnRyb2xsZXIgPSBjbGFzcyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX2NvbXBvbmVudExpc3QgPSB7fTtcbiAgICAgICAgdGhpcy5fZXZlbnQgPSB7fTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgbmFtZSBvZiBtb2RlbFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlbmFtZSB0eXBlIG9mIG1vZGVsIChEb25WaSB8IFRodW9jIHwgTnN4KVxuICAgICAqL1xuICAgIGFkZE1vZGVsKG5hbWUsIHR5cGVuYW1lKSB7XG4gICAgICAgIGlmICh0aGlzLl9jb21wb25lbnRMaXN0Lmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihuYW1lICsgXCIgaXMgZXhpc3RpbmcgbW9kZWxcIik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG5ld09iaiA9IG51bGw7XG4gICAgICAgIHN3aXRjaCAodHlwZW5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJEb25WaVwiOlxuICAgICAgICAgICAgICAgIG5ld09iaiA9IG5ldyBEb25WaV8xLkRvblZpKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiVGh1b2NcIjpcbiAgICAgICAgICAgICAgICBuZXdPYmogPSBuZXcgVGh1b2NfMS5UaHVvYygpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIk5zeFwiOlxuICAgICAgICAgICAgICAgIG5ld09iaiA9IG5ldyBOc3hfMS5Oc3goKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcInVua25vd24gdHlwZW5hbWU6IFwiICsgdHlwZW5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NvbXBvbmVudExpc3RbbmFtZV0gPSBuZXdPYmo7XG4gICAgICAgIHRoaXMuX2V2ZW50W25hbWVdID0gW107XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb21wb05hbWUgY29tcG9uZW50IG5hbWVcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHJldHVybiB7KGVyciwgZGF0YSk9Pnt9fVxuICAgICAqL1xuICAgIGFkZFVwZGF0ZUZ1bmMoY29tcG9OYW1lLCBmdW5jID0gKGVyciwgZGF0YSkgPT4geyB9KSB7XG4gICAgICAgIGlmICghdGhpcy5fZXZlbnQuaGFzT3duUHJvcGVydHkoY29tcG9OYW1lKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJOb3QgZm91bmQgXCIgKyBjb21wb05hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2V2ZW50W2NvbXBvTmFtZV0ucHVzaChmdW5jKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogdXBkYXRlIGFsbCBtb2RlbCBhbmQgY2FsbCBjYWxsYmFjayBldmVudFxuICAgICAqL1xuICAgIG9uVXBkYXRlQWxsKCkge1xuICAgICAgICBmb3IgKGNvbnN0IGNvbXBvTmFtZSBvZiBPYmplY3Qua2V5cyh0aGlzLl9jb21wb25lbnRMaXN0KSkge1xuICAgICAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLl9jb21wb25lbnRMaXN0W2NvbXBvTmFtZV0uZ2V0KGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGZ1bmMgb2YgdGhhdC5fZXZlbnRbY29tcG9OYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICBmdW5jKGVyciwgZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuZXhwb3J0cy5Db250cm9sbGVyID0gX0NvbnRyb2xsZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Db250cm9sbGVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgQ1RIb2FEb25fMSA9IHJlcXVpcmUoXCIuL0NUSG9hRG9uXCIpO1xuLy8gaW1wb3J0ICQgZnJvbSAnanF1ZXJ5Jztcbi8qKlxuICogSMOzYSDEkMahbiBGb3JtXG4gKi9cbmNvbnN0IF9Ib2FEb25Gb3JtID0gY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9kYXRhYmFzZSA9IFwiL3B1YmxpYy9hcGkvaG9hX2Rvbi9cIjtcbiAgICAgICAgY29uc3QgbWF0Y2ggPSBkb2N1bWVudC5jb29raWUubWF0Y2goL3VzZXJuYW1lPShcXHcrKS8pO1xuICAgICAgICB0aGlzLl91c2VybmFtZSA9IG1hdGNoID8gbWF0Y2hbMV0gOiBcIk5vdCBGb3VuZFwiO1xuICAgICAgICB0aGlzLl9saXN0Q1RIRCA9IHt9OyAvL09iamVjdCBiZWNhdXNlIGRhdGEgaGFzIGtleSAnbWFfdGh1b2MnXG4gICAgICAgIHRoaXMuX2hlYWRlckZvcm0gPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX0NUSERUYWJsZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5fZ2hpQ2h1ID0gXCJcIjtcbiAgICB9XG4gICAgc2V0SGVhZGVyKGVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5faGVhZGVyRm9ybSA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMuX2hlYWRlckZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlmICghZS50YXJnZXQpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgZGF0YUFyciA9ICQoZS50YXJnZXQpLnNlcmlhbGl6ZUFycmF5KCk7XG4gICAgICAgICAgICBjb25zdCBkYXRhT2JqID0ge307XG4gICAgICAgICAgICBkYXRhQXJyLmZvckVhY2goKHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgIGRhdGFPYmpbdmFsLm5hbWVdID0gdmFsLnZhbHVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmFkZENUSEQoK2RhdGFPYmpbJ21hX3RodW9jJ10sIGRhdGFPYmpbJ3Rlbl90aHVvYyddLCArZGF0YU9ialsnc29fbHVvbmcnXSwgK2RhdGFPYmpbJ2Rvbl92aSddLCArZGF0YU9ialsnY29zdCddKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNldFRhYmxlKGVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5fQ1RIRFRhYmxlID0gZWxlbWVudDtcbiAgICB9XG4gICAgZ2V0VXNlcm5hbWUoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuX3VzZXJuYW1lKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VzZXJuYW1lO1xuICAgIH1cbiAgICBuZXdIb2FEb24oKSB7XG4gICAgICAgIGZvciAobGV0IGVsIGluIHRoaXMuX2xpc3RDVEhEKSB7XG4gICAgICAgICAgICB0aGlzLl9saXN0Q1RIRFtlbF0ucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogZ2V0IHRvdGFsIGNhc2ggb2YgMSBIb2FEb25cbiAgICAgKi9cbiAgICBnZXRUb3RhbENhc2goKSB7XG4gICAgICAgIGxldCBzdW0gPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IG1hX3RodW9jIG9mIEFycmF5LmZyb20oT2JqZWN0LmtleXModGhpcy5fbGlzdENUSEQpKSkge1xuICAgICAgICAgICAgY29uc3QgY3RoZCA9IHRoaXMuX2xpc3RDVEhEW21hX3RodW9jXTtcbiAgICAgICAgICAgIHN1bSArPSBjdGhkLnRvdGFsQ2FzaDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VtO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYV90aHVvY1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzb2x1b25nXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRvbnZpXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsQ2FzaFxuICAgICAqL1xuICAgIGFkZENUSEQobWFfdGh1b2MsIHRlbl90aHVvYywgc29sdW9uZywgZG9udmksIHRvdGFsQ2FzaCkge1xuICAgICAgICBpZiAodGhpcy5fbGlzdENUSEQuaGFzT3duUHJvcGVydHkobWFfdGh1b2MpKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdTbCA9IHRoaXMuX2xpc3RDVEhEW21hX3RodW9jXS5zbCArIHNvbHVvbmc7XG4gICAgICAgICAgICB0aGlzLl9saXN0Q1RIRC5tYV90aHVvYy51cGRhdGVWYWx1ZSgnc29fbHVvbmcnLCBuZXdTbCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBuZXdDVEhEID0gbmV3IENUSG9hRG9uXzEuQ1RIb2FEb24obWFfdGh1b2MsIHRlbl90aHVvYywgZG9udmksIHNvbHVvbmcsIHRvdGFsQ2FzaCAqIHNvbHVvbmcpO1xuICAgICAgICAgICAgdGhpcy5fbGlzdENUSERbbWFfdGh1b2NdID0gbmV3Q1RIRDtcbiAgICAgICAgICAgIGNvbnN0IHJvd0VsZW1lbnQgPSBuZXdDVEhELmdldFJvd0VsZW1lbnQoKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5fQ1RIRFRhYmxlIHx8ICFyb3dFbGVtZW50KVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHRoaXMuX0NUSERUYWJsZS50Qm9kaWVzWzBdLmluc2VydEJlZm9yZShyb3dFbGVtZW50LCB0aGlzLl9DVEhEVGFibGUudEJvZGllc1swXS5jaGlsZE5vZGVzWzBdKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIHB1c2hUb0RhdGFiYXNlKHN1Y2Nlc3NDYWxsYmFjaywgZXJyb3JDYWxsYmFjaykge1xuICAgICAgICBjb25zdCBob2FEb25JbmZvID0ge1xuICAgICAgICAgICAgdXNlcm5hbWU6IHRoaXMuX3VzZXJuYW1lLFxuICAgICAgICAgICAgdGltZTogKG5ldyBEYXRlKCkpLmdldFRpbWUoKSxcbiAgICAgICAgICAgIGdoaWNodTogdGhpcy5fZ2hpQ2h1XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICBob2FfZG9uOiBob2FEb25JbmZvLFxuICAgICAgICAgICAgY3RoZDogdGhpcy5fbGlzdENUSERcbiAgICAgICAgfTtcbiAgICAgICAgJC5hamF4KHRoaXMuX2RhdGFiYXNlLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIHhockZpZWxkczoge1xuICAgICAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRhdGE6IFwiZGF0YT1cIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICAgICAgc3VjY2VzczogKGpzb24pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoISFqc29uLmVycikge1xuICAgICAgICAgICAgICAgICAgICBlcnJvckNhbGxiYWNrKGpzb24ubXNnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdWNjZXNzQ2FsbGJhY2soKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIGVycm9yQ2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbmV4cG9ydHMuSG9hRG9uRm9ybSA9IF9Ib2FEb25Gb3JtO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9SG9hRG9uRm9ybS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIEJvb3RzdHJhcE1vZGFsIHtcbiAgICBjb25zdHJ1Y3RvcihpZCkge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSB0aGlzLl9jcmVhdGVNb2RhbChpZCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5fZWxlbWVudFswXSk7XG4gICAgfVxuICAgIHNldFRpdGxlKHRleHQpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5maW5kKCcubW9kYWwtdGl0bGUnKS50ZXh0KHRleHQpO1xuICAgIH1cbiAgICBzZXRDb250ZW50KGh0bWwpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5maW5kKCcubW9kYWwtYm9keScpLmh0bWwoaHRtbCk7XG4gICAgfVxuICAgIHNob3codGl0bGUsIGNvbnRlbnQpIHtcbiAgICAgICAgdGhpcy5zZXRUaXRsZSh0aXRsZSk7XG4gICAgICAgIHRoaXMuc2V0Q29udGVudChjb250ZW50KTtcbiAgICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfVxuICAgIG9wZW4oKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQubW9kYWwoJ3Nob3cnKTtcbiAgICB9XG4gICAgY2xvc2UoKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQubW9kYWwoJ2hpZGUnKTtcbiAgICB9XG4gICAgX2NyZWF0ZU1vZGFsKGlkKSB7XG4gICAgICAgIGNvbnN0IGRpdiA9ICQoXCI8ZGl2Lz5cIik7XG4gICAgICAgIGRpdi5hdHRyKCdpZCcsIGlkKTtcbiAgICAgICAgZGl2LmFkZENsYXNzKCdtb2RhbCBmYWRlJykuZGF0YSgndG9nZ2xlJywgJ21vZGFsJyk7XG4gICAgICAgIGRpdi5odG1sKGBcbiAgICAgICAgPGRpdiBjbGFzcz0nbW9kYWwtZGlhbG9nIG1vZGFsLWxnIG1vZGFsLWNlbnRlcic+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1jb250ZW50Jz5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1oZWFkZXInPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC10aXRsZSc+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J2Nsb3NlJyBkYXRhLWRpc21pc3M9J21vZGFsJz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPSdmYSBmYS10aW1lcyc+PC9pPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1ib2R5Jz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1mb290ZXInPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPSdidG4gYnRuLXNlY29uZGFyeScgZGF0YS1kaXNtaXNzPSdtb2RhbCc+Q2xvc2U8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1wcmltYXJ5Jz5PSzwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICBgKTtcbiAgICAgICAgcmV0dXJuIGRpdjtcbiAgICB9XG59XG5leHBvcnRzLkJvb3RzdHJhcE1vZGFsID0gQm9vdHN0cmFwTW9kYWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgTW9kZWxDbGFzc18xID0gcmVxdWlyZShcIi4uL01vZGVsQ2xhc3NcIik7XG5jbGFzcyBfRG9uVmkgZXh0ZW5kcyBNb2RlbENsYXNzXzEuTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmRhdGFiYXNlID0gXCIvYXBpL2Rvbl92aS9cIjtcbiAgICAgICAgdGhpcy5mZXRjaERhdGEgPSBudWxsO1xuICAgIH1cbiAgICBnZXQoY2FsbGJhY2sgPSAoZXJyLCBkYXRhKSA9PiB7IH0pIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHRoaXMuX2dldCh7fSk7XG4gICAgICAgICAgICAgICAgdGhpcy5mZXRjaERhdGEgPSB0aGlzLl9maWx0ZXIoZGF0YSk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UsIHRoaXMuZmV0Y2hEYXRhKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5mZXRjaERhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9maWx0ZXIocmF3RGF0YSkge1xuICAgICAgICBjb25zdCBuZXdEYXRhID0gcmF3RGF0YS5zbGljZSgpO1xuICAgICAgICBjb25zdCBtYXAgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCByb3cgb2YgbmV3RGF0YSkge1xuICAgICAgICAgICAgY29uc3QgaGVzbyA9IHJvdy5oZV9zb19xdXlkb2k7XG4gICAgICAgICAgICBtYXBbcm93LmlkXSA9IHJvdztcbiAgICAgICAgICAgIHJvdy50ZXh0UXV5RG9pID0gaGVzbyA/IFwiXCIgOiBcIsSRxqFuIHbhu4sgY8ahIGLhuqNuXCI7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgcm93IG9mIG5ld0RhdGEpIHtcbiAgICAgICAgICAgIGxldCBpZF9jb19iYW4gPSByb3cuaWRfcXV5X2RvaTtcbiAgICAgICAgICAgIGxldCBoZXNvID0gK3Jvdy5oZV9zb19xdXlkb2k7XG4gICAgICAgICAgICB3aGlsZSAobWFwLmhhc093blByb3BlcnR5KGlkX2NvX2JhbikpIHtcbiAgICAgICAgICAgICAgICByb3dbJ3RleHRRdXlEb2knXSArPSBgPSR7aGVzb314WyR7bWFwW2lkX2NvX2Jhbl1bJ3RlbiddfV1gO1xuICAgICAgICAgICAgICAgIGhlc28gKj0gK21hcFtpZF9jb19iYW5dWydoZV9zb19xdXlkb2knXTtcbiAgICAgICAgICAgICAgICBpZF9jb19iYW4gPSBtYXBbaWRfY29fYmFuXVsnaWRfcXV5X2RvaSddO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEYXRhO1xuICAgIH1cbn1cbmV4cG9ydHMuRG9uVmkgPSBfRG9uVmk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmRhdGFiYXNlID0gXCJcIjtcbiAgICAgICAgdGhpcy5kYXRhID0gW107XG4gICAgfVxuICAgIGdldCByZXNwb25zZSgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMucmVzKTtcbiAgICB9XG4gICAgLy8gPT09PT09PT09PT09PT09IElOSEVSSVQgRlVOQ1xuICAgIGdldChwYXJhbXMsIG9mZnNldCwgbGltaXQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjcmVhdGUoZGF0YSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogdXBkYXRlIHJlY29yZFxuICAgICAqIEBwYXJhbSBmaWVsZE1hdGNoIG1hdGNoIGZpZWxkIHRvIHVwZGF0ZSByZWNvcmRcbiAgICAgKiBAcGFyYW0gZmllbGRVcGRhdGUgdGhlIGRhdGEgbmVlZCB1cGRhdGVcbiAgICAgKi9cbiAgICB1cGRhdGUoZmllbGRNYXRjaCwgZmllbGRVcGRhdGUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJlbW92ZSBhIHJlY29yZFxuICAgICAqIEBwYXJhbSBmaWVsZE1hdGNoIGZpZWxkIG1hdGNoIHRvIHJlbW92ZVxuICAgICAqIEByZXR1cm4gdHJ1ZSBvZiBmYWxzZVxuICAgICAqL1xuICAgIHJlbW92ZShmaWVsZE1hdGNoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyA9PT09PT09PT09PT09PT0gQ09SRSBGVU5DXG4gICAgLyoqXG4gICAgICogZmV0Y2ggZGF0YSBmcm9tIGRhdGFiYXNlIGFuZCBkbyB0aGluZ1xuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKi9cbiAgICBfZ2V0KHBhcmFtcywgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IFtdO1xuICAgICAgICAgICAgY29uc3QgcmVxdWVzdFVSTCA9IHRoaXMuZGF0YWJhc2UgKyB0aGlzLl91cmxwYXJhbXMocGFyYW1zKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0geWllbGQgZmV0Y2gocmVxdWVzdFVSTCwgeyBjcmVkZW50aWFsczogXCJpbmNsdWRlXCIgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QganNvbiA9IHlpZWxkIHJlcy5qc29uKCk7XG4gICAgICAgICAgICAgICAgaWYgKGpzb24uZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihqc29uLm1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IGpzb24uZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UsIGpzb24uZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBqc29uLmRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogcG9zdCByZXF1ZXN0XG4gICAgICogQHBhcmFtIHthbnl9IGRhdGFcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdXG4gICAgICovXG4gICAgX3Bvc3QoZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMucmVzID0gXCJcIjtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0geWllbGQgZmV0Y2godGhpcy5kYXRhYmFzZSwge1xuICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCBqc29uID0geWllbGQgcmVzLmpzb24oKTtcbiAgICAgICAgICAgICAgICBpZiAoanNvbi5lcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGpzb24ubXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXMgPSBqc29uLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlLCBqc29uLmRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4ganNvbi5kYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF91cmxwYXJhbXMocGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IE9iamVjdC5rZXlzKHBhcmFtcykubWFwKChrKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KGspICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQocGFyYW1zW2tdKTtcbiAgICAgICAgfSkuam9pbihcIiZcIik7XG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfVxufVxuZXhwb3J0cy5Nb2RlbCA9IE1vZGVsO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IE1vZGVsQ2xhc3NfMSA9IHJlcXVpcmUoXCIuLi9Nb2RlbENsYXNzXCIpO1xuY2xhc3MgX05zeCBleHRlbmRzIE1vZGVsQ2xhc3NfMS5Nb2RlbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZGF0YWJhc2UgPSBcIi9hcGkvbmNjL1wiO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBnZXQgZGF0YSBvZiBuc3hcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKi9cbiAgICBnZXQocGFyYW1zLCBvZmZzZXQsIGxpbWl0KSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgdGhpcy5fZ2V0KHsgcGFyYW1zLCBvZmZzZXQsIGxpbWl0IH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuTnN4ID0gX05zeDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4vKipcbiAqIERpc3BsYXkgZGF0YSB1bmRlciB0YWJsZVxuICovXG5jbGFzcyBUYWJsZURhdGEge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9tYXAgPSB7fTtcbiAgICAgICAgdGhpcy5fbGlzdCA9IFtdO1xuICAgICAgICB0aGlzLl9pc0Nvbm5lY3QgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fY29ubmVjdFN0YXR1cyA9IFwiXCI7XG4gICAgICAgIHRoaXMuX2lzRmV0Y2hlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9kYlVSTCA9IFwiXCI7XG4gICAgfVxuICAgIGdldERhdGEoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBsZXQgcmVzID0geWllbGQgZmV0Y2godGhpcy5fZGJVUkwsIHsgbWV0aG9kOiBcIkdFVFwiLCBjcmVkZW50aWFsczogJ2luY2x1ZGUnIH0pO1xuICAgICAgICAgICAgaWYgKCFyZXMub2spIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0Nvbm5lY3QgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25uZWN0U3RhdHVzID0gcmVzLnN0YXR1c1RleHQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5faXNDb25uZWN0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3RTdGF0dXMgPSBcIlwiO1xuICAgICAgICAgICAgbGV0IGpzb24gPSB5aWVsZCByZXMuanNvbigpO1xuICAgICAgICAgICAgaWYgKCEhanNvbi5lcnIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0ZldGNoZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25uZWN0U3RhdHVzID0ganNvbi5tc2c7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5faXNGZXRjaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3RTdGF0dXMgPSBcIk9LXCI7XG4gICAgICAgICAgICB0aGlzLl9saXN0ID0ganNvbi5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0IHRhYmxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWFwO1xuICAgIH1cbiAgICBnZXQgbGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3Q7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gVGFibGVEYXRhO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IFRhYmxlRGF0YV8xID0gcmVxdWlyZShcIi4uL1RhYmxlRGF0YVwiKTtcbmNsYXNzIEJhbmdUaHVvYyBleHRlbmRzIFRhYmxlRGF0YV8xLmRlZmF1bHQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9kYlVSTCA9IFwiL2FwaS90aHVvYy9cIjtcbiAgICB9XG4gICAgdXBkYXRlKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgdGhpcy5nZXREYXRhKCk7XG4gICAgICAgICAgICBmb3IgKGxldCByb3cgb2YgdGhpcy5fbGlzdCkge1xuICAgICAgICAgICAgICAgIGxldCBpZCA9IHJvd1snaWQnXTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXBbaWRdID0gcm93O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLkJhbmdUaHVvYyA9IEJhbmdUaHVvYztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUJhbmdUaHVvYy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgTW9kZWxDbGFzc18xID0gcmVxdWlyZShcIi4uL01vZGVsQ2xhc3NcIik7XG5jb25zdCBCYW5nVGh1b2NfMSA9IHJlcXVpcmUoXCIuL0JhbmdUaHVvY1wiKTtcbmV4cG9ydHMuQmFuZ1RodW9jID0gQmFuZ1RodW9jXzEuQmFuZ1RodW9jO1xuY2xhc3MgVGh1b2MgZXh0ZW5kcyBNb2RlbENsYXNzXzEuTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmRhdGFiYXNlID0gXCIvYXBpL3RodW9jL1wiO1xuICAgIH1cbiAgICBnZXQocGFyYW1zLCBvZmZzZXQsIGxpbWl0KSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICByZXR1cm4geWllbGQgdGhpcy5fZ2V0KHsgcGFyYW1zLCBvZmZzZXQsIGxpbWl0IH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY3JlYXRlKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMucmVzID0geWllbGQgdGhpcy5fcG9zdChkYXRhKTtcbiAgICAgICAgICAgIHJldHVybiAoIXRoaXMucmVzLmVycik7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuVGh1b2MgPSBUaHVvYztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgaW5wdXRQcmV2aWV3MiB7XG4gICAgY29uc3RydWN0b3IodGFyZ2V0ID0gZG9jdW1lbnQpIHtcbiAgICAgICAgdGhpcy5fbGlzdCA9IHt9O1xuICAgICAgICB0aGlzLl9kYXRhID0gW107XG4gICAgICAgIHRoaXMuX2xvb2t1cCA9IHt9O1xuICAgICAgICB0aGlzLl90YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgIHRoaXMuX3ByZXZpZXdfZGl2ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fY3VycmVudFByZXZpZXdEYXRhID0gW107XG4gICAgICAgIC8vIGNvbnN0cnVjdG9yICAgIFxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0O1xuICAgICAgICAgICAgaWYgKCF0YXJnZXQuY2xhc3NMaXN0Lmhhc093blByb3BlcnR5KFwicHJldmlldy1yb3dcIikpXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVsZXRlUHJldmlldygpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogYWRkIGxvb2t1cCB0byBqc29uIG5hbWVcbiAgICAgKiBAcGFyYW0ge3tpZEVsOiBTdHJpbmd9fSBhcnIgeyBpZF9lbGVtZW50IDogbmFtZV9vZl9maWVsZH1cbiAgICAgKi9cbiAgICBhZGRMb29rdXAoYXJyKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYXJyICE9IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKE9iamVjdC5jYWxsKGFycikpO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicGFyYW1ldGVyIG11c3QgYmUganNvbiBvYmpcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKGFycikpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvb2t1cFtrZXldID0gYXJyW2tleV07XG4gICAgICAgICAgICBsZXQgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChrZXkpO1xuICAgICAgICAgICAgaWYgKCFlbCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKEVycm9yKGBDYW5ub3QgZmluZCAjJHtrZXl9IGVsZW1lbnRgKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9saXN0W2tleV0gPSBlbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICA7XG4gICAgLyoqXG4gICAgICogYWRkIGhvc3QgdG8gZmV0Y2ggZGF0YWJhc2VcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIGFzZFxuICAgICAqL1xuICAgIGFkZERhdGEoZGF0YSkge1xuICAgICAgICBpZiAodHlwZW9mIChkYXRhKSAhPSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJhbWV0ZXIgbXVzdCBiZSBqc29uXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICAgIH1cbiAgICA7XG4gICAgbGlzdGVuKGlkLCBjYWxsYmFjaykge1xuICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgbGV0IGN1ciA9IDA7XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGxldCBjb2RlID0gZS5rZXlDb2RlO1xuICAgICAgICAgICAgaWYgKGNvZGUgPT09IDI3KSB7IC8vIGVzY1xuICAgICAgICAgICAgICAgIHRoaXMuX2RlbGV0ZVByZXZpZXcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvZGUgPT0gMzggfHwgY29kZSA9PSA0MCkgeyAvLyB1cC1kb3duXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3ByZXZpZXdfZGl2LmNoaWxkcmVuW2N1cl0uY2xhc3NMaXN0LnJlbW92ZShcInByZXZpZXctcm93LWFjdGl2ZVwiKTtcbiAgICAgICAgICAgICAgICBsZXQgbGVuID0gdGhpcy5fcHJldmlld19kaXYuY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGN1ciA9IChjb2RlID09IDM4KSA/IGN1ciAtIDEgOiBjdXIgKyAxO1xuICAgICAgICAgICAgICAgIGlmIChjdXIgPCAwKVxuICAgICAgICAgICAgICAgICAgICBjdXIgPSBsZW4gLSAxO1xuICAgICAgICAgICAgICAgIGlmIChjdXIgPiBsZW4gLSAxKVxuICAgICAgICAgICAgICAgICAgICBjdXIgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuX3ByZXZpZXdfZGl2LmNoaWxkcmVuW2N1cl0uY2xhc3NMaXN0LmFkZChcInByZXZpZXctcm93LWFjdGl2ZVwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmV2aWV3X2Rpdi5zZXRBdHRyaWJ1dGUoXCJjdXJcIiwgY3VyICsgXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjb2RlID09IDEzKSB7IC8vIGVudGVyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRoaXMuX2N1cnJlbnRQcmV2aWV3RGF0YVtjdXJdKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWxldGVQcmV2aWV3KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZldGNoT24oaWQsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICogZmV0Y2ggZGF0YWJhc2UgYW5kIHNob3cgaW4gaW5wdXRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgaWQgb2YgaHRtbCBlbGVtZW50IGlucHV0IG5lZWQgdG8gZmV0Y2ggYnkgdmFsdWVcbiAgICAgKi9cbiAgICBmZXRjaE9uKGlkLCBjYWxsYmFjaykge1xuICAgICAgICB0aGlzLl9kZWxldGVQcmV2aWV3KCk7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRQcmV2aWV3RGF0YS5sZW5ndGggPSAwOyAvL2NsZWFyIGN1cnJlbnQgcHJldmlldyBzdWdnZXN0IG5hbWVcbiAgICAgICAgaWYgKCF0aGlzLl9saXN0Lmhhc093blByb3BlcnR5KGlkKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDYW5ub3QgZmluZCBcIiArIGlkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgICAgIGxldCBpbnB1dCA9IHRoaXMuX2xpc3RbaWRdO1xuICAgICAgICBsZXQgaW5wdXRfcHJldmlldyA9IHRoaXMuX2NyZWF0ZUZseVdyYXAoaW5wdXQpO1xuICAgICAgICBsZXQgdmFsdWUgPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgdGhpcy5fcHJldmlld19kaXYgPSBpbnB1dF9wcmV2aWV3O1xuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2F1dG9jb21wbGV0ZScsICdvZmYnKTtcbiAgICAgICAgZm9yIChjb25zdCByb3cgb2YgdGhpcy5fZGF0YSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9pc0xpa2Uocm93W3RoaXMuX2xvb2t1cFtpZF1dLCB2YWx1ZSkpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50UHJldmlld0RhdGEucHVzaChyb3cpO1xuICAgICAgICAgICAgbGV0IGFyciA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBuYW1lIG9mIE9iamVjdC5rZXlzKHRoaXMuX2xvb2t1cCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMuX2xvb2t1cFtuYW1lXTtcbiAgICAgICAgICAgICAgICBhcnIucHVzaChyb3dbZmllbGRdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBuZXdSb3cgPSB0aGlzLl9jcmVhdGVGbHlSb3coYXJyKTtcbiAgICAgICAgICAgIG5ld1Jvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhyb3cpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2RlbGV0ZVByZXZpZXcoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaW5wdXRfcHJldmlldy5hcHBlbmRDaGlsZChuZXdSb3cpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbnB1dF9wcmV2aWV3KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICA7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtIVE1MRGl2RWxlbWVudH0gZWxlbWVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICAgICAqL1xuICAgIF9jcmVhdGVGbHlXcmFwKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKCFlbGVtZW50KVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGxldCByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGRpdi5jbGFzc05hbWUgPSBcInByZXZpZXctaW5wdXRcIjtcbiAgICAgICAgZGl2LnN0eWxlLm1pbldpZHRoID0gcmVjdC53aWR0aCArIFwicHhcIjtcbiAgICAgICAgZGl2LnN0eWxlLnRvcCA9ICtyZWN0LnRvcCArIHJlY3QuaGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICBkaXYuc3R5bGUubGVmdCA9ICtyZWN0LmxlZnQgKyBcInB4XCI7XG4gICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoXCJjdXJcIiwgXCIwXCIpO1xuICAgICAgICByZXR1cm4gZGl2O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHt0cnVlfSBpZiBzdHIxIGxpa2Ugc3RyMlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIxXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0cjJcbiAgICAgKi9cbiAgICBfaXNMaWtlKHN0cjEsIHN0cjIpIHtcbiAgICAgICAgc3RyMSA9IHN0cjEudHJpbSgpO1xuICAgICAgICBzdHIyID0gc3RyMi50cmltKCk7XG4gICAgICAgIGlmIChzdHIxID09IFwiXCIgfHwgc3RyMiA9PSBcIlwiKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBzdHIxID0gc3RyMS5ub3JtYWxpemUoKTtcbiAgICAgICAgc3RyMiA9IHN0cjIubm9ybWFsaXplKCk7XG4gICAgICAgIHN0cjEgPSBzdHIxLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHN0cjIgPSBzdHIyLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGxldCByZWcgPSBuZXcgUmVnRXhwKGBeLioke3N0cjJ9LiokYCk7XG4gICAgICAgIHJldHVybiBzdHIxLm1hdGNoKHJlZyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFyclZhbHVlc1xuICAgICAqL1xuICAgIF9jcmVhdGVGbHlSb3coYXJyVmFsdWVzKSB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShhcnJWYWx1ZXMpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgcm93LmNsYXNzTmFtZSA9IFwicHJldmlldy1yb3dcIjtcbiAgICAgICAgZm9yIChsZXQgdmFsdWUgb2YgYXJyVmFsdWVzKSB7XG4gICAgICAgICAgICBsZXQgY29sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIGNvbC5zdHlsZS5tYXJnaW4gPSBcImF1dG9cIjtcbiAgICAgICAgICAgIGNvbC50ZXh0Q29udGVudCA9IHZhbHVlO1xuICAgICAgICAgICAgcm93LmFwcGVuZENoaWxkKGNvbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvdztcbiAgICB9XG4gICAgX2RlbGV0ZVByZXZpZXcoKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucHJldmlldy1pbnB1dFwiKS5mb3JFYWNoKCh2YWwpID0+IHtcbiAgICAgICAgICAgIHZhbC5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gaW5wdXRQcmV2aWV3Mjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlucHV0UHJldmlldzIuanMubWFwIiwiY29uc3Qge0RvblZpfSA9IHJlcXVpcmUoJy4uL2FwcC9Nb2RlbC9Eb25WaS8nKTtcbmNvbnN0IHtCb290c3RyYXBNb2RhbH0gPSByZXF1aXJlKCcuLi9hcHAvTW9kZWwvQm9vc3RyYXBNb2RhbCcpO1xuXG5jb25zdCBkb252aSA9IG5ldyBEb25WaSgpO1xuXG4kKGRvY3VtZW50KS5yZWFkeShhc3luYyAoKT0+e1xuICAgIGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVRhYmxlKCkge1xuICAgICAgICBjb25zdCB0YWJsZSA9ICQoXCIjbmhhcF9kb25fdmktLXRhYmxlIHRib2R5XCIpO1xuICAgICAgICB0YWJsZS5jaGlsZHJlbigpLnJlbW92ZSgpO1xuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgZG9udmkuZ2V0KCk7XG4gICAgICAgIGZvciAoY29uc3Qgcm93IG9mIGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnN0IHRyID0gJCgnPHRyLz4nKS5odG1sKGBcbiAgICAgICAgICAgICAgICA8dGQ+JHtyb3cuaWR9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQ+JHtyb3cudGVufTwvdGQ+XG4gICAgICAgICAgICBgKTtcbiAgICAgICAgICAgIHRhYmxlLmFwcGVuZCh0cik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVUYWJsZSgpO1xuXG59KTtcbiIsImNvbnN0IHtIb2FEb25Gb3JtfSA9IHJlcXVpcmUoJy4uL2FwcC9Ib2FEb25Gb3JtJyk7XG5jb25zdCB7UUxOVH0gPSByZXF1aXJlKCcuLi9hcHAvQXBwJyk7XG5jb25zdCB7Qm9vdHN0cmFwTW9kYWx9ID0gcmVxdWlyZSgnLi4vYXBwL01vZGVsL0Jvb3N0cmFwTW9kYWwnKTtcbmNvbnN0IENPTkZJRyA9IHJlcXVpcmUoJy4uLy4uL2NvbmZpZycpO1xuXG5jb25zdCBob2FEb25Gb3JtID0gbmV3IEhvYURvbkZvcm0oKTtcbmNvbnN0IEFwcCA9IG5ldyBRTE5UKCk7XG5jb25zdCBwb3B1cCA9IG5ldyBCb290c3RyYXBNb2RhbCgnbmhhcF9ob2FfZG9uLS1wb3B1cCcpO1xuXG5mdW5jdGlvbiBkaXNwbGF5VGltZSgpIHtcbiAgICBsZXQgbm93ID0gbmV3IERhdGUoKTtcbiAgICAkKFwiI3RpbWUtZGF0ZVwiKS50ZXh0KG5vdy50b0xvY2FsZURhdGVTdHJpbmcoKSk7XG4gICAgJChcIiN0aW1lLXRpbWVcIikudGV4dChub3cudG9Mb2NhbGVUaW1lU3RyaW5nKCkpO1xufVxuXG5mdW5jdGlvbiBsb29wU2hvd1RpbWUoKSB7XG4gICAgc2V0SW50ZXJ2YWwoKCk9PntcbiAgICAgICAgZGlzcGxheVRpbWUoKTtcbiAgICB9LCAxMDAwKTtcbn1cblxuZnVuY3Rpb24gZGlzcGxheVVzZXIoKSB7XG4gICAgbGV0IHVzZXJuYW1lID0gaG9hRG9uRm9ybS5nZXRVc2VybmFtZSgpO1xuICAgICQoXCIjbmhhcF9ob2FfZG9uLS11c2VybmFtZVwiKS50ZXh0KHVzZXJuYW1lKTtcbn1cblxuZnVuY3Rpb24gZm9jdXNUZW5UaHVvY0ZpcnN0KCkge1xuICAgICQoXCIjbmhhcF9ob2FfZG9uLS10ZW4tdGh1b2NcIikuZm9jdXMoKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVG9uZ0dpYSgpIHtcbiAgICBsZXQgdG9uZyA9IDA7XG4gICAgbGV0IGxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3RoZC1naWEnKTtcbiAgICBmb3IgKGxldCB2YWwgb2YgbGlzdCkge1xuICAgICAgICBsZXQgZ2lhID0gcGFyc2VJbnQodmFsLnRleHRDb250ZW50LnJlcGxhY2UoL1xcRC8sICcnKSk7XG4gICAgICAgIHRvbmcgKz0gZ2lhO1xuICAgIH1cbiAgICBjb25zdCB2YWwgPSB0b25nLnRvTG9jYWxlU3RyaW5nKCkrJyBWTsSQJztcblxuICAgICQoXCIjbmhhcF9ob2FfZG9uLS1zdW1cIikuYXR0cignY3VyVmFsJywgdmFsKTtcbiAgICBpZiAoISQoJyNraWV1LWxpZXUnKVswXS5jaGVja2VkKSAkKCcjbmhhcF9ob2FfZG9uLS1zdW0nKS52YWwodmFsKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVGllblRob2koKSB7XG4gICAgbGV0IHN1bSA9ICQoXCIjbmhhcF9ob2FfZG9uLS1zdW1cIikudmFsKCkucmVwbGFjZSgvW1xcRFxcc10vZywgJycpO1xuICAgIGxldCB0aWVua2ggPSAkKFwiI25oYXBfaG9hX2Rvbi0tdGllbmtoLXRyYVwiKS52YWwoKS5yZXBsYWNlKC9bXFxEXFxzXS9nLCAnJyk7XG5cbiAgICBsZXQgdGllblRob2kgPSBwYXJzZUludCh0aWVua2gpIC0gcGFyc2VJbnQoc3VtKTtcbiAgICB0aWVuVGhvaSA9IHRpZW5UaG9pID49IDAgPyB0aWVuVGhvaS50b0xvY2FsZVN0cmluZygpIDogJ35sb2knO1xuXG4gICAgJChcIiNuaGFwX2hvYV9kb24tLXRob2l0aWVuXCIpLnZhbCh0aWVuVGhvaSk7XG59XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIGxvb3BTaG93VGltZSgpO1xuICAgIGRpc3BsYXlVc2VyKCk7XG4gICAgZm9jdXNUZW5UaHVvY0ZpcnN0KCk7XG5cbiAgICBBcHAuYWRkU2VsZWN0SW5wdXQoJCgnW2NvbXBvbmVudD1cIkRvblZpXCJdJyksIHtcbiAgICAgICAgdGl0bGU6ICd0ZW4nLFxuICAgICAgICB2YWx1ZTogJ2lkJyxcbiAgICB9KTtcblxuICAgIEFwcC5vblVwZGF0ZUFsbCgpO1xuXG4gICAgJCgnI25oYXBfaG9hX2Rvbi0tdGllbmtoLXRyYScpLm1vbmV5SW5wdXQoKS5vbigna2V5dXAnLCAoKT0+e1xuICAgICAgICB1cGRhdGVUaWVuVGhvaSgpO1xuICAgIH0pO1xuXG4gICAgJCgnI25oYXBfaG9hX2Rvbi0taG9hZG9uLWZvcm0nKS5zdWJtaXQoKGUpPT57XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBob2FEb25Gb3JtLnB1c2hUb0RhdGFiYXNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCgnI25oYXBfaG9hX2Rvbi0taG9hZG9uLWZvcm0nKS5maW5kKCdpbnB1dCwgc2VsZWN0JykudmFsKCcnKTtcbiAgICAgICAgICAgICQoJyNuaGFwX2hvYV9kb24tLWZvcm0tbmhhcCcpLmZpbmQoJ2lucHV0LCBzZWxlY3QnKS52YWwoJycpO1xuICAgICAgICAgICAgaG9hRG9uRm9ybS5uZXdIb2FEb24oKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGhvYURvbkZvcm0pO1xuICAgICAgICAgICAgcG9wdXAuc2hvdygnT0snLCAnJyk7XG4gICAgICAgIH0sIChlcnIpPT57XG4gICAgICAgICAgICBwb3B1cC5zaG93KCdFcnJvcicsIGVyci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBBcHAuYWRkTmFtZUlucHV0VGh1b2MoXCJuaGFwX2hvYV9kb24tLXRlbl90aHVvY1wiLCB7XG4gICAgICAgIFwibmhhcF9ob2FfZG9uLS1tYV90aHVvY1wiOiBcIm1hXCIsXG4gICAgICAgIFwibmhhcF9ob2FfZG9uLS10ZW5fdGh1b2NcIjogXCJ0ZW5cIixcbiAgICAgICAgXCJuaGFwX2hvYV9kb24tLWRvbl92aVwiOiBcImRvbl92aVwiLFxuICAgICAgICBcIm5oYXBfaG9hX2Rvbi0tY29zdFwiOiBcImRvbl9naWFcIixcbiAgICB9LCB7XG4gICAgICAgIFwibmhhcF9ob2FfZG9uLS10ZW5fdGh1b2NcIjogXCJ0ZW5cIixcbiAgICAgICAgXCJuaGFwX2hvYV9kb24tLW1hX3RodW9jXCI6IFwibWFcIixcbiAgICAgICAgXCJuaGFwX2hvYV9kb24tLWRvbl92aVwiOiBcImRvbl92aVwiLFxuICAgICAgICBcIm5oYXBfaG9hX2Rvbi0tY29zdFwiOiBcImRvbl9naWFcIixcbiAgICB9KTtcblxuICAgICQoXCIjbmhhcF9ob2FfZG9uLS1mb3JtLW5oYXBcIikub24oJ3N1Ym1pdCcsIChlKT0+e1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICQoXCIjbmhhcF9ob2FfZG9uLS1mb3JtLW5oYXBcIikuZmluZCgnaW5wdXQsIHNlbGVjdCcpLnZhbCgnJyk7XG4gICAgICAgIHVwZGF0ZVRvbmdHaWEoKTtcbiAgICB9KTtcblxuICAgICQoXCIja2lldS1saWV1XCIpLmNsaWNrKCgpID0+IHtcbiAgICAgICAgJCgnI25oYXBfaG9hX2Rvbi0tc3VtJykudmFsKENPTkZJRy5HSUFfQkFOX1RIRU9fTElFVSk7XG4gICAgfSk7XG4gICAgJCgnI2tpZXUtYmFubGUnKS5jbGljaygoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN1bSA9ICQoJyNzdW0nKTtcbiAgICAgICAgY29uc3QgdmFsID0gc3VtLmF0dHIoJ2N1clZhbCcpO1xuICAgICAgICBzdW0udmFsKHZhbCk7XG4gICAgfSk7XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbn0pO1xuIiwiY29uc3Qge05zeH0gPSByZXF1aXJlKCcuLi9hcHAvTW9kZWwvTnN4Jyk7XG5cbiQoZG9jdW1lbnQpLnJlYWR5KCgpPT57XG4gICAgY29uc3QgcG9wdXAgPSBuZXcgU3RhdHVzUG9wdXAoKTtcbiAgICBjb25zdCBuc3ggPSBuZXcgTnN4KCk7XG5cbiAgICBwb3B1cC5jcmVhdGUoKTtcbiAgICB1cGRhdGVOU1goKTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZVRhYmxlUm93KHZhbCkge1xuICAgICAgICBsZXQgcm93ID0gJChcIjx0ci8+XCIpO1xuICAgICAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXModmFsKSkge1xuICAgICAgICAgICAgcm93LmFwcGVuZCgkKCc8dGQvPicpLnRleHQodmFsW2tleV0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcm93O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZU5TWCgpIHtcbiAgICAgICAgJCgnI3RhYmxlLWJvZHknKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xuICAgICAgICBuc3guZ2V0KChlcnIsIGRhdGEpPT57XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCByb3cgb2YgZGF0YSkge1xuICAgICAgICAgICAgICAgICQoXCIjdGFibGUtYm9keVwiKS5hcHBlbmQoY3JlYXRlVGFibGVSb3cocm93KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBkYXRhIHJlcXVlc3RcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgbGV0IGRhdGEgPSBlLmRhdGE7XG4gICAgICAgIGlmIChkYXRhLm1zZyA9PSAndXBkYXRlJykge1xuICAgICAgICAgICAgdXBkYXRlTlNYKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuIiwiY29uc3Qge1RodW9jLCBCYW5nVGh1b2N9ID0gcmVxdWlyZSgnLi4vYXBwL01vZGVsL1RodW9jJyk7XG5jb25zdCB0aHVvYyA9IG5ldyBUaHVvYygpO1xuY29uc3QgYmFuZ1RodW9jID0gbmV3IEJhbmdUaHVvYygpO1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICBhc3luYyBmdW5jdGlvbiB1cGRhdGVUYWJsZSgpIHtcbiAgICAgICAgY29uc3QgdGFibGUgPSAkKFwiI25oYXBfdGh1b2MtLXRhYmxlIHRib2R5XCIpO1xuICAgICAgICB0YWJsZS5jaGlsZHJlbigpLnJlbW92ZSgpO1xuICAgICAgICBhd2FpdCBiYW5nVGh1b2MudXBkYXRlKCk7XG4gICAgICAgIGZvciAoY29uc3Qgcm93IG9mIGJhbmdUaHVvYy5saXN0KSB7XG4gICAgICAgICAgICBjb25zdCBwcmljZVN0cmluZyA9ICgrcm93LmRvbl9naWEpLnRvTG9jYWxlU3RyaW5nKCk7XG4gICAgICAgICAgICBjb25zdCB0ciA9ICQoJzx0ci8+JykuaHRtbChgXG4gICAgICAgICAgICAgICAgPHRkPiR7cm93Lm1hfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkPiR7cm93LnRlbn08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZD4ke3Jvdy50ZW5fbnN4fTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkPiR7cHJpY2VTdHJpbmd9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQ+JHtyb3cuc29fbHVvbmd9PC90ZD5cbiAgICAgICAgICAgIGApO1xuICAgICAgICAgICAgdGFibGUuYXBwZW5kKHRyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICQoXCIjbmhhcF90aHVvYy0tZm9ybVwiKS5vbihcInN1Ym1pdFwiLCBmdW5jdGlvbiBOaGFwVGh1b2NGb3JtU3VibWl0KGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgICQodGhpcykuc2VyaWFsaXplQXJyYXkoKS5mb3JFYWNoKCh2YWwpPT57XG4gICAgICAgICAgICBkYXRhW3ZhbC5uYW1lXSA9IHZhbC52YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRodW9jLmNyZWF0ZShkYXRhLCAoZXJyKT0+e1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB1cGRhdGVUYWJsZSgpO1xufSk7XG4iXX0=
