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
        const lookName = Array.from(nameTHs)
            .map((val) => val.getAttribute('for'));
        const updateTable = function (err, data) {
            if (err)
                return;
            let body = element.querySelector('tbody');
            // delete old row
            let trbody = element.querySelectorAll('tbody tr');
            if (trbody && trbody.length) {
                for (let el of trbody)
                    el.removeChild();
            }
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
            for (let idEl in optChange) {
                if (!optChange.hasOwnProperty(idEl))
                    continue;
                $('#' + idEl).val(data[optChange[idEl]]);
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
        let valueKey = opt.value;
        let titleKey = opt.title;
        let compoName = element.getAttribute('component');
        const onUpdate = function (err, data) {
            if (err) {
                console.log(err);
                return;
            }
            // remove old options
            let oldOpt = element.childNodes;
            if (oldOpt.length)
                oldOpt.forEach((val) => val.remove());
            // add updated option
            for (let row of data) {
                let value = row[valueKey];
                let title = row[titleKey];
                let newOpt = document.createElement("option");
                newOpt.value = value;
                newOpt.textContent = title;
                element.appendChild(newOpt);
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
        this._database = "/api/don_vi/";
        this._fetchData = null;
    }
    get(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._get({}, (err, data) => {
                if (!!err) {
                    console.log(err);
                    return;
                }
                this._fetchData = this._filter(data);
                callback(err, this._fetchData);
            });
            return this._fetchData;
        });
    }
    _filter(rawData) {
        let newData = rawData.slice();
        let map = {};
        for (let row of newData) {
            map[row['id']] = row;
            let heso = row['he_so_quydoi'];
            if (!heso) {
                row['textQuyDoi'] = "đơn vị cơ bản";
            }
            else {
                row['textQuyDoi'] = "";
            }
        }
        for (let row of newData) {
            let id_co_ban = row['id_quy_doi'];
            let heso = +row['he_so_quydoi'];
            if (map.hasOwnProperty(id_co_ban)) {
                while (map.hasOwnProperty(id_co_ban)) {
                    row['textQuyDoi'] += `=${heso}x[${map[id_co_ban]['ten']}]`;
                    heso *= +map[id_co_ban]['he_so_quydoi'];
                    id_co_ban = map[id_co_ban]['id_quy_doi'];
                }
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
class _Model {
    constructor() {
        this._database = "";
        this._data = [];
    }
    get data() {
        return Object.assign({}, this._data);
    }
    get response() {
        return Object.assign({}, this._res);
    }
    /**
     * fetch data from database and do thing
     * @param params
     * @param callback callback function
     *
     */
    _get(params, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            this._data = [];
            const requestURL = this._database + this._urlparams(params);
            try {
                const res = yield fetch(requestURL, { credentials: 'include' });
                const json = yield res.json();
                if (json.err) {
                    if (typeof callback === "function")
                        callback(json.msg);
                    return;
                }
                this._data = json.data;
                if (typeof callback === "function")
                    callback(false, json.data);
                return json.data;
            }
            catch (err) {
                if (typeof callback === "function")
                    callback(err);
                else
                    throw err;
            }
        });
    }
    /**
     *
     * @param data
     * @param callback
     */
    _post(data, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            this._res = "";
            try {
                const res = yield fetch(this._database, {
                    credentials: 'include',
                    method: "POST",
                    body: JSON.stringify(data),
                });
                const json = yield res.json();
                if (json.err) {
                    if (typeof callback === "function")
                        callback(json.msg);
                    return;
                }
                this._res = json.data;
                if (typeof callback === "function")
                    callback(false, json.data);
                return json.data;
            }
            catch (err) {
                if (typeof callback === "function")
                    callback(err);
                else
                    throw err;
            }
        });
    }
    _urlparams(params) {
        const url = Object.keys(params).map(function (k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
        }).join('&');
        return url;
    }
}
exports.Model = _Model;
;

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
        this._database = "/api/nsx/";
    }
    /**
     * get data of nsx
     * @param callback callback function
     */
    get(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._get({}).catch((err) => {
                if (typeof callback === "function")
                    callback(err);
                else
                    throw err;
            });
            if (typeof callback === "function")
                callback(false, data);
            return data;
        });
    }
    update(callback) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    create(callback) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    remove(callback) {
        return __awaiter(this, void 0, void 0, function* () {
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
Object.defineProperty(exports, "__esModule", { value: true });
const ModelClass_1 = require("../ModelClass");
const BangThuoc_1 = require("./BangThuoc");
exports.BangThuoc = BangThuoc_1.BangThuoc;
class _Thuoc extends ModelClass_1.Model {
    constructor() {
        super();
        this._database = "/api/thuoc/";
    }
    get(callback) {
        let $this = this;
        $this._get({}, function (err, data) {
            if (err) {
                console.log(err);
                return;
            }
            callback(false, data);
        });
    }
}
exports.Thuoc = _Thuoc;

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
        element.addEventListener("keydown", (e) => {
            let code = e.keyCode;
            if (code == 27) //esc
             {
                this._deletePreview();
            }
            else if (code == 38 || code == 40) //up -down
             {
                e.preventDefault();
                let cur = +this._preview_div.getAttribute('cur');
                this._preview_div.children[cur]
                    .classList.remove("preview-row-active");
                if (code == 38)
                    --cur;
                else
                    ++cur;
                let len = this._preview_div.children.length;
                if (cur < 0)
                    cur = len - 1;
                if (cur > len - 1)
                    cur = 0;
                this._preview_div.children[cur]
                    .classList.add("preview-row-active");
                this._preview_div.setAttribute("cur", cur + "");
            }
            else if (code == 13) {
                e.preventDefault();
                let cur = +this._preview_div.getAttribute("cur");
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
        if (this._list.hasOwnProperty(id)) {
            let input = this._list[id];
            input.setAttribute('autocomplete', 'off');
            let input_preview = this._createFlyWrap(input);
            this._preview_div = input_preview;
            let value = input.value;
            for (const row of this._data) {
                if (!this._isLike(row[this._lookup[id]], value))
                    continue;
                this._currentPreviewData.push(row);
                let arr = [];
                for (const name in this._lookup) {
                    if (!this._lookup[name])
                        continue;
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
        else {
            console.log("cannot find id");
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

    App.addSelectInput($('#nhap_hoa_don--don_vi')[0], {
        title: 'ten',
        value: 'id',
    });
    App.onUpdateAll();

    hoaDonForm.setHeader($("#nhap_hoa_don--form-nhap").get(0));
    hoaDonForm.setTable($("#table-nhap").get(0));

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
        "nhap_hoa_don--ma_thuoc": "ma_thuoc",
        "nhap_hoa_don--ten_thuoc": "ten_thuoc",
        "nhap_hoa_don--don_vi": "ten_don_vi",
        "nhap_hoa_don--cost": "don_gia",
    }, {
        "nhap_hoa_don--ten_thuoc": "ten_thuoc",
        "nhap_hoa_don--ma_thuoc": "ma_thuoc",
        "nhap_hoa_don--don_vi": "id_don_vi",
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
const {BangThuoc} = require('../app/Model/Thuoc');
// const thuoc = new Thuoc();
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
                <td>${row.id_nsx}</td>
                <td>${priceString}</td>
                <td>${row.so_luong}</td>
            `);
            table.append(tr);
        }
    }

    updateTable();
});

},{"../app/Model/Thuoc":12}]},{},[14,15,16,17])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb25maWcvaW5kZXguanMiLCJzcmMvYXBwL0FwcC5qcyIsInNyYy9hcHAvQ1RIb2FEb24uanMiLCJzcmMvYXBwL0NvbnRyb2xsZXIuanMiLCJzcmMvYXBwL0hvYURvbkZvcm0uanMiLCJzcmMvYXBwL01vZGVsL0Jvb3N0cmFwTW9kYWwvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL0RvblZpL2luZGV4LmpzIiwic3JjL2FwcC9Nb2RlbC9Nb2RlbENsYXNzL2luZGV4LmpzIiwic3JjL2FwcC9Nb2RlbC9Oc3gvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL1RhYmxlRGF0YS9pbmRleC5qcyIsInNyYy9hcHAvTW9kZWwvVGh1b2MvQmFuZ1RodW9jLmpzIiwic3JjL2FwcC9Nb2RlbC9UaHVvYy9pbmRleC5qcyIsInNyYy9hcHAvaW5wdXRQcmV2aWV3Mi5qcyIsInNyYy9zY3JpcHQvbmhhcC1kb24tdmkuanMiLCJzcmMvc2NyaXB0L25oYXAtaG9hLWRvbi5qcyIsInNyYy9zY3JpcHQvbmhhcC1uc3guanMiLCJzcmMvc2NyaXB0L25oYXAtdGh1b2MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBcIkdJQV9CQU5fVEhFT19MSUVVXCI6IDgwMDAsXHJcbn07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IENvbnRyb2xsZXJfMSA9IHJlcXVpcmUoXCIuL0NvbnRyb2xsZXJcIik7XHJcbmNvbnN0IGlucHV0UHJldmlldzJfMSA9IHJlcXVpcmUoXCIuL2lucHV0UHJldmlldzJcIik7XHJcbmNvbnN0IF9RTE5UID0gY2xhc3MgZXh0ZW5kcyBDb250cm9sbGVyXzEuQ29udHJvbGxlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuYWRkTW9kZWwoJ0RvblZpJywgJ0RvblZpJyk7XHJcbiAgICAgICAgdGhpcy5hZGRNb2RlbCgnVGh1b2MnLCAnVGh1b2MnKTtcclxuICAgICAgICB0aGlzLmFkZE1vZGVsKCdOc3gnLCAnTnN4Jyk7XHJcbiAgICB9XHJcbiAgICBhZGRUYWJsZShlbGVtZW50KSB7XHJcbiAgICAgICAgbGV0IG5hbWVUSHMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0aFwiKTtcclxuICAgICAgICBsZXQgY29tcG9OYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2NvbXBvbmVudCcpO1xyXG4gICAgICAgIGNvbnN0IGxvb2tOYW1lID0gQXJyYXkuZnJvbShuYW1lVEhzKVxyXG4gICAgICAgICAgICAubWFwKCh2YWwpID0+IHZhbC5nZXRBdHRyaWJ1dGUoJ2ZvcicpKTtcclxuICAgICAgICBjb25zdCB1cGRhdGVUYWJsZSA9IGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGVycilcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgbGV0IGJvZHkgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3Rib2R5Jyk7XHJcbiAgICAgICAgICAgIC8vIGRlbGV0ZSBvbGQgcm93XHJcbiAgICAgICAgICAgIGxldCB0cmJvZHkgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3Rib2R5IHRyJyk7XHJcbiAgICAgICAgICAgIGlmICh0cmJvZHkgJiYgdHJib2R5Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZWwgb2YgdHJib2R5KVxyXG4gICAgICAgICAgICAgICAgICAgIGVsLnJlbW92ZUNoaWxkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gdXBkYXRhIG5ldyByb3dcclxuICAgICAgICAgICAgZm9yIChsZXQgcm93IG9mIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGxldCByb3dFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBuYW1lIG9mIGxvb2tOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld1REID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcclxuICAgICAgICAgICAgICAgICAgICBuZXdURC50ZXh0Q29udGVudCA9IHJvd1tuYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICByb3dFbC5hcHBlbmRDaGlsZChuZXdURCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBib2R5LmFwcGVuZENoaWxkKHJvd0VsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5hZGRVcGRhdGVGdW5jKGNvbXBvTmFtZSwgdXBkYXRlVGFibGUpO1xyXG4gICAgfVxyXG4gICAgYWRkTmFtZUlucHV0VGh1b2MoaWRFbGVtZW50LCBvcHRMaXN0ZW4sIG9wdENoYW5nZSkge1xyXG4gICAgICAgIGNvbnN0IHByZXZpZXcgPSBuZXcgaW5wdXRQcmV2aWV3Ml8xLmRlZmF1bHQoKTtcclxuICAgICAgICBwcmV2aWV3LmFkZExvb2t1cChvcHRMaXN0ZW4pO1xyXG4gICAgICAgIHByZXZpZXcubGlzdGVuKGlkRWxlbWVudCwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaWRFbCBpbiBvcHRDaGFuZ2UpIHtcclxuICAgICAgICAgICAgICAgIGlmICghb3B0Q2hhbmdlLmhhc093blByb3BlcnR5KGlkRWwpKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgJCgnIycgKyBpZEVsKS52YWwoZGF0YVtvcHRDaGFuZ2VbaWRFbF1dKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IG9uVXBkYXRlID0gZnVuY3Rpb24gKGVyciwgZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByZXZpZXcuYWRkRGF0YShkYXRhKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuYWRkVXBkYXRlRnVuYygnVGh1b2MnLCBvblVwZGF0ZSk7XHJcbiAgICB9XHJcbiAgICBhZGRTZWxlY3RJbnB1dChlbGVtZW50LCBvcHQpIHtcclxuICAgICAgICBsZXQgdmFsdWVLZXkgPSBvcHQudmFsdWU7XHJcbiAgICAgICAgbGV0IHRpdGxlS2V5ID0gb3B0LnRpdGxlO1xyXG4gICAgICAgIGxldCBjb21wb05hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnY29tcG9uZW50Jyk7XHJcbiAgICAgICAgY29uc3Qgb25VcGRhdGUgPSBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gcmVtb3ZlIG9sZCBvcHRpb25zXHJcbiAgICAgICAgICAgIGxldCBvbGRPcHQgPSBlbGVtZW50LmNoaWxkTm9kZXM7XHJcbiAgICAgICAgICAgIGlmIChvbGRPcHQubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgb2xkT3B0LmZvckVhY2goKHZhbCkgPT4gdmFsLnJlbW92ZSgpKTtcclxuICAgICAgICAgICAgLy8gYWRkIHVwZGF0ZWQgb3B0aW9uXHJcbiAgICAgICAgICAgIGZvciAobGV0IHJvdyBvZiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSByb3dbdmFsdWVLZXldO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRpdGxlID0gcm93W3RpdGxlS2V5XTtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdPcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICAgICAgICAgICAgbmV3T3B0LnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBuZXdPcHQudGV4dENvbnRlbnQgPSB0aXRsZTtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQobmV3T3B0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5hZGRVcGRhdGVGdW5jKGNvbXBvTmFtZSwgb25VcGRhdGUpO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnRzLlFMTlQgPSBfUUxOVDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QXBwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IF9DVEhvYURvbiA9IGNsYXNzIHtcclxuICAgIGNvbnN0cnVjdG9yKG1hID0gLTEsIHRlbiA9IFwiXCIsIGRvbnZpID0gLTEsIHNsID0gMCwgdGhhbmh0aWVuID0gMCkge1xyXG4gICAgICAgIHRoaXMubWEgPSBtYTtcclxuICAgICAgICB0aGlzLnRlbiA9IHRlbjtcclxuICAgICAgICB0aGlzLmRvbnZpID0gZG9udmk7XHJcbiAgICAgICAgdGhpcy5zbCA9IHNsO1xyXG4gICAgICAgIHRoaXMudGhhbmh0aWVuID0gdGhhbmh0aWVuO1xyXG4gICAgICAgIHRoaXMuX2NoaWxkRWxlbWVudCA9IHt9O1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudCgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQWxsVmFsdWUobWEsIHRlbiwgZG9udmksIHNsLCB0aGFuaHRpZW4pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBjcmVhdGUgcm93IGVsZW1lbnQgZm9yIHRhYmxlXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZUVsZW1lbnQoKSB7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XHJcbiAgICAgICAgY29uc3QgbWFURCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcbiAgICAgICAgY29uc3QgdGVuVEQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG4gICAgICAgIGNvbnN0IGRvbnZpVEQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG4gICAgICAgIGNvbnN0IHNsVEQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG4gICAgICAgIGNvbnN0IHRpZW5URCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcbiAgICAgICAgbWFURC5jbGFzc0xpc3QuYWRkKCdjdGhkLW10aHVvYycpO1xyXG4gICAgICAgIHRlblRELmNsYXNzTGlzdC5hZGQoJ2N0aGQtdHRodW9jJyk7XHJcbiAgICAgICAgZG9udmlURC5jbGFzc0xpc3QuYWRkKCdjdGhkLWRvbnZpJyk7XHJcbiAgICAgICAgc2xURC5jbGFzc0xpc3QuYWRkKCdjdGhkLXNsJyk7XHJcbiAgICAgICAgdGllblRELmNsYXNzTGlzdC5hZGQoJ2N0aGQtZ2lhJyk7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZChtYVREKTtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LmFwcGVuZENoaWxkKHRlblREKTtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LmFwcGVuZENoaWxkKGRvbnZpVEQpO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoc2xURCk7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZCh0aWVuVEQpO1xyXG4gICAgICAgIHRoaXMuX2NoaWxkRWxlbWVudCA9IHtcclxuICAgICAgICAgICAgXCJtYV90aHVvY1wiOiBtYVRELFxyXG4gICAgICAgICAgICBcInRlbl90aHVvY1wiOiB0ZW5URCxcclxuICAgICAgICAgICAgXCJkb25fdmlcIjogZG9udmlURCxcclxuICAgICAgICAgICAgXCJzb19sdW9uZ1wiOiBzbFRELFxyXG4gICAgICAgICAgICBcInRoYW5odGllblwiOiB0aWVuVERcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZ2V0Um93RWxlbWVudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fZWxlbWVudClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZTtcclxuICAgICAgICBpZiAocGFyZW50KVxyXG4gICAgICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQodGhpcy5fZWxlbWVudCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGdldCBqc29uIGRhdGEgZm9yIHBvc3QgZm9ybVxyXG4gICAgICovXHJcbiAgICBnZXREYXRhSlNPTigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAnbWFfdGh1b2MnOiB0aGlzLm1hLFxyXG4gICAgICAgICAgICAndGVuX3RodW9jJzogdGhpcy50ZW4sXHJcbiAgICAgICAgICAgICdkb25fdmknOiB0aGlzLmRvbnZpLFxyXG4gICAgICAgICAgICAnc29fbHVvbmcnOiB0aGlzLnNsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBtYVxyXG4gICAgICogQHBhcmFtIHRlblxyXG4gICAgICogQHBhcmFtIGRvbnZpXHJcbiAgICAgKiBAcGFyYW0gc2xcclxuICAgICAqIEBwYXJhbSB0aGFuaHRpZW5cclxuICAgICAqL1xyXG4gICAgdXBkYXRlQWxsVmFsdWUobWEsIHRlbiwgZG9udmksIHNsLCB0aGFuaHRpZW4pIHtcclxuICAgICAgICB0aGlzLm1hID0gbWE7XHJcbiAgICAgICAgdGhpcy50ZW4gPSB0ZW47XHJcbiAgICAgICAgdGhpcy5kb252aSA9IGRvbnZpO1xyXG4gICAgICAgIHRoaXMuc2wgPSBzbDtcclxuICAgICAgICB0aGlzLnRoYW5odGllbiA9IHRoYW5odGllbjtcclxuICAgICAgICB0aGlzLl9jaGlsZEVsZW1lbnRbJ21hX3RodW9jJ10udGV4dENvbnRlbnQgPSBtYSArIFwiXCI7XHJcbiAgICAgICAgdGhpcy5fY2hpbGRFbGVtZW50Wyd0ZW5fdGh1b2MnXS50ZXh0Q29udGVudCA9IHRlbiArIFwiXCI7XHJcbiAgICAgICAgdGhpcy5fY2hpbGRFbGVtZW50Wydkb25fdmknXS50ZXh0Q29udGVudCA9IGRvbnZpICsgXCJcIjtcclxuICAgICAgICB0aGlzLl9jaGlsZEVsZW1lbnRbJ3NvX2x1b25nJ10udGV4dENvbnRlbnQgPSBzbCArIFwiXCI7XHJcbiAgICAgICAgdGhpcy5fY2hpbGRFbGVtZW50Wyd0aGFuaHRpZW4nXS50ZXh0Q29udGVudCA9IHRoYW5odGllbiArIFwiXCI7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVWYWx1ZShuYW1lLCB2YWx1ZSkge1xyXG4gICAgICAgIHN3aXRjaCAobmFtZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwibWFfdGh1b2NcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMubWEgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidGVuX3RodW9jXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRlbiA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJkb25fdmlcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZG9udmkgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwic29fbHVvbmdcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuc2wgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidGhhbmhfdGllblwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy50aGFuaHRpZW4gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jaGlsZEVsZW1lbnRbbmFtZV0udGV4dENvbnRlbnQgPSB2YWx1ZTtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5DVEhvYURvbiA9IF9DVEhvYURvbjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Q1RIb2FEb24uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgRG9uVmlfMSA9IHJlcXVpcmUoXCIuL01vZGVsL0RvblZpXCIpO1xyXG5jb25zdCBUaHVvY18xID0gcmVxdWlyZShcIi4vTW9kZWwvVGh1b2NcIik7XHJcbmNvbnN0IE5zeF8xID0gcmVxdWlyZShcIi4vTW9kZWwvTnN4XCIpO1xyXG5jb25zdCBfQ29udHJvbGxlciA9IGNsYXNzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudExpc3QgPSB7fTtcclxuICAgICAgICB0aGlzLl9ldmVudCA9IHt9O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBuYW1lIG9mIG1vZGVsXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZW5hbWUgdHlwZSBvZiBtb2RlbCAoRG9uVmkgfCBUaHVvYyB8IE5zeClcclxuICAgICAqL1xyXG4gICAgYWRkTW9kZWwobmFtZSwgdHlwZW5hbWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fY29tcG9uZW50TGlzdC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihuYW1lICsgXCIgaXMgZXhpc3RpbmcgbW9kZWxcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBuZXdPYmogPSBudWxsO1xyXG4gICAgICAgIHN3aXRjaCAodHlwZW5hbWUpIHtcclxuICAgICAgICAgICAgY2FzZSBcIkRvblZpXCI6XHJcbiAgICAgICAgICAgICAgICBuZXdPYmogPSBuZXcgRG9uVmlfMS5Eb25WaSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJUaHVvY1wiOlxyXG4gICAgICAgICAgICAgICAgbmV3T2JqID0gbmV3IFRodW9jXzEuVGh1b2MoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiTnN4XCI6XHJcbiAgICAgICAgICAgICAgICBuZXdPYmogPSBuZXcgTnN4XzEuTnN4KCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJ1bmtub3duIHR5cGVuYW1lOiBcIiArIHR5cGVuYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jb21wb25lbnRMaXN0W25hbWVdID0gbmV3T2JqO1xyXG4gICAgICAgIHRoaXMuX2V2ZW50W25hbWVdID0gW107XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb21wb05hbWUgY29tcG9uZW50IG5hbWVcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgY2FsbGJhY2sgZnVuY3Rpb25cclxuICAgICAqIEByZXR1cm4geyhlcnIsIGRhdGEpPT57fX1cclxuICAgICAqL1xyXG4gICAgYWRkVXBkYXRlRnVuYyhjb21wb05hbWUsIGZ1bmMgPSAoZXJyLCBkYXRhKSA9PiB7IH0pIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2V2ZW50Lmhhc093blByb3BlcnR5KGNvbXBvTmFtZSkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJOb3QgZm91bmQgXCIgKyBjb21wb05hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9ldmVudFtjb21wb05hbWVdLnB1c2goZnVuYyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIHVwZGF0ZSBhbGwgbW9kZWwgYW5kIGNhbGwgY2FsbGJhY2sgZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25VcGRhdGVBbGwoKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBjb21wb05hbWUgb2YgT2JqZWN0LmtleXModGhpcy5fY29tcG9uZW50TGlzdCkpIHtcclxuICAgICAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbXBvbmVudExpc3RbY29tcG9OYW1lXS5nZXQoZnVuY3Rpb24gKGVyciwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBmdW5jIG9mIHRoYXQuX2V2ZW50W2NvbXBvTmFtZV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBmdW5jKGVyciwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5Db250cm9sbGVyID0gX0NvbnRyb2xsZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNvbnRyb2xsZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgQ1RIb2FEb25fMSA9IHJlcXVpcmUoXCIuL0NUSG9hRG9uXCIpO1xyXG4vLyBpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xyXG4vKipcclxuICogSMOzYSDEkMahbiBGb3JtXHJcbiAqL1xyXG5jb25zdCBfSG9hRG9uRm9ybSA9IGNsYXNzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX2RhdGFiYXNlID0gXCIvcHVibGljL2FwaS9ob2FfZG9uL1wiO1xyXG4gICAgICAgIGNvbnN0IG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKC91c2VybmFtZT0oXFx3KykvKTtcclxuICAgICAgICB0aGlzLl91c2VybmFtZSA9IG1hdGNoID8gbWF0Y2hbMV0gOiBcIk5vdCBGb3VuZFwiO1xyXG4gICAgICAgIHRoaXMuX2xpc3RDVEhEID0ge307IC8vT2JqZWN0IGJlY2F1c2UgZGF0YSBoYXMga2V5ICdtYV90aHVvYydcclxuICAgICAgICB0aGlzLl9oZWFkZXJGb3JtID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuX0NUSERUYWJsZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLl9naGlDaHUgPSBcIlwiO1xyXG4gICAgfVxyXG4gICAgc2V0SGVhZGVyKGVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLl9oZWFkZXJGb3JtID0gZWxlbWVudDtcclxuICAgICAgICB0aGlzLl9oZWFkZXJGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgaWYgKCFlLnRhcmdldClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgY29uc3QgZGF0YUFyciA9ICQoZS50YXJnZXQpLnNlcmlhbGl6ZUFycmF5KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGFPYmogPSB7fTtcclxuICAgICAgICAgICAgZGF0YUFyci5mb3JFYWNoKCh2YWwpID0+IHtcclxuICAgICAgICAgICAgICAgIGRhdGFPYmpbdmFsLm5hbWVdID0gdmFsLnZhbHVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5hZGRDVEhEKCtkYXRhT2JqWydtYV90aHVvYyddLCBkYXRhT2JqWyd0ZW5fdGh1b2MnXSwgK2RhdGFPYmpbJ3NvX2x1b25nJ10sICtkYXRhT2JqWydkb25fdmknXSwgK2RhdGFPYmpbJ2Nvc3QnXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzZXRUYWJsZShlbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5fQ1RIRFRhYmxlID0gZWxlbWVudDtcclxuICAgIH1cclxuICAgIGdldFVzZXJuYW1lKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuX3VzZXJuYW1lKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdXNlcm5hbWU7XHJcbiAgICB9XHJcbiAgICBuZXdIb2FEb24oKSB7XHJcbiAgICAgICAgZm9yIChsZXQgZWwgaW4gdGhpcy5fbGlzdENUSEQpIHtcclxuICAgICAgICAgICAgdGhpcy5fbGlzdENUSERbZWxdLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogZ2V0IHRvdGFsIGNhc2ggb2YgMSBIb2FEb25cclxuICAgICAqL1xyXG4gICAgZ2V0VG90YWxDYXNoKCkge1xyXG4gICAgICAgIGxldCBzdW0gPSAwO1xyXG4gICAgICAgIGZvciAoY29uc3QgbWFfdGh1b2Mgb2YgQXJyYXkuZnJvbShPYmplY3Qua2V5cyh0aGlzLl9saXN0Q1RIRCkpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN0aGQgPSB0aGlzLl9saXN0Q1RIRFttYV90aHVvY107XHJcbiAgICAgICAgICAgIHN1bSArPSBjdGhkLnRvdGFsQ2FzaDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN1bTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYV90aHVvY1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNvbHVvbmdcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkb252aVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsQ2FzaFxyXG4gICAgICovXHJcbiAgICBhZGRDVEhEKG1hX3RodW9jLCB0ZW5fdGh1b2MsIHNvbHVvbmcsIGRvbnZpLCB0b3RhbENhc2gpIHtcclxuICAgICAgICBpZiAodGhpcy5fbGlzdENUSEQuaGFzT3duUHJvcGVydHkobWFfdGh1b2MpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1NsID0gdGhpcy5fbGlzdENUSERbbWFfdGh1b2NdLnNsICsgc29sdW9uZztcclxuICAgICAgICAgICAgdGhpcy5fbGlzdENUSEQubWFfdGh1b2MudXBkYXRlVmFsdWUoJ3NvX2x1b25nJywgbmV3U2wpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgbmV3Q1RIRCA9IG5ldyBDVEhvYURvbl8xLkNUSG9hRG9uKG1hX3RodW9jLCB0ZW5fdGh1b2MsIGRvbnZpLCBzb2x1b25nLCB0b3RhbENhc2ggKiBzb2x1b25nKTtcclxuICAgICAgICAgICAgdGhpcy5fbGlzdENUSERbbWFfdGh1b2NdID0gbmV3Q1RIRDtcclxuICAgICAgICAgICAgY29uc3Qgcm93RWxlbWVudCA9IG5ld0NUSEQuZ2V0Um93RWxlbWVudCgpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX0NUSERUYWJsZSB8fCAhcm93RWxlbWVudClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5fQ1RIRFRhYmxlLnRCb2RpZXNbMF0uaW5zZXJ0QmVmb3JlKHJvd0VsZW1lbnQsIHRoaXMuX0NUSERUYWJsZS50Qm9kaWVzWzBdLmNoaWxkTm9kZXNbMF0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgcHVzaFRvRGF0YWJhc2Uoc3VjY2Vzc0NhbGxiYWNrLCBlcnJvckNhbGxiYWNrKSB7XHJcbiAgICAgICAgY29uc3QgaG9hRG9uSW5mbyA9IHtcclxuICAgICAgICAgICAgdXNlcm5hbWU6IHRoaXMuX3VzZXJuYW1lLFxyXG4gICAgICAgICAgICB0aW1lOiAobmV3IERhdGUoKSkuZ2V0VGltZSgpLFxyXG4gICAgICAgICAgICBnaGljaHU6IHRoaXMuX2doaUNodVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgICAgICAgaG9hX2RvbjogaG9hRG9uSW5mbyxcclxuICAgICAgICAgICAgY3RoZDogdGhpcy5fbGlzdENUSERcclxuICAgICAgICB9O1xyXG4gICAgICAgICQuYWpheCh0aGlzLl9kYXRhYmFzZSwge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgeGhyRmllbGRzOiB7XHJcbiAgICAgICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGF0YTogXCJkYXRhPVwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YSksXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcclxuICAgICAgICAgICAgc3VjY2VzczogKGpzb24pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghIWpzb24uZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JDYWxsYmFjayhqc29uLm1zZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3VjY2Vzc0NhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlcnJvckNhbGxiYWNrKGVycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5Ib2FEb25Gb3JtID0gX0hvYURvbkZvcm07XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUhvYURvbkZvcm0uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY2xhc3MgQm9vdHN0cmFwTW9kYWwge1xyXG4gICAgY29uc3RydWN0b3IoaWQpIHtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudCA9IHRoaXMuX2NyZWF0ZU1vZGFsKGlkKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuX2VsZW1lbnRbMF0pO1xyXG4gICAgfVxyXG4gICAgc2V0VGl0bGUodGV4dCkge1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuZmluZCgnLm1vZGFsLXRpdGxlJykudGV4dCh0ZXh0KTtcclxuICAgIH1cclxuICAgIHNldENvbnRlbnQoaHRtbCkge1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuZmluZCgnLm1vZGFsLWJvZHknKS5odG1sKGh0bWwpO1xyXG4gICAgfVxyXG4gICAgc2hvdyh0aXRsZSwgY29udGVudCkge1xyXG4gICAgICAgIHRoaXMuc2V0VGl0bGUodGl0bGUpO1xyXG4gICAgICAgIHRoaXMuc2V0Q29udGVudChjb250ZW50KTtcclxuICAgICAgICB0aGlzLm9wZW4oKTtcclxuICAgIH1cclxuICAgIG9wZW4oKSB7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5tb2RhbCgnc2hvdycpO1xyXG4gICAgfVxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5tb2RhbCgnaGlkZScpO1xyXG4gICAgfVxyXG4gICAgX2NyZWF0ZU1vZGFsKGlkKSB7XHJcbiAgICAgICAgY29uc3QgZGl2ID0gJChcIjxkaXYvPlwiKTtcclxuICAgICAgICBkaXYuYXR0cignaWQnLCBpZCk7XHJcbiAgICAgICAgZGl2LmFkZENsYXNzKCdtb2RhbCBmYWRlJykuZGF0YSgndG9nZ2xlJywgJ21vZGFsJyk7XHJcbiAgICAgICAgZGl2Lmh0bWwoYFxyXG4gICAgICAgIDxkaXYgY2xhc3M9J21vZGFsLWRpYWxvZyBtb2RhbC1sZyBtb2RhbC1jZW50ZXInPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1jb250ZW50Jz5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J21vZGFsLWhlYWRlcic+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0nbW9kYWwtdGl0bGUnPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J2Nsb3NlJyBkYXRhLWRpc21pc3M9J21vZGFsJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9J2ZhIGZhLXRpbWVzJz48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J21vZGFsLWJvZHknPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1mb290ZXInPlxyXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9J2J0biBidG4tc2Vjb25kYXJ5JyBkYXRhLWRpc21pc3M9J21vZGFsJz5DbG9zZTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9J2J0biBidG4tcHJpbWFyeSc+T0s8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgKTtcclxuICAgICAgICByZXR1cm4gZGl2O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuQm9vdHN0cmFwTW9kYWwgPSBCb290c3RyYXBNb2RhbDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgTW9kZWxDbGFzc18xID0gcmVxdWlyZShcIi4uL01vZGVsQ2xhc3NcIik7XHJcbmNsYXNzIF9Eb25WaSBleHRlbmRzIE1vZGVsQ2xhc3NfMS5Nb2RlbCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2RhdGFiYXNlID0gXCIvYXBpL2Rvbl92aS9cIjtcclxuICAgICAgICB0aGlzLl9mZXRjaERhdGEgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgZ2V0KGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHRoaXMuX2dldCh7fSwgKGVyciwgZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCEhZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mZXRjaERhdGEgPSB0aGlzLl9maWx0ZXIoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIHRoaXMuX2ZldGNoRGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZmV0Y2hEYXRhO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgX2ZpbHRlcihyYXdEYXRhKSB7XHJcbiAgICAgICAgbGV0IG5ld0RhdGEgPSByYXdEYXRhLnNsaWNlKCk7XHJcbiAgICAgICAgbGV0IG1hcCA9IHt9O1xyXG4gICAgICAgIGZvciAobGV0IHJvdyBvZiBuZXdEYXRhKSB7XHJcbiAgICAgICAgICAgIG1hcFtyb3dbJ2lkJ11dID0gcm93O1xyXG4gICAgICAgICAgICBsZXQgaGVzbyA9IHJvd1snaGVfc29fcXV5ZG9pJ107XHJcbiAgICAgICAgICAgIGlmICghaGVzbykge1xyXG4gICAgICAgICAgICAgICAgcm93Wyd0ZXh0UXV5RG9pJ10gPSBcIsSRxqFuIHbhu4sgY8ahIGLhuqNuXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByb3dbJ3RleHRRdXlEb2knXSA9IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgcm93IG9mIG5ld0RhdGEpIHtcclxuICAgICAgICAgICAgbGV0IGlkX2NvX2JhbiA9IHJvd1snaWRfcXV5X2RvaSddO1xyXG4gICAgICAgICAgICBsZXQgaGVzbyA9ICtyb3dbJ2hlX3NvX3F1eWRvaSddO1xyXG4gICAgICAgICAgICBpZiAobWFwLmhhc093blByb3BlcnR5KGlkX2NvX2JhbikpIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChtYXAuaGFzT3duUHJvcGVydHkoaWRfY29fYmFuKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvd1sndGV4dFF1eURvaSddICs9IGA9JHtoZXNvfXhbJHttYXBbaWRfY29fYmFuXVsndGVuJ119XWA7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVzbyAqPSArbWFwW2lkX2NvX2Jhbl1bJ2hlX3NvX3F1eWRvaSddO1xyXG4gICAgICAgICAgICAgICAgICAgIGlkX2NvX2JhbiA9IG1hcFtpZF9jb19iYW5dWydpZF9xdXlfZG9pJ107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld0RhdGE7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5Eb25WaSA9IF9Eb25WaTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY2xhc3MgX01vZGVsIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX2RhdGFiYXNlID0gXCJcIjtcclxuICAgICAgICB0aGlzLl9kYXRhID0gW107XHJcbiAgICB9XHJcbiAgICBnZXQgZGF0YSgpIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fZGF0YSk7XHJcbiAgICB9XHJcbiAgICBnZXQgcmVzcG9uc2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX3Jlcyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGZldGNoIGRhdGEgZnJvbSBkYXRhYmFzZSBhbmQgZG8gdGhpbmdcclxuICAgICAqIEBwYXJhbSBwYXJhbXNcclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBjYWxsYmFjayBmdW5jdGlvblxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgX2dldChwYXJhbXMsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGF0YSA9IFtdO1xyXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0VVJMID0gdGhpcy5fZGF0YWJhc2UgKyB0aGlzLl91cmxwYXJhbXMocGFyYW1zKTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IHlpZWxkIGZldGNoKHJlcXVlc3RVUkwsIHsgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyB9KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGpzb24gPSB5aWVsZCByZXMuanNvbigpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGpzb24uZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhqc29uLm1zZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGF0YSA9IGpzb24uZGF0YTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhmYWxzZSwganNvbi5kYXRhKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBqc29uLmRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZGF0YVxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrXHJcbiAgICAgKi9cclxuICAgIF9wb3N0KGRhdGEsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVzID0gXCJcIjtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IHlpZWxkIGZldGNoKHRoaXMuX2RhdGFiYXNlLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcclxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBqc29uID0geWllbGQgcmVzLmpzb24oKTtcclxuICAgICAgICAgICAgICAgIGlmIChqc29uLmVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soanNvbi5tc2cpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlcyA9IGpzb24uZGF0YTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhmYWxzZSwganNvbi5kYXRhKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBqc29uLmRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBfdXJscGFyYW1zKHBhcmFtcykge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IE9iamVjdC5rZXlzKHBhcmFtcykubWFwKGZ1bmN0aW9uIChrKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoaykgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQocGFyYW1zW2tdKTtcclxuICAgICAgICB9KS5qb2luKCcmJyk7XHJcbiAgICAgICAgcmV0dXJuIHVybDtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk1vZGVsID0gX01vZGVsO1xyXG47XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IE1vZGVsQ2xhc3NfMSA9IHJlcXVpcmUoXCIuLi9Nb2RlbENsYXNzXCIpO1xyXG5jbGFzcyBfTnN4IGV4dGVuZHMgTW9kZWxDbGFzc18xLk1vZGVsIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fZGF0YWJhc2UgPSBcIi9hcGkvbnN4L1wiO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBnZXQgZGF0YSBvZiBuc3hcclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBjYWxsYmFjayBmdW5jdGlvblxyXG4gICAgICovXHJcbiAgICBnZXQoY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgdGhpcy5fZ2V0KHt9KS5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhmYWxzZSwgZGF0YSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGNyZWF0ZShjYWxsYmFjaykge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZW1vdmUoY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuTnN4ID0gX05zeDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLyoqXHJcbiAqIERpc3BsYXkgZGF0YSB1bmRlciB0YWJsZVxyXG4gKi9cclxuY2xhc3MgVGFibGVEYXRhIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX21hcCA9IHt9O1xyXG4gICAgICAgIHRoaXMuX2xpc3QgPSBbXTtcclxuICAgICAgICB0aGlzLl9pc0Nvbm5lY3QgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9jb25uZWN0U3RhdHVzID0gXCJcIjtcclxuICAgICAgICB0aGlzLl9pc0ZldGNoZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9kYlVSTCA9IFwiXCI7XHJcbiAgICB9XHJcbiAgICBnZXREYXRhKCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIGxldCByZXMgPSB5aWVsZCBmZXRjaCh0aGlzLl9kYlVSTCwgeyBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScgfSk7XHJcbiAgICAgICAgICAgIGlmICghcmVzLm9rKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0Nvbm5lY3QgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3RTdGF0dXMgPSByZXMuc3RhdHVzVGV4dDtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9pc0Nvbm5lY3QgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0U3RhdHVzID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IGpzb24gPSB5aWVsZCByZXMuanNvbigpO1xyXG4gICAgICAgICAgICBpZiAoISFqc29uLmVycikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faXNGZXRjaGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25uZWN0U3RhdHVzID0ganNvbi5tc2c7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5faXNGZXRjaGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdFN0YXR1cyA9IFwiT0tcIjtcclxuICAgICAgICAgICAgdGhpcy5fbGlzdCA9IGpzb24uZGF0YTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGdldCB0YWJsZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWFwO1xyXG4gICAgfVxyXG4gICAgZ2V0IGxpc3QoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3Q7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gVGFibGVEYXRhO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBUYWJsZURhdGFfMSA9IHJlcXVpcmUoXCIuLi9UYWJsZURhdGFcIik7XHJcbmNsYXNzIEJhbmdUaHVvYyBleHRlbmRzIFRhYmxlRGF0YV8xLmRlZmF1bHQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9kYlVSTCA9IFwiL2FwaS90aHVvYy9cIjtcclxuICAgIH1cclxuICAgIHVwZGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICB5aWVsZCB0aGlzLmdldERhdGEoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgcm93IG9mIHRoaXMuX2xpc3QpIHtcclxuICAgICAgICAgICAgICAgIGxldCBpZCA9IHJvd1snaWQnXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hcFtpZF0gPSByb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkJhbmdUaHVvYyA9IEJhbmdUaHVvYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QmFuZ1RodW9jLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IE1vZGVsQ2xhc3NfMSA9IHJlcXVpcmUoXCIuLi9Nb2RlbENsYXNzXCIpO1xyXG5jb25zdCBCYW5nVGh1b2NfMSA9IHJlcXVpcmUoXCIuL0JhbmdUaHVvY1wiKTtcclxuZXhwb3J0cy5CYW5nVGh1b2MgPSBCYW5nVGh1b2NfMS5CYW5nVGh1b2M7XHJcbmNsYXNzIF9UaHVvYyBleHRlbmRzIE1vZGVsQ2xhc3NfMS5Nb2RlbCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2RhdGFiYXNlID0gXCIvYXBpL3RodW9jL1wiO1xyXG4gICAgfVxyXG4gICAgZ2V0KGNhbGxiYWNrKSB7XHJcbiAgICAgICAgbGV0ICR0aGlzID0gdGhpcztcclxuICAgICAgICAkdGhpcy5fZ2V0KHt9LCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UsIGRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuVGh1b2MgPSBfVGh1b2M7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNsYXNzIGlucHV0UHJldmlldzIge1xyXG4gICAgY29uc3RydWN0b3IodGFyZ2V0ID0gZG9jdW1lbnQpIHtcclxuICAgICAgICB0aGlzLl9saXN0ID0ge307XHJcbiAgICAgICAgdGhpcy5fZGF0YSA9IFtdO1xyXG4gICAgICAgIHRoaXMuX2xvb2t1cCA9IHt9O1xyXG4gICAgICAgIHRoaXMuX3RhcmdldCA9IHRhcmdldDtcclxuICAgICAgICB0aGlzLl9wcmV2aWV3X2RpdiA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fY3VycmVudFByZXZpZXdEYXRhID0gW107XHJcbiAgICAgICAgLy8gY29uc3RydWN0b3IgICAgXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0O1xyXG4gICAgICAgICAgICBpZiAoIXRhcmdldC5jbGFzc0xpc3QuaGFzT3duUHJvcGVydHkoXCJwcmV2aWV3LXJvd1wiKSlcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RlbGV0ZVByZXZpZXcoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogYWRkIGxvb2t1cCB0byBqc29uIG5hbWVcclxuICAgICAqIEBwYXJhbSB7e2lkRWw6IFN0cmluZ319IGFyciB7IGlkX2VsZW1lbnQgOiBuYW1lX29mX2ZpZWxkfVxyXG4gICAgICovXHJcbiAgICBhZGRMb29rdXAoYXJyKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBhcnIgIT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhPYmplY3QuY2FsbChhcnIpKTtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicGFyYW1ldGVyIG11c3QgYmUganNvbiBvYmpcIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKGFycikpIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9va3VwW2tleV0gPSBhcnJba2V5XTtcclxuICAgICAgICAgICAgbGV0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoa2V5KTtcclxuICAgICAgICAgICAgaWYgKCFlbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coRXJyb3IoYENhbm5vdCBmaW5kICMke2tleX0gZWxlbWVudGApKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3Rba2V5XSA9IGVsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgO1xyXG4gICAgLyoqXHJcbiAgICAgKiBhZGQgaG9zdCB0byBmZXRjaCBkYXRhYmFzZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCBhc2RcclxuICAgICAqL1xyXG4gICAgYWRkRGF0YShkYXRhKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiAoZGF0YSkgIT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJhbWV0ZXIgbXVzdCBiZSBqc29uXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xyXG4gICAgfVxyXG4gICAgO1xyXG4gICAgbGlzdGVuKGlkLCBjYWxsYmFjaykge1xyXG4gICAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgbGV0IGNvZGUgPSBlLmtleUNvZGU7XHJcbiAgICAgICAgICAgIGlmIChjb2RlID09IDI3KSAvL2VzY1xyXG4gICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVsZXRlUHJldmlldygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGNvZGUgPT0gMzggfHwgY29kZSA9PSA0MCkgLy91cCAtZG93blxyXG4gICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGN1ciA9ICt0aGlzLl9wcmV2aWV3X2Rpdi5nZXRBdHRyaWJ1dGUoJ2N1cicpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcHJldmlld19kaXYuY2hpbGRyZW5bY3VyXVxyXG4gICAgICAgICAgICAgICAgICAgIC5jbGFzc0xpc3QucmVtb3ZlKFwicHJldmlldy1yb3ctYWN0aXZlXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvZGUgPT0gMzgpXHJcbiAgICAgICAgICAgICAgICAgICAgLS1jdXI7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgKytjdXI7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGVuID0gdGhpcy5fcHJldmlld19kaXYuY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1ciA8IDApXHJcbiAgICAgICAgICAgICAgICAgICAgY3VyID0gbGVuIC0gMTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXIgPiBsZW4gLSAxKVxyXG4gICAgICAgICAgICAgICAgICAgIGN1ciA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmV2aWV3X2Rpdi5jaGlsZHJlbltjdXJdXHJcbiAgICAgICAgICAgICAgICAgICAgLmNsYXNzTGlzdC5hZGQoXCJwcmV2aWV3LXJvdy1hY3RpdmVcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmV2aWV3X2Rpdi5zZXRBdHRyaWJ1dGUoXCJjdXJcIiwgY3VyICsgXCJcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY29kZSA9PSAxMykge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGN1ciA9ICt0aGlzLl9wcmV2aWV3X2Rpdi5nZXRBdHRyaWJ1dGUoXCJjdXJcIik7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayh0aGlzLl9jdXJyZW50UHJldmlld0RhdGFbY3VyXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWxldGVQcmV2aWV3KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZldGNoT24oaWQsIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogZmV0Y2ggZGF0YWJhc2UgYW5kIHNob3cgaW4gaW5wdXRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBpZCBvZiBodG1sIGVsZW1lbnQgaW5wdXQgbmVlZCB0byBmZXRjaCBieSB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBmZXRjaE9uKGlkLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHRoaXMuX2RlbGV0ZVByZXZpZXcoKTtcclxuICAgICAgICB0aGlzLl9jdXJyZW50UHJldmlld0RhdGEubGVuZ3RoID0gMDsgLy9jbGVhciBjdXJyZW50IHByZXZpZXcgc3VnZ2VzdCBuYW1lXHJcbiAgICAgICAgaWYgKHRoaXMuX2xpc3QuaGFzT3duUHJvcGVydHkoaWQpKSB7XHJcbiAgICAgICAgICAgIGxldCBpbnB1dCA9IHRoaXMuX2xpc3RbaWRdO1xyXG4gICAgICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2F1dG9jb21wbGV0ZScsICdvZmYnKTtcclxuICAgICAgICAgICAgbGV0IGlucHV0X3ByZXZpZXcgPSB0aGlzLl9jcmVhdGVGbHlXcmFwKGlucHV0KTtcclxuICAgICAgICAgICAgdGhpcy5fcHJldmlld19kaXYgPSBpbnB1dF9wcmV2aWV3O1xyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSBpbnB1dC52YWx1ZTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCByb3cgb2YgdGhpcy5fZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9pc0xpa2Uocm93W3RoaXMuX2xvb2t1cFtpZF1dLCB2YWx1ZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50UHJldmlld0RhdGEucHVzaChyb3cpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFyciA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBuYW1lIGluIHRoaXMuX2xvb2t1cCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5fbG9va3VwW25hbWVdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMuX2xvb2t1cFtuYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaChyb3dbZmllbGRdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCBuZXdSb3cgPSB0aGlzLl9jcmVhdGVGbHlSb3coYXJyKTtcclxuICAgICAgICAgICAgICAgIG5ld1Jvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhyb3cpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlbGV0ZVByZXZpZXcoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaW5wdXRfcHJldmlldy5hcHBlbmRDaGlsZChuZXdSb3cpO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbnB1dF9wcmV2aWV3KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjYW5ub3QgZmluZCBpZFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICA7XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7SFRNTERpdkVsZW1lbnR9IGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBfY3JlYXRlRmx5V3JhcChlbGVtZW50KSB7XHJcbiAgICAgICAgaWYgKCFlbGVtZW50KVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICBsZXQgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGl2LmNsYXNzTmFtZSA9IFwicHJldmlldy1pbnB1dFwiO1xyXG4gICAgICAgIGRpdi5zdHlsZS5taW5XaWR0aCA9IHJlY3Qud2lkdGggKyBcInB4XCI7XHJcbiAgICAgICAgZGl2LnN0eWxlLnRvcCA9ICtyZWN0LnRvcCArIHJlY3QuaGVpZ2h0ICsgXCJweFwiO1xyXG4gICAgICAgIGRpdi5zdHlsZS5sZWZ0ID0gK3JlY3QubGVmdCArIFwicHhcIjtcclxuICAgICAgICBkaXYuc2V0QXR0cmlidXRlKFwiY3VyXCIsIFwiMFwiKTtcclxuICAgICAgICByZXR1cm4gZGl2O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAcmV0dXJuIHt0cnVlfSBpZiBzdHIxIGxpa2Ugc3RyMlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0cjFcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIyXHJcbiAgICAgKi9cclxuICAgIF9pc0xpa2Uoc3RyMSwgc3RyMikge1xyXG4gICAgICAgIHN0cjEgPSBzdHIxLnRyaW0oKTtcclxuICAgICAgICBzdHIyID0gc3RyMi50cmltKCk7XHJcbiAgICAgICAgaWYgKHN0cjEgPT0gXCJcIiB8fCBzdHIyID09IFwiXCIpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICBzdHIxID0gc3RyMS5ub3JtYWxpemUoKTtcclxuICAgICAgICBzdHIyID0gc3RyMi5ub3JtYWxpemUoKTtcclxuICAgICAgICBzdHIxID0gc3RyMS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIHN0cjIgPSBzdHIyLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgbGV0IHJlZyA9IG5ldyBSZWdFeHAoYF4uKiR7c3RyMn0uKiRgKTtcclxuICAgICAgICByZXR1cm4gc3RyMS5tYXRjaChyZWcpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJWYWx1ZXNcclxuICAgICAqL1xyXG4gICAgX2NyZWF0ZUZseVJvdyhhcnJWYWx1ZXMpIHtcclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyVmFsdWVzKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgcm93LmNsYXNzTmFtZSA9IFwicHJldmlldy1yb3dcIjtcclxuICAgICAgICBmb3IgKGxldCB2YWx1ZSBvZiBhcnJWYWx1ZXMpIHtcclxuICAgICAgICAgICAgbGV0IGNvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgIGNvbC5zdHlsZS5tYXJnaW4gPSBcImF1dG9cIjtcclxuICAgICAgICAgICAgY29sLnRleHRDb250ZW50ID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHJvdy5hcHBlbmRDaGlsZChjb2wpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcm93O1xyXG4gICAgfVxyXG4gICAgX2RlbGV0ZVByZXZpZXcoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wcmV2aWV3LWlucHV0XCIpLmZvckVhY2goKHZhbCkgPT4ge1xyXG4gICAgICAgICAgICB2YWwucmVtb3ZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gaW5wdXRQcmV2aWV3MjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5wdXRQcmV2aWV3Mi5qcy5tYXAiLCJjb25zdCB7RG9uVml9ID0gcmVxdWlyZSgnLi4vYXBwL01vZGVsL0RvblZpLycpO1xyXG5jb25zdCB7Qm9vdHN0cmFwTW9kYWx9ID0gcmVxdWlyZSgnLi4vYXBwL01vZGVsL0Jvb3N0cmFwTW9kYWwnKTtcclxuXHJcbmNvbnN0IGRvbnZpID0gbmV3IERvblZpKCk7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShhc3luYyAoKT0+e1xyXG4gICAgYXN5bmMgZnVuY3Rpb24gdXBkYXRlVGFibGUoKSB7XHJcbiAgICAgICAgY29uc3QgdGFibGUgPSAkKFwiI25oYXBfZG9uX3ZpLS10YWJsZSB0Ym9keVwiKTtcclxuICAgICAgICB0YWJsZS5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBkb252aS5nZXQoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiBkYXRhKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyID0gJCgnPHRyLz4nKS5odG1sKGBcclxuICAgICAgICAgICAgICAgIDx0ZD4ke3Jvdy5pZH08L3RkPlxyXG4gICAgICAgICAgICAgICAgPHRkPiR7cm93LnRlbn08L3RkPlxyXG4gICAgICAgICAgICBgKTtcclxuICAgICAgICAgICAgdGFibGUuYXBwZW5kKHRyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVGFibGUoKTtcclxuXHJcbn0pO1xyXG4iLCJjb25zdCB7SG9hRG9uRm9ybX0gPSByZXF1aXJlKCcuLi9hcHAvSG9hRG9uRm9ybScpO1xyXG5jb25zdCB7UUxOVH0gPSByZXF1aXJlKCcuLi9hcHAvQXBwJyk7XHJcbmNvbnN0IHtCb290c3RyYXBNb2RhbH0gPSByZXF1aXJlKCcuLi9hcHAvTW9kZWwvQm9vc3RyYXBNb2RhbCcpO1xyXG5jb25zdCBDT05GSUcgPSByZXF1aXJlKCcuLi8uLi9jb25maWcnKTtcclxuXHJcbmNvbnN0IGhvYURvbkZvcm0gPSBuZXcgSG9hRG9uRm9ybSgpO1xyXG5jb25zdCBBcHAgPSBuZXcgUUxOVCgpO1xyXG5jb25zdCBwb3B1cCA9IG5ldyBCb290c3RyYXBNb2RhbCgnbmhhcF9ob2FfZG9uLS1wb3B1cCcpO1xyXG5cclxuZnVuY3Rpb24gZGlzcGxheVRpbWUoKSB7XHJcbiAgICBsZXQgbm93ID0gbmV3IERhdGUoKTtcclxuICAgICQoXCIjdGltZS1kYXRlXCIpLnRleHQobm93LnRvTG9jYWxlRGF0ZVN0cmluZygpKTtcclxuICAgICQoXCIjdGltZS10aW1lXCIpLnRleHQobm93LnRvTG9jYWxlVGltZVN0cmluZygpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbG9vcFNob3dUaW1lKCkge1xyXG4gICAgc2V0SW50ZXJ2YWwoKCk9PntcclxuICAgICAgICBkaXNwbGF5VGltZSgpO1xyXG4gICAgfSwgMTAwMCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpc3BsYXlVc2VyKCkge1xyXG4gICAgbGV0IHVzZXJuYW1lID0gaG9hRG9uRm9ybS5nZXRVc2VybmFtZSgpO1xyXG4gICAgJChcIiNuaGFwX2hvYV9kb24tLXVzZXJuYW1lXCIpLnRleHQodXNlcm5hbWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmb2N1c1RlblRodW9jRmlyc3QoKSB7XHJcbiAgICAkKFwiI25oYXBfaG9hX2Rvbi0tdGVuLXRodW9jXCIpLmZvY3VzKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVRvbmdHaWEoKSB7XHJcbiAgICBsZXQgdG9uZyA9IDA7XHJcbiAgICBsZXQgbGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jdGhkLWdpYScpO1xyXG4gICAgZm9yIChsZXQgdmFsIG9mIGxpc3QpIHtcclxuICAgICAgICBsZXQgZ2lhID0gcGFyc2VJbnQodmFsLnRleHRDb250ZW50LnJlcGxhY2UoL1xcRC8sICcnKSk7XHJcbiAgICAgICAgdG9uZyArPSBnaWE7XHJcbiAgICB9XHJcbiAgICBjb25zdCB2YWwgPSB0b25nLnRvTG9jYWxlU3RyaW5nKCkrJyBWTsSQJztcclxuXHJcbiAgICAkKFwiI25oYXBfaG9hX2Rvbi0tc3VtXCIpLmF0dHIoJ2N1clZhbCcsIHZhbCk7XHJcbiAgICBpZiAoISQoJyNraWV1LWxpZXUnKVswXS5jaGVja2VkKSAkKCcjbmhhcF9ob2FfZG9uLS1zdW0nKS52YWwodmFsKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlVGllblRob2koKSB7XHJcbiAgICBsZXQgc3VtID0gJChcIiNuaGFwX2hvYV9kb24tLXN1bVwiKS52YWwoKS5yZXBsYWNlKC9bXFxEXFxzXS9nLCAnJyk7XHJcbiAgICBsZXQgdGllbmtoID0gJChcIiNuaGFwX2hvYV9kb24tLXRpZW5raC10cmFcIikudmFsKCkucmVwbGFjZSgvW1xcRFxcc10vZywgJycpO1xyXG5cclxuICAgIGxldCB0aWVuVGhvaSA9IHBhcnNlSW50KHRpZW5raCkgLSBwYXJzZUludChzdW0pO1xyXG4gICAgdGllblRob2kgPSB0aWVuVGhvaSA+PSAwID8gdGllblRob2kudG9Mb2NhbGVTdHJpbmcoKSA6ICd+bG9pJztcclxuXHJcbiAgICAkKFwiI25oYXBfaG9hX2Rvbi0tdGhvaXRpZW5cIikudmFsKHRpZW5UaG9pKTtcclxufVxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICBsb29wU2hvd1RpbWUoKTtcclxuICAgIGRpc3BsYXlVc2VyKCk7XHJcbiAgICBmb2N1c1RlblRodW9jRmlyc3QoKTtcclxuXHJcbiAgICBBcHAuYWRkU2VsZWN0SW5wdXQoJCgnI25oYXBfaG9hX2Rvbi0tZG9uX3ZpJylbMF0sIHtcclxuICAgICAgICB0aXRsZTogJ3RlbicsXHJcbiAgICAgICAgdmFsdWU6ICdpZCcsXHJcbiAgICB9KTtcclxuICAgIEFwcC5vblVwZGF0ZUFsbCgpO1xyXG5cclxuICAgIGhvYURvbkZvcm0uc2V0SGVhZGVyKCQoXCIjbmhhcF9ob2FfZG9uLS1mb3JtLW5oYXBcIikuZ2V0KDApKTtcclxuICAgIGhvYURvbkZvcm0uc2V0VGFibGUoJChcIiN0YWJsZS1uaGFwXCIpLmdldCgwKSk7XHJcblxyXG4gICAgJCgnI25oYXBfaG9hX2Rvbi0tdGllbmtoLXRyYScpLm1vbmV5SW5wdXQoKS5vbigna2V5dXAnLCAoKT0+e1xyXG4gICAgICAgIHVwZGF0ZVRpZW5UaG9pKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCcjbmhhcF9ob2FfZG9uLS1ob2Fkb24tZm9ybScpLnN1Ym1pdCgoZSk9PntcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIGhvYURvbkZvcm0ucHVzaFRvRGF0YWJhc2UoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQoJyNuaGFwX2hvYV9kb24tLWhvYWRvbi1mb3JtJykuZmluZCgnaW5wdXQsIHNlbGVjdCcpLnZhbCgnJyk7XHJcbiAgICAgICAgICAgICQoJyNuaGFwX2hvYV9kb24tLWZvcm0tbmhhcCcpLmZpbmQoJ2lucHV0LCBzZWxlY3QnKS52YWwoJycpO1xyXG4gICAgICAgICAgICBob2FEb25Gb3JtLm5ld0hvYURvbigpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhob2FEb25Gb3JtKTtcclxuICAgICAgICAgICAgcG9wdXAuc2hvdygnT0snLCAnJyk7XHJcbiAgICAgICAgfSwgKGVycik9PntcclxuICAgICAgICAgICAgcG9wdXAuc2hvdygnRXJyb3InLCBlcnIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIEFwcC5hZGROYW1lSW5wdXRUaHVvYyhcIm5oYXBfaG9hX2Rvbi0tdGVuX3RodW9jXCIsIHtcclxuICAgICAgICBcIm5oYXBfaG9hX2Rvbi0tbWFfdGh1b2NcIjogXCJtYV90aHVvY1wiLFxyXG4gICAgICAgIFwibmhhcF9ob2FfZG9uLS10ZW5fdGh1b2NcIjogXCJ0ZW5fdGh1b2NcIixcclxuICAgICAgICBcIm5oYXBfaG9hX2Rvbi0tZG9uX3ZpXCI6IFwidGVuX2Rvbl92aVwiLFxyXG4gICAgICAgIFwibmhhcF9ob2FfZG9uLS1jb3N0XCI6IFwiZG9uX2dpYVwiLFxyXG4gICAgfSwge1xyXG4gICAgICAgIFwibmhhcF9ob2FfZG9uLS10ZW5fdGh1b2NcIjogXCJ0ZW5fdGh1b2NcIixcclxuICAgICAgICBcIm5oYXBfaG9hX2Rvbi0tbWFfdGh1b2NcIjogXCJtYV90aHVvY1wiLFxyXG4gICAgICAgIFwibmhhcF9ob2FfZG9uLS1kb25fdmlcIjogXCJpZF9kb25fdmlcIixcclxuICAgICAgICBcIm5oYXBfaG9hX2Rvbi0tY29zdFwiOiBcImRvbl9naWFcIixcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjbmhhcF9ob2FfZG9uLS1mb3JtLW5oYXBcIikub24oJ3N1Ym1pdCcsIChlKT0+e1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAkKFwiI25oYXBfaG9hX2Rvbi0tZm9ybS1uaGFwXCIpLmZpbmQoJ2lucHV0LCBzZWxlY3QnKS52YWwoJycpO1xyXG4gICAgICAgIHVwZGF0ZVRvbmdHaWEoKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIja2lldS1saWV1XCIpLmNsaWNrKCgpID0+IHtcclxuICAgICAgICAkKCcjbmhhcF9ob2FfZG9uLS1zdW0nKS52YWwoQ09ORklHLkdJQV9CQU5fVEhFT19MSUVVKTtcclxuICAgIH0pO1xyXG4gICAgJCgnI2tpZXUtYmFubGUnKS5jbGljaygoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc3VtID0gJCgnI3N1bScpO1xyXG4gICAgICAgIGNvbnN0IHZhbCA9IHN1bS5hdHRyKCdjdXJWYWwnKTtcclxuICAgICAgICBzdW0udmFsKHZhbCk7XHJcbiAgICB9KTtcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbn0pO1xyXG4iLCJjb25zdCB7TnN4fSA9IHJlcXVpcmUoJy4uL2FwcC9Nb2RlbC9Oc3gnKTtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KCgpPT57XHJcbiAgICBjb25zdCBwb3B1cCA9IG5ldyBTdGF0dXNQb3B1cCgpO1xyXG4gICAgY29uc3QgbnN4ID0gbmV3IE5zeCgpO1xyXG5cclxuICAgIHBvcHVwLmNyZWF0ZSgpO1xyXG4gICAgdXBkYXRlTlNYKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlVGFibGVSb3codmFsKSB7XHJcbiAgICAgICAgbGV0IHJvdyA9ICQoXCI8dHIvPlwiKTtcclxuICAgICAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXModmFsKSkge1xyXG4gICAgICAgICAgICByb3cuYXBwZW5kKCQoJzx0ZC8+JykudGV4dCh2YWxba2V5XSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcm93O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZU5TWCgpIHtcclxuICAgICAgICAkKCcjdGFibGUtYm9keScpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XHJcbiAgICAgICAgbnN4LmdldCgoZXJyLCBkYXRhKT0+e1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGxldCByb3cgb2YgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgJChcIiN0YWJsZS1ib2R5XCIpLmFwcGVuZChjcmVhdGVUYWJsZVJvdyhyb3cpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHVwZGF0ZSBkYXRhIHJlcXVlc3RcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGxldCBkYXRhID0gZS5kYXRhO1xyXG4gICAgICAgIGlmIChkYXRhLm1zZyA9PSAndXBkYXRlJykge1xyXG4gICAgICAgICAgICB1cGRhdGVOU1goKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufSk7XHJcbiIsImNvbnN0IHtCYW5nVGh1b2N9ID0gcmVxdWlyZSgnLi4vYXBwL01vZGVsL1RodW9jJyk7XHJcbi8vIGNvbnN0IHRodW9jID0gbmV3IFRodW9jKCk7XHJcbmNvbnN0IGJhbmdUaHVvYyA9IG5ldyBCYW5nVGh1b2MoKTtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG4gICAgYXN5bmMgZnVuY3Rpb24gdXBkYXRlVGFibGUoKSB7XHJcbiAgICAgICAgY29uc3QgdGFibGUgPSAkKFwiI25oYXBfdGh1b2MtLXRhYmxlIHRib2R5XCIpO1xyXG4gICAgICAgIHRhYmxlLmNoaWxkcmVuKCkucmVtb3ZlKCk7XHJcbiAgICAgICAgYXdhaXQgYmFuZ1RodW9jLnVwZGF0ZSgpO1xyXG4gICAgICAgIGZvciAoY29uc3Qgcm93IG9mIGJhbmdUaHVvYy5saXN0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHByaWNlU3RyaW5nID0gKCtyb3cuZG9uX2dpYSkudG9Mb2NhbGVTdHJpbmcoKTtcclxuICAgICAgICAgICAgY29uc3QgdHIgPSAkKCc8dHIvPicpLmh0bWwoYFxyXG4gICAgICAgICAgICAgICAgPHRkPiR7cm93Lm1hfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8dGQ+JHtyb3cudGVufTwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8dGQ+JHtyb3cuaWRfbnN4fTwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8dGQ+JHtwcmljZVN0cmluZ308L3RkPlxyXG4gICAgICAgICAgICAgICAgPHRkPiR7cm93LnNvX2x1b25nfTwvdGQ+XHJcbiAgICAgICAgICAgIGApO1xyXG4gICAgICAgICAgICB0YWJsZS5hcHBlbmQodHIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVUYWJsZSgpO1xyXG59KTtcclxuIl19
