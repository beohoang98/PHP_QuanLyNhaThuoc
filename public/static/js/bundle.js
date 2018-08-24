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
        this._database = "/api/don_vi/";
        this._fetchData = null;
    }
    get(callback = (err, data) => { }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._get({});
                this._fetchData = this._filter(data);
                callback(false, this._fetchData);
                return this._fetchData;
            }
            catch (err) {
                callback(err);
            }
        });
    }
    _filter(rawData) {
        let newData = rawData.slice();
        let map = {};
        for (let row of newData) {
            let heso = row['he_so_quydoi'];
            map[row['id']] = row;
            row['textQuyDoi'] = heso ? "" : "đơn vị cơ bản";
        }
        for (let row of newData) {
            let id_co_ban = row['id_quy_doi'];
            let heso = +row['he_so_quydoi'];
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
                if (json.err)
                    throw new Error(json.msg);
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
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data),
                });
                const json = yield res.json();
                if (json.err)
                    throw new Error(json.msg);
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
        this._database = "/api/ncc/";
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
    create(data, callback) {
        this._post(data, callback);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb25maWcvaW5kZXguanMiLCJzcmMvYXBwL0FwcC5qcyIsInNyYy9hcHAvQ1RIb2FEb24uanMiLCJzcmMvYXBwL0NvbnRyb2xsZXIuanMiLCJzcmMvYXBwL0hvYURvbkZvcm0uanMiLCJzcmMvYXBwL01vZGVsL0Jvb3N0cmFwTW9kYWwvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL0RvblZpL2luZGV4LmpzIiwic3JjL2FwcC9Nb2RlbC9Nb2RlbENsYXNzL2luZGV4LmpzIiwic3JjL2FwcC9Nb2RlbC9Oc3gvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL1RhYmxlRGF0YS9pbmRleC5qcyIsInNyYy9hcHAvTW9kZWwvVGh1b2MvQmFuZ1RodW9jLmpzIiwic3JjL2FwcC9Nb2RlbC9UaHVvYy9pbmRleC5qcyIsInNyYy9hcHAvaW5wdXRQcmV2aWV3Mi5qcyIsInNyYy9zY3JpcHQvbmhhcC1kb24tdmkuanMiLCJzcmMvc2NyaXB0L25oYXAtaG9hLWRvbi5qcyIsInNyYy9zY3JpcHQvbmhhcC1uc3guanMiLCJzcmMvc2NyaXB0L25oYXAtdGh1b2MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFwiR0lBX0JBTl9USEVPX0xJRVVcIjogODAwMCxcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IENvbnRyb2xsZXJfMSA9IHJlcXVpcmUoXCIuL0NvbnRyb2xsZXJcIik7XG5jb25zdCBpbnB1dFByZXZpZXcyXzEgPSByZXF1aXJlKFwiLi9pbnB1dFByZXZpZXcyXCIpO1xuY29uc3QgX1FMTlQgPSBjbGFzcyBleHRlbmRzIENvbnRyb2xsZXJfMS5Db250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5hZGRNb2RlbCgnRG9uVmknLCAnRG9uVmknKTtcbiAgICAgICAgdGhpcy5hZGRNb2RlbCgnVGh1b2MnLCAnVGh1b2MnKTtcbiAgICAgICAgdGhpcy5hZGRNb2RlbCgnTnN4JywgJ05zeCcpO1xuICAgIH1cbiAgICBhZGRUYWJsZShlbGVtZW50KSB7XG4gICAgICAgIGxldCBuYW1lVEhzID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwidGhcIik7XG4gICAgICAgIGxldCBjb21wb05hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnY29tcG9uZW50Jyk7XG4gICAgICAgIGNvbnN0IGxvb2tOYW1lID0gQXJyYXkuZnJvbShuYW1lVEhzKS5tYXAoKHZhbCkgPT4gdmFsLmdldEF0dHJpYnV0ZSgnZm9yJykpO1xuICAgICAgICBjb25zdCB1cGRhdGVUYWJsZSA9IGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgbGV0IGJvZHkgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3Rib2R5Jyk7XG4gICAgICAgICAgICAvLyBkZWxldGUgb2xkIHJvd1xuICAgICAgICAgICAgd2hpbGUgKGJvZHkubGFzdENoaWxkKVxuICAgICAgICAgICAgICAgIGJvZHkucmVtb3ZlQ2hpbGQoYm9keS5sYXN0Q2hpbGQpO1xuICAgICAgICAgICAgLy8gdXBkYXRhIG5ldyByb3dcbiAgICAgICAgICAgIGZvciAobGV0IHJvdyBvZiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJvd0VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBuYW1lIG9mIGxvb2tOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdURCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgICAgICAgICAgICAgICAgIG5ld1RELnRleHRDb250ZW50ID0gcm93W25hbWVdO1xuICAgICAgICAgICAgICAgICAgICByb3dFbC5hcHBlbmRDaGlsZChuZXdURCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJvZHkuYXBwZW5kQ2hpbGQocm93RWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmFkZFVwZGF0ZUZ1bmMoY29tcG9OYW1lLCB1cGRhdGVUYWJsZSk7XG4gICAgfVxuICAgIGFkZE5hbWVJbnB1dFRodW9jKGlkRWxlbWVudCwgb3B0TGlzdGVuLCBvcHRDaGFuZ2UpIHtcbiAgICAgICAgY29uc3QgcHJldmlldyA9IG5ldyBpbnB1dFByZXZpZXcyXzEuZGVmYXVsdCgpO1xuICAgICAgICBwcmV2aWV3LmFkZExvb2t1cChvcHRMaXN0ZW4pO1xuICAgICAgICBwcmV2aWV3Lmxpc3RlbihpZEVsZW1lbnQsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGxldCBpZEVsIG9mIE9iamVjdC5rZXlzKG9wdENoYW5nZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWVsZCA9IG9wdENoYW5nZVtpZEVsXTtcbiAgICAgICAgICAgICAgICAkKCcjJyArIGlkRWwpLnZhbChkYXRhW2ZpZWxkXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBvblVwZGF0ZSA9IGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByZXZpZXcuYWRkRGF0YShkYXRhKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5hZGRVcGRhdGVGdW5jKCdUaHVvYycsIG9uVXBkYXRlKTtcbiAgICB9XG4gICAgYWRkU2VsZWN0SW5wdXQoZWxlbWVudCwgb3B0KSB7XG4gICAgICAgIGNvbnN0IHZhbHVlS2V5ID0gb3B0LnZhbHVlO1xuICAgICAgICBjb25zdCB0aXRsZUtleSA9IG9wdC50aXRsZTtcbiAgICAgICAgY29uc3QgY29tcG9OYW1lID0gJChlbGVtZW50KS5hdHRyKCdjb21wb25lbnQnKTtcbiAgICAgICAgY29uc3Qgb25VcGRhdGUgPSBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyByZW1vdmUgb2xkIG9wdGlvbnNcbiAgICAgICAgICAgIHdoaWxlIChlbGVtZW50Lmxhc3RDaGlsZClcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQubGFzdENoaWxkKTtcbiAgICAgICAgICAgIC8vIGFkZCB1cGRhdGVkIG9wdGlvblxuICAgICAgICAgICAgZm9yIChjb25zdCByb3cgb2YgZGF0YSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld09wdCA9ICQoXCI8b3B0aW9uLz5cIik7XG4gICAgICAgICAgICAgICAgbmV3T3B0LmF0dHIoJ3ZhbHVlJywgcm93W3ZhbHVlS2V5XSlcbiAgICAgICAgICAgICAgICAgICAgLnRleHQocm93W3RpdGxlS2V5XSlcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmFkZFVwZGF0ZUZ1bmMoY29tcG9OYW1lLCBvblVwZGF0ZSk7XG4gICAgfVxufTtcbmV4cG9ydHMuUUxOVCA9IF9RTE5UO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QXBwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgX0NUSG9hRG9uID0gY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKG1hID0gLTEsIHRlbiA9IFwiXCIsIGRvbnZpID0gLTEsIHNsID0gMCwgdGhhbmh0aWVuID0gMCkge1xuICAgICAgICB0aGlzLm1hID0gbWE7XG4gICAgICAgIHRoaXMudGVuID0gdGVuO1xuICAgICAgICB0aGlzLmRvbnZpID0gZG9udmk7XG4gICAgICAgIHRoaXMuc2wgPSBzbDtcbiAgICAgICAgdGhpcy50aGFuaHRpZW4gPSB0aGFuaHRpZW47XG4gICAgICAgIHRoaXMuX2NoaWxkRWxlbWVudCA9IHt9O1xuICAgICAgICB0aGlzLl9lbGVtZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KCk7XG4gICAgICAgIHRoaXMudXBkYXRlQWxsVmFsdWUobWEsIHRlbiwgZG9udmksIHNsLCB0aGFuaHRpZW4pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBjcmVhdGUgcm93IGVsZW1lbnQgZm9yIHRhYmxlXG4gICAgICovXG4gICAgY3JlYXRlRWxlbWVudCgpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG4gICAgICAgIGNvbnN0IG1hVEQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgICAgICBjb25zdCB0ZW5URCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgICAgIGNvbnN0IGRvbnZpVEQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgICAgICBjb25zdCBzbFREID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICAgICAgY29uc3QgdGllblREID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICAgICAgbWFURC5jbGFzc0xpc3QuYWRkKCdjdGhkLW10aHVvYycpO1xuICAgICAgICB0ZW5URC5jbGFzc0xpc3QuYWRkKCdjdGhkLXR0aHVvYycpO1xuICAgICAgICBkb252aVRELmNsYXNzTGlzdC5hZGQoJ2N0aGQtZG9udmknKTtcbiAgICAgICAgc2xURC5jbGFzc0xpc3QuYWRkKCdjdGhkLXNsJyk7XG4gICAgICAgIHRpZW5URC5jbGFzc0xpc3QuYWRkKCdjdGhkLWdpYScpO1xuICAgICAgICB0aGlzLl9lbGVtZW50LmFwcGVuZENoaWxkKG1hVEQpO1xuICAgICAgICB0aGlzLl9lbGVtZW50LmFwcGVuZENoaWxkKHRlblREKTtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZChkb252aVREKTtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZChzbFREKTtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZCh0aWVuVEQpO1xuICAgICAgICB0aGlzLl9jaGlsZEVsZW1lbnQgPSB7XG4gICAgICAgICAgICBcIm1hX3RodW9jXCI6IG1hVEQsXG4gICAgICAgICAgICBcInRlbl90aHVvY1wiOiB0ZW5URCxcbiAgICAgICAgICAgIFwiZG9uX3ZpXCI6IGRvbnZpVEQsXG4gICAgICAgICAgICBcInNvX2x1b25nXCI6IHNsVEQsXG4gICAgICAgICAgICBcInRoYW5odGllblwiOiB0aWVuVERcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZ2V0Um93RWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgcmVtb3ZlKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2VsZW1lbnQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZTtcbiAgICAgICAgaWYgKHBhcmVudClcbiAgICAgICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLl9lbGVtZW50KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogZ2V0IGpzb24gZGF0YSBmb3IgcG9zdCBmb3JtXG4gICAgICovXG4gICAgZ2V0RGF0YUpTT04oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAnbWFfdGh1b2MnOiB0aGlzLm1hLFxuICAgICAgICAgICAgJ3Rlbl90aHVvYyc6IHRoaXMudGVuLFxuICAgICAgICAgICAgJ2Rvbl92aSc6IHRoaXMuZG9udmksXG4gICAgICAgICAgICAnc29fbHVvbmcnOiB0aGlzLnNsXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIG1hXG4gICAgICogQHBhcmFtIHRlblxuICAgICAqIEBwYXJhbSBkb252aVxuICAgICAqIEBwYXJhbSBzbFxuICAgICAqIEBwYXJhbSB0aGFuaHRpZW5cbiAgICAgKi9cbiAgICB1cGRhdGVBbGxWYWx1ZShtYSwgdGVuLCBkb252aSwgc2wsIHRoYW5odGllbikge1xuICAgICAgICB0aGlzLm1hID0gbWE7XG4gICAgICAgIHRoaXMudGVuID0gdGVuO1xuICAgICAgICB0aGlzLmRvbnZpID0gZG9udmk7XG4gICAgICAgIHRoaXMuc2wgPSBzbDtcbiAgICAgICAgdGhpcy50aGFuaHRpZW4gPSB0aGFuaHRpZW47XG4gICAgICAgIHRoaXMuX2NoaWxkRWxlbWVudFsnbWFfdGh1b2MnXS50ZXh0Q29udGVudCA9IG1hICsgXCJcIjtcbiAgICAgICAgdGhpcy5fY2hpbGRFbGVtZW50Wyd0ZW5fdGh1b2MnXS50ZXh0Q29udGVudCA9IHRlbiArIFwiXCI7XG4gICAgICAgIHRoaXMuX2NoaWxkRWxlbWVudFsnZG9uX3ZpJ10udGV4dENvbnRlbnQgPSBkb252aSArIFwiXCI7XG4gICAgICAgIHRoaXMuX2NoaWxkRWxlbWVudFsnc29fbHVvbmcnXS50ZXh0Q29udGVudCA9IHNsICsgXCJcIjtcbiAgICAgICAgdGhpcy5fY2hpbGRFbGVtZW50Wyd0aGFuaHRpZW4nXS50ZXh0Q29udGVudCA9IHRoYW5odGllbiArIFwiXCI7XG4gICAgfVxuICAgIHVwZGF0ZVZhbHVlKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgICAgICAgY2FzZSBcIm1hX3RodW9jXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5tYSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInRlbl90aHVvY1wiOlxuICAgICAgICAgICAgICAgIHRoaXMudGVuID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZG9uX3ZpXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5kb252aSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInNvX2x1b25nXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5zbCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInRoYW5oX3RpZW5cIjpcbiAgICAgICAgICAgICAgICB0aGlzLnRoYW5odGllbiA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NoaWxkRWxlbWVudFtuYW1lXS50ZXh0Q29udGVudCA9IHZhbHVlO1xuICAgIH1cbn07XG5leHBvcnRzLkNUSG9hRG9uID0gX0NUSG9hRG9uO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Q1RIb2FEb24uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBEb25WaV8xID0gcmVxdWlyZShcIi4vTW9kZWwvRG9uVmlcIik7XG5jb25zdCBUaHVvY18xID0gcmVxdWlyZShcIi4vTW9kZWwvVGh1b2NcIik7XG5jb25zdCBOc3hfMSA9IHJlcXVpcmUoXCIuL01vZGVsL05zeFwiKTtcbmNvbnN0IF9Db250cm9sbGVyID0gY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9jb21wb25lbnRMaXN0ID0ge307XG4gICAgICAgIHRoaXMuX2V2ZW50ID0ge307XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIG5hbWUgb2YgbW9kZWxcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZW5hbWUgdHlwZSBvZiBtb2RlbCAoRG9uVmkgfCBUaHVvYyB8IE5zeClcbiAgICAgKi9cbiAgICBhZGRNb2RlbChuYW1lLCB0eXBlbmFtZSkge1xuICAgICAgICBpZiAodGhpcy5fY29tcG9uZW50TGlzdC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IobmFtZSArIFwiIGlzIGV4aXN0aW5nIG1vZGVsXCIpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBuZXdPYmogPSBudWxsO1xuICAgICAgICBzd2l0Y2ggKHR5cGVuYW1lKSB7XG4gICAgICAgICAgICBjYXNlIFwiRG9uVmlcIjpcbiAgICAgICAgICAgICAgICBuZXdPYmogPSBuZXcgRG9uVmlfMS5Eb25WaSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlRodW9jXCI6XG4gICAgICAgICAgICAgICAgbmV3T2JqID0gbmV3IFRodW9jXzEuVGh1b2MoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJOc3hcIjpcbiAgICAgICAgICAgICAgICBuZXdPYmogPSBuZXcgTnN4XzEuTnN4KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJ1bmtub3duIHR5cGVuYW1lOiBcIiArIHR5cGVuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jb21wb25lbnRMaXN0W25hbWVdID0gbmV3T2JqO1xuICAgICAgICB0aGlzLl9ldmVudFtuYW1lXSA9IFtdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY29tcG9OYW1lIGNvbXBvbmVudCBuYW1lXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEByZXR1cm4geyhlcnIsIGRhdGEpPT57fX1cbiAgICAgKi9cbiAgICBhZGRVcGRhdGVGdW5jKGNvbXBvTmFtZSwgZnVuYyA9IChlcnIsIGRhdGEpID0+IHsgfSkge1xuICAgICAgICBpZiAoIXRoaXMuX2V2ZW50Lmhhc093blByb3BlcnR5KGNvbXBvTmFtZSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm90IGZvdW5kIFwiICsgY29tcG9OYW1lKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9ldmVudFtjb21wb05hbWVdLnB1c2goZnVuYyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHVwZGF0ZSBhbGwgbW9kZWwgYW5kIGNhbGwgY2FsbGJhY2sgZXZlbnRcbiAgICAgKi9cbiAgICBvblVwZGF0ZUFsbCgpIHtcbiAgICAgICAgZm9yIChjb25zdCBjb21wb05hbWUgb2YgT2JqZWN0LmtleXModGhpcy5fY29tcG9uZW50TGlzdCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50TGlzdFtjb21wb05hbWVdLmdldChmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBmdW5jIG9mIHRoYXQuX2V2ZW50W2NvbXBvTmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgZnVuYyhlcnIsIGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufTtcbmV4cG9ydHMuQ29udHJvbGxlciA9IF9Db250cm9sbGVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Q29udHJvbGxlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IENUSG9hRG9uXzEgPSByZXF1aXJlKFwiLi9DVEhvYURvblwiKTtcbi8vIGltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG4vKipcbiAqIEjDs2EgxJDGoW4gRm9ybVxuICovXG5jb25zdCBfSG9hRG9uRm9ybSA9IGNsYXNzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fZGF0YWJhc2UgPSBcIi9wdWJsaWMvYXBpL2hvYV9kb24vXCI7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKC91c2VybmFtZT0oXFx3KykvKTtcbiAgICAgICAgdGhpcy5fdXNlcm5hbWUgPSBtYXRjaCA/IG1hdGNoWzFdIDogXCJOb3QgRm91bmRcIjtcbiAgICAgICAgdGhpcy5fbGlzdENUSEQgPSB7fTsgLy9PYmplY3QgYmVjYXVzZSBkYXRhIGhhcyBrZXkgJ21hX3RodW9jJ1xuICAgICAgICB0aGlzLl9oZWFkZXJGb3JtID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9DVEhEVGFibGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX2doaUNodSA9IFwiXCI7XG4gICAgfVxuICAgIHNldEhlYWRlcihlbGVtZW50KSB7XG4gICAgICAgIHRoaXMuX2hlYWRlckZvcm0gPSBlbGVtZW50O1xuICAgICAgICB0aGlzLl9oZWFkZXJGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAoIWUudGFyZ2V0KVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFBcnIgPSAkKGUudGFyZ2V0KS5zZXJpYWxpemVBcnJheSgpO1xuICAgICAgICAgICAgY29uc3QgZGF0YU9iaiA9IHt9O1xuICAgICAgICAgICAgZGF0YUFyci5mb3JFYWNoKCh2YWwpID0+IHtcbiAgICAgICAgICAgICAgICBkYXRhT2JqW3ZhbC5uYW1lXSA9IHZhbC52YWx1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5hZGRDVEhEKCtkYXRhT2JqWydtYV90aHVvYyddLCBkYXRhT2JqWyd0ZW5fdGh1b2MnXSwgK2RhdGFPYmpbJ3NvX2x1b25nJ10sICtkYXRhT2JqWydkb25fdmknXSwgK2RhdGFPYmpbJ2Nvc3QnXSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzZXRUYWJsZShlbGVtZW50KSB7XG4gICAgICAgIHRoaXMuX0NUSERUYWJsZSA9IGVsZW1lbnQ7XG4gICAgfVxuICAgIGdldFVzZXJuYW1lKCkge1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLl91c2VybmFtZSk7XG4gICAgICAgIHJldHVybiB0aGlzLl91c2VybmFtZTtcbiAgICB9XG4gICAgbmV3SG9hRG9uKCkge1xuICAgICAgICBmb3IgKGxldCBlbCBpbiB0aGlzLl9saXN0Q1RIRCkge1xuICAgICAgICAgICAgdGhpcy5fbGlzdENUSERbZWxdLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGdldCB0b3RhbCBjYXNoIG9mIDEgSG9hRG9uXG4gICAgICovXG4gICAgZ2V0VG90YWxDYXNoKCkge1xuICAgICAgICBsZXQgc3VtID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBtYV90aHVvYyBvZiBBcnJheS5mcm9tKE9iamVjdC5rZXlzKHRoaXMuX2xpc3RDVEhEKSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGN0aGQgPSB0aGlzLl9saXN0Q1RIRFttYV90aHVvY107XG4gICAgICAgICAgICBzdW0gKz0gY3RoZC50b3RhbENhc2g7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1bTtcbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWFfdGh1b2NcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc29sdW9uZ1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkb252aVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbENhc2hcbiAgICAgKi9cbiAgICBhZGRDVEhEKG1hX3RodW9jLCB0ZW5fdGh1b2MsIHNvbHVvbmcsIGRvbnZpLCB0b3RhbENhc2gpIHtcbiAgICAgICAgaWYgKHRoaXMuX2xpc3RDVEhELmhhc093blByb3BlcnR5KG1hX3RodW9jKSkge1xuICAgICAgICAgICAgY29uc3QgbmV3U2wgPSB0aGlzLl9saXN0Q1RIRFttYV90aHVvY10uc2wgKyBzb2x1b25nO1xuICAgICAgICAgICAgdGhpcy5fbGlzdENUSEQubWFfdGh1b2MudXBkYXRlVmFsdWUoJ3NvX2x1b25nJywgbmV3U2wpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgbmV3Q1RIRCA9IG5ldyBDVEhvYURvbl8xLkNUSG9hRG9uKG1hX3RodW9jLCB0ZW5fdGh1b2MsIGRvbnZpLCBzb2x1b25nLCB0b3RhbENhc2ggKiBzb2x1b25nKTtcbiAgICAgICAgICAgIHRoaXMuX2xpc3RDVEhEW21hX3RodW9jXSA9IG5ld0NUSEQ7XG4gICAgICAgICAgICBjb25zdCByb3dFbGVtZW50ID0gbmV3Q1RIRC5nZXRSb3dFbGVtZW50KCk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX0NUSERUYWJsZSB8fCAhcm93RWxlbWVudClcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB0aGlzLl9DVEhEVGFibGUudEJvZGllc1swXS5pbnNlcnRCZWZvcmUocm93RWxlbWVudCwgdGhpcy5fQ1RIRFRhYmxlLnRCb2RpZXNbMF0uY2hpbGROb2Rlc1swXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBwdXNoVG9EYXRhYmFzZShzdWNjZXNzQ2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spIHtcbiAgICAgICAgY29uc3QgaG9hRG9uSW5mbyA9IHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiB0aGlzLl91c2VybmFtZSxcbiAgICAgICAgICAgIHRpbWU6IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCksXG4gICAgICAgICAgICBnaGljaHU6IHRoaXMuX2doaUNodVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgaG9hX2RvbjogaG9hRG9uSW5mbyxcbiAgICAgICAgICAgIGN0aGQ6IHRoaXMuX2xpc3RDVEhEXG4gICAgICAgIH07XG4gICAgICAgICQuYWpheCh0aGlzLl9kYXRhYmFzZSwge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICB4aHJGaWVsZHM6IHtcbiAgICAgICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkYXRhOiBcImRhdGE9XCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChqc29uKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCEhanNvbi5lcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JDYWxsYmFjayhqc29uLm1zZyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3VjY2Vzc0NhbGxiYWNrKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICBlcnJvckNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5leHBvcnRzLkhvYURvbkZvcm0gPSBfSG9hRG9uRm9ybTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUhvYURvbkZvcm0uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBCb290c3RyYXBNb2RhbCB7XG4gICAgY29uc3RydWN0b3IoaWQpIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLl9lbGVtZW50ID0gdGhpcy5fY3JlYXRlTW9kYWwoaWQpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuX2VsZW1lbnRbMF0pO1xuICAgIH1cbiAgICBzZXRUaXRsZSh0ZXh0KSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuZmluZCgnLm1vZGFsLXRpdGxlJykudGV4dCh0ZXh0KTtcbiAgICB9XG4gICAgc2V0Q29udGVudChodG1sKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuZmluZCgnLm1vZGFsLWJvZHknKS5odG1sKGh0bWwpO1xuICAgIH1cbiAgICBzaG93KHRpdGxlLCBjb250ZW50KSB7XG4gICAgICAgIHRoaXMuc2V0VGl0bGUodGl0bGUpO1xuICAgICAgICB0aGlzLnNldENvbnRlbnQoY29udGVudCk7XG4gICAgICAgIHRoaXMub3BlbigpO1xuICAgIH1cbiAgICBvcGVuKCkge1xuICAgICAgICB0aGlzLl9lbGVtZW50Lm1vZGFsKCdzaG93Jyk7XG4gICAgfVxuICAgIGNsb3NlKCkge1xuICAgICAgICB0aGlzLl9lbGVtZW50Lm1vZGFsKCdoaWRlJyk7XG4gICAgfVxuICAgIF9jcmVhdGVNb2RhbChpZCkge1xuICAgICAgICBjb25zdCBkaXYgPSAkKFwiPGRpdi8+XCIpO1xuICAgICAgICBkaXYuYXR0cignaWQnLCBpZCk7XG4gICAgICAgIGRpdi5hZGRDbGFzcygnbW9kYWwgZmFkZScpLmRhdGEoJ3RvZ2dsZScsICdtb2RhbCcpO1xuICAgICAgICBkaXYuaHRtbChgXG4gICAgICAgIDxkaXYgY2xhc3M9J21vZGFsLWRpYWxvZyBtb2RhbC1sZyBtb2RhbC1jZW50ZXInPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz0nbW9kYWwtY29udGVudCc+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0nbW9kYWwtaGVhZGVyJz5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0nbW9kYWwtdGl0bGUnPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdjbG9zZScgZGF0YS1kaXNtaXNzPSdtb2RhbCc+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz0nZmEgZmEtdGltZXMnPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0nbW9kYWwtYm9keSc+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0nbW9kYWwtZm9vdGVyJz5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1zZWNvbmRhcnknIGRhdGEtZGlzbWlzcz0nbW9kYWwnPkNsb3NlPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9J2J0biBidG4tcHJpbWFyeSc+T0s8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgYCk7XG4gICAgICAgIHJldHVybiBkaXY7XG4gICAgfVxufVxuZXhwb3J0cy5Cb290c3RyYXBNb2RhbCA9IEJvb3RzdHJhcE1vZGFsO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IE1vZGVsQ2xhc3NfMSA9IHJlcXVpcmUoXCIuLi9Nb2RlbENsYXNzXCIpO1xuY2xhc3MgX0RvblZpIGV4dGVuZHMgTW9kZWxDbGFzc18xLk1vZGVsIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fZGF0YWJhc2UgPSBcIi9hcGkvZG9uX3ZpL1wiO1xuICAgICAgICB0aGlzLl9mZXRjaERhdGEgPSBudWxsO1xuICAgIH1cbiAgICBnZXQoY2FsbGJhY2sgPSAoZXJyLCBkYXRhKSA9PiB7IH0pIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHRoaXMuX2dldCh7fSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZmV0Y2hEYXRhID0gdGhpcy5fZmlsdGVyKGRhdGEpO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlLCB0aGlzLl9mZXRjaERhdGEpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9mZXRjaERhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9maWx0ZXIocmF3RGF0YSkge1xuICAgICAgICBsZXQgbmV3RGF0YSA9IHJhd0RhdGEuc2xpY2UoKTtcbiAgICAgICAgbGV0IG1hcCA9IHt9O1xuICAgICAgICBmb3IgKGxldCByb3cgb2YgbmV3RGF0YSkge1xuICAgICAgICAgICAgbGV0IGhlc28gPSByb3dbJ2hlX3NvX3F1eWRvaSddO1xuICAgICAgICAgICAgbWFwW3Jvd1snaWQnXV0gPSByb3c7XG4gICAgICAgICAgICByb3dbJ3RleHRRdXlEb2knXSA9IGhlc28gPyBcIlwiIDogXCLEkcahbiB24buLIGPGoSBi4bqjblwiO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IHJvdyBvZiBuZXdEYXRhKSB7XG4gICAgICAgICAgICBsZXQgaWRfY29fYmFuID0gcm93WydpZF9xdXlfZG9pJ107XG4gICAgICAgICAgICBsZXQgaGVzbyA9ICtyb3dbJ2hlX3NvX3F1eWRvaSddO1xuICAgICAgICAgICAgd2hpbGUgKG1hcC5oYXNPd25Qcm9wZXJ0eShpZF9jb19iYW4pKSB7XG4gICAgICAgICAgICAgICAgcm93Wyd0ZXh0UXV5RG9pJ10gKz0gYD0ke2hlc299eFske21hcFtpZF9jb19iYW5dWyd0ZW4nXX1dYDtcbiAgICAgICAgICAgICAgICBoZXNvICo9ICttYXBbaWRfY29fYmFuXVsnaGVfc29fcXV5ZG9pJ107XG4gICAgICAgICAgICAgICAgaWRfY29fYmFuID0gbWFwW2lkX2NvX2Jhbl1bJ2lkX3F1eV9kb2knXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RGF0YTtcbiAgICB9XG59XG5leHBvcnRzLkRvblZpID0gX0RvblZpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIF9Nb2RlbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX2RhdGFiYXNlID0gXCJcIjtcbiAgICAgICAgdGhpcy5fZGF0YSA9IFtdO1xuICAgIH1cbiAgICBnZXQgZGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX2RhdGEpO1xuICAgIH1cbiAgICBnZXQgcmVzcG9uc2UoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9yZXMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBmZXRjaCBkYXRhIGZyb20gZGF0YWJhc2UgYW5kIGRvIHRoaW5nXG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqIEBwYXJhbSBjYWxsYmFjayBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqXG4gICAgICovXG4gICAgX2dldChwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0aGlzLl9kYXRhID0gW107XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0VVJMID0gdGhpcy5fZGF0YWJhc2UgKyB0aGlzLl91cmxwYXJhbXMocGFyYW1zKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0geWllbGQgZmV0Y2gocmVxdWVzdFVSTCwgeyBjcmVkZW50aWFsczogJ2luY2x1ZGUnIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGpzb24gPSB5aWVsZCByZXMuanNvbigpO1xuICAgICAgICAgICAgICAgIGlmIChqc29uLmVycilcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGpzb24ubXNnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9kYXRhID0ganNvbi5kYXRhO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UsIGpzb24uZGF0YSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGpzb24uZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAgICovXG4gICAgX3Bvc3QoZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlcyA9IFwiXCI7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IHlpZWxkIGZldGNoKHRoaXMuX2RhdGFiYXNlLCB7XG4gICAgICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGpzb24gPSB5aWVsZCByZXMuanNvbigpO1xuICAgICAgICAgICAgICAgIGlmIChqc29uLmVycilcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGpzb24ubXNnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXMgPSBqc29uLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhmYWxzZSwganNvbi5kYXRhKTtcbiAgICAgICAgICAgICAgICByZXR1cm4ganNvbi5kYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF91cmxwYXJhbXMocGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IE9iamVjdC5rZXlzKHBhcmFtcykubWFwKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KGspICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtc1trXSk7XG4gICAgICAgIH0pLmpvaW4oJyYnKTtcbiAgICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG59XG5leHBvcnRzLk1vZGVsID0gX01vZGVsO1xuO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IE1vZGVsQ2xhc3NfMSA9IHJlcXVpcmUoXCIuLi9Nb2RlbENsYXNzXCIpO1xuY2xhc3MgX05zeCBleHRlbmRzIE1vZGVsQ2xhc3NfMS5Nb2RlbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX2RhdGFiYXNlID0gXCIvYXBpL25jYy9cIjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogZ2V0IGRhdGEgb2YgbnN4XG4gICAgICogQHBhcmFtIGNhbGxiYWNrIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICovXG4gICAgZ2V0KGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgdGhpcy5fZ2V0KHt9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UsIGRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB1cGRhdGUoY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNyZWF0ZShjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVtb3ZlKGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuTnN4ID0gX05zeDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4vKipcbiAqIERpc3BsYXkgZGF0YSB1bmRlciB0YWJsZVxuICovXG5jbGFzcyBUYWJsZURhdGEge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9tYXAgPSB7fTtcbiAgICAgICAgdGhpcy5fbGlzdCA9IFtdO1xuICAgICAgICB0aGlzLl9pc0Nvbm5lY3QgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fY29ubmVjdFN0YXR1cyA9IFwiXCI7XG4gICAgICAgIHRoaXMuX2lzRmV0Y2hlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9kYlVSTCA9IFwiXCI7XG4gICAgfVxuICAgIGdldERhdGEoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBsZXQgcmVzID0geWllbGQgZmV0Y2godGhpcy5fZGJVUkwsIHsgbWV0aG9kOiBcIkdFVFwiLCBjcmVkZW50aWFsczogJ2luY2x1ZGUnIH0pO1xuICAgICAgICAgICAgaWYgKCFyZXMub2spIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0Nvbm5lY3QgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25uZWN0U3RhdHVzID0gcmVzLnN0YXR1c1RleHQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5faXNDb25uZWN0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3RTdGF0dXMgPSBcIlwiO1xuICAgICAgICAgICAgbGV0IGpzb24gPSB5aWVsZCByZXMuanNvbigpO1xuICAgICAgICAgICAgaWYgKCEhanNvbi5lcnIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0ZldGNoZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25uZWN0U3RhdHVzID0ganNvbi5tc2c7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5faXNGZXRjaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3RTdGF0dXMgPSBcIk9LXCI7XG4gICAgICAgICAgICB0aGlzLl9saXN0ID0ganNvbi5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0IHRhYmxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWFwO1xuICAgIH1cbiAgICBnZXQgbGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3Q7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gVGFibGVEYXRhO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IFRhYmxlRGF0YV8xID0gcmVxdWlyZShcIi4uL1RhYmxlRGF0YVwiKTtcbmNsYXNzIEJhbmdUaHVvYyBleHRlbmRzIFRhYmxlRGF0YV8xLmRlZmF1bHQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9kYlVSTCA9IFwiL2FwaS90aHVvYy9cIjtcbiAgICB9XG4gICAgdXBkYXRlKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgdGhpcy5nZXREYXRhKCk7XG4gICAgICAgICAgICBmb3IgKGxldCByb3cgb2YgdGhpcy5fbGlzdCkge1xuICAgICAgICAgICAgICAgIGxldCBpZCA9IHJvd1snaWQnXTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXBbaWRdID0gcm93O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLkJhbmdUaHVvYyA9IEJhbmdUaHVvYztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUJhbmdUaHVvYy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IE1vZGVsQ2xhc3NfMSA9IHJlcXVpcmUoXCIuLi9Nb2RlbENsYXNzXCIpO1xuY29uc3QgQmFuZ1RodW9jXzEgPSByZXF1aXJlKFwiLi9CYW5nVGh1b2NcIik7XG5leHBvcnRzLkJhbmdUaHVvYyA9IEJhbmdUaHVvY18xLkJhbmdUaHVvYztcbmNsYXNzIF9UaHVvYyBleHRlbmRzIE1vZGVsQ2xhc3NfMS5Nb2RlbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX2RhdGFiYXNlID0gXCIvYXBpL3RodW9jL1wiO1xuICAgIH1cbiAgICBnZXQoY2FsbGJhY2spIHtcbiAgICAgICAgbGV0ICR0aGlzID0gdGhpcztcbiAgICAgICAgJHRoaXMuX2dldCh7fSwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UsIGRhdGEpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY3JlYXRlKGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX3Bvc3QoZGF0YSwgY2FsbGJhY2spO1xuICAgIH1cbn1cbmV4cG9ydHMuVGh1b2MgPSBfVGh1b2M7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIGlucHV0UHJldmlldzIge1xuICAgIGNvbnN0cnVjdG9yKHRhcmdldCA9IGRvY3VtZW50KSB7XG4gICAgICAgIHRoaXMuX2xpc3QgPSB7fTtcbiAgICAgICAgdGhpcy5fZGF0YSA9IFtdO1xuICAgICAgICB0aGlzLl9sb29rdXAgPSB7fTtcbiAgICAgICAgdGhpcy5fdGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICB0aGlzLl9wcmV2aWV3X2RpdiA9IG51bGw7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRQcmV2aWV3RGF0YSA9IFtdO1xuICAgICAgICAvLyBjb25zdHJ1Y3RvciAgICBcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldDtcbiAgICAgICAgICAgIGlmICghdGFyZ2V0LmNsYXNzTGlzdC5oYXNPd25Qcm9wZXJ0eShcInByZXZpZXctcm93XCIpKVxuICAgICAgICAgICAgICAgIHRoaXMuX2RlbGV0ZVByZXZpZXcoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGFkZCBsb29rdXAgdG8ganNvbiBuYW1lXG4gICAgICogQHBhcmFtIHt7aWRFbDogU3RyaW5nfX0gYXJyIHsgaWRfZWxlbWVudCA6IG5hbWVfb2ZfZmllbGR9XG4gICAgICovXG4gICAgYWRkTG9va3VwKGFycikge1xuICAgICAgICBpZiAodHlwZW9mIGFyciAhPSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhPYmplY3QuY2FsbChhcnIpKTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInBhcmFtZXRlciBtdXN0IGJlIGpzb24gb2JqXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhhcnIpKSB7XG4gICAgICAgICAgICB0aGlzLl9sb29rdXBba2V5XSA9IGFycltrZXldO1xuICAgICAgICAgICAgbGV0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoa2V5KTtcbiAgICAgICAgICAgIGlmICghZWwpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhFcnJvcihgQ2Fubm90IGZpbmQgIyR7a2V5fSBlbGVtZW50YCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGlzdFtrZXldID0gZWw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgO1xuICAgIC8qKlxuICAgICAqIGFkZCBob3N0IHRvIGZldGNoIGRhdGFiYXNlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCBhc2RcbiAgICAgKi9cbiAgICBhZGREYXRhKGRhdGEpIHtcbiAgICAgICAgaWYgKHR5cGVvZiAoZGF0YSkgIT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicGFyYW1ldGVyIG11c3QgYmUganNvblwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgICB9XG4gICAgO1xuICAgIGxpc3RlbihpZCwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgIGxldCBjdXIgPSAwO1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBsZXQgY29kZSA9IGUua2V5Q29kZTtcbiAgICAgICAgICAgIGlmIChjb2RlID09PSAyNykgeyAvLyBlc2NcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWxldGVQcmV2aWV3KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjb2RlID09IDM4IHx8IGNvZGUgPT0gNDApIHsgLy8gdXAtZG93blxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmV2aWV3X2Rpdi5jaGlsZHJlbltjdXJdLmNsYXNzTGlzdC5yZW1vdmUoXCJwcmV2aWV3LXJvdy1hY3RpdmVcIik7XG4gICAgICAgICAgICAgICAgbGV0IGxlbiA9IHRoaXMuX3ByZXZpZXdfZGl2LmNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBjdXIgPSAoY29kZSA9PSAzOCkgPyBjdXIgLSAxIDogY3VyICsgMTtcbiAgICAgICAgICAgICAgICBpZiAoY3VyIDwgMClcbiAgICAgICAgICAgICAgICAgICAgY3VyID0gbGVuIC0gMTtcbiAgICAgICAgICAgICAgICBpZiAoY3VyID4gbGVuIC0gMSlcbiAgICAgICAgICAgICAgICAgICAgY3VyID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmV2aWV3X2Rpdi5jaGlsZHJlbltjdXJdLmNsYXNzTGlzdC5hZGQoXCJwcmV2aWV3LXJvdy1hY3RpdmVcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJldmlld19kaXYuc2V0QXR0cmlidXRlKFwiY3VyXCIsIGN1ciArIFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29kZSA9PSAxMykgeyAvLyBlbnRlclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayh0aGlzLl9jdXJyZW50UHJldmlld0RhdGFbY3VyXSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVsZXRlUHJldmlldygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZXRjaE9uKGlkLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqIGZldGNoIGRhdGFiYXNlIGFuZCBzaG93IGluIGlucHV0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIGlkIG9mIGh0bWwgZWxlbWVudCBpbnB1dCBuZWVkIHRvIGZldGNoIGJ5IHZhbHVlXG4gICAgICovXG4gICAgZmV0Y2hPbihpZCwgY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5fZGVsZXRlUHJldmlldygpO1xuICAgICAgICB0aGlzLl9jdXJyZW50UHJldmlld0RhdGEubGVuZ3RoID0gMDsgLy9jbGVhciBjdXJyZW50IHByZXZpZXcgc3VnZ2VzdCBuYW1lXG4gICAgICAgIGlmICghdGhpcy5fbGlzdC5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2Fubm90IGZpbmQgXCIgKyBpZCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgICAgICBsZXQgaW5wdXQgPSB0aGlzLl9saXN0W2lkXTtcbiAgICAgICAgbGV0IGlucHV0X3ByZXZpZXcgPSB0aGlzLl9jcmVhdGVGbHlXcmFwKGlucHV0KTtcbiAgICAgICAgbGV0IHZhbHVlID0gaW5wdXQudmFsdWU7XG4gICAgICAgIHRoaXMuX3ByZXZpZXdfZGl2ID0gaW5wdXRfcHJldmlldztcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCdhdXRvY29tcGxldGUnLCAnb2ZmJyk7XG4gICAgICAgIGZvciAoY29uc3Qgcm93IG9mIHRoaXMuX2RhdGEpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5faXNMaWtlKHJvd1t0aGlzLl9sb29rdXBbaWRdXSwgdmFsdWUpKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFByZXZpZXdEYXRhLnB1c2gocm93KTtcbiAgICAgICAgICAgIGxldCBhcnIgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBPYmplY3Qua2V5cyh0aGlzLl9sb29rdXApKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmllbGQgPSB0aGlzLl9sb29rdXBbbmFtZV07XG4gICAgICAgICAgICAgICAgYXJyLnB1c2gocm93W2ZpZWxkXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgbmV3Um93ID0gdGhpcy5fY3JlYXRlRmx5Um93KGFycik7XG4gICAgICAgICAgICBuZXdSb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2socm93KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWxldGVQcmV2aWV3KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlucHV0X3ByZXZpZXcuYXBwZW5kQ2hpbGQobmV3Um93KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW5wdXRfcHJldmlldyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgO1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7SFRNTERpdkVsZW1lbnR9IGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAgICAgKi9cbiAgICBfY3JlYXRlRmx5V3JhcChlbGVtZW50KSB7XG4gICAgICAgIGlmICghZWxlbWVudClcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBsZXQgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBkaXYuY2xhc3NOYW1lID0gXCJwcmV2aWV3LWlucHV0XCI7XG4gICAgICAgIGRpdi5zdHlsZS5taW5XaWR0aCA9IHJlY3Qud2lkdGggKyBcInB4XCI7XG4gICAgICAgIGRpdi5zdHlsZS50b3AgPSArcmVjdC50b3AgKyByZWN0LmhlaWdodCArIFwicHhcIjtcbiAgICAgICAgZGl2LnN0eWxlLmxlZnQgPSArcmVjdC5sZWZ0ICsgXCJweFwiO1xuICAgICAgICBkaXYuc2V0QXR0cmlidXRlKFwiY3VyXCIsIFwiMFwiKTtcbiAgICAgICAgcmV0dXJuIGRpdjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHJldHVybiB7dHJ1ZX0gaWYgc3RyMSBsaWtlIHN0cjJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyMVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIyXG4gICAgICovXG4gICAgX2lzTGlrZShzdHIxLCBzdHIyKSB7XG4gICAgICAgIHN0cjEgPSBzdHIxLnRyaW0oKTtcbiAgICAgICAgc3RyMiA9IHN0cjIudHJpbSgpO1xuICAgICAgICBpZiAoc3RyMSA9PSBcIlwiIHx8IHN0cjIgPT0gXCJcIilcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgc3RyMSA9IHN0cjEubm9ybWFsaXplKCk7XG4gICAgICAgIHN0cjIgPSBzdHIyLm5vcm1hbGl6ZSgpO1xuICAgICAgICBzdHIxID0gc3RyMS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBzdHIyID0gc3RyMi50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBsZXQgcmVnID0gbmV3IFJlZ0V4cChgXi4qJHtzdHIyfS4qJGApO1xuICAgICAgICByZXR1cm4gc3RyMS5tYXRjaChyZWcpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJWYWx1ZXNcbiAgICAgKi9cbiAgICBfY3JlYXRlRmx5Um93KGFyclZhbHVlcykge1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyVmFsdWVzKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHJvdy5jbGFzc05hbWUgPSBcInByZXZpZXctcm93XCI7XG4gICAgICAgIGZvciAobGV0IHZhbHVlIG9mIGFyclZhbHVlcykge1xuICAgICAgICAgICAgbGV0IGNvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBjb2wuc3R5bGUubWFyZ2luID0gXCJhdXRvXCI7XG4gICAgICAgICAgICBjb2wudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHJvdy5hcHBlbmRDaGlsZChjb2wpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByb3c7XG4gICAgfVxuICAgIF9kZWxldGVQcmV2aWV3KCkge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnByZXZpZXctaW5wdXRcIikuZm9yRWFjaCgodmFsKSA9PiB7XG4gICAgICAgICAgICB2YWwucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IGlucHV0UHJldmlldzI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbnB1dFByZXZpZXcyLmpzLm1hcCIsImNvbnN0IHtEb25WaX0gPSByZXF1aXJlKCcuLi9hcHAvTW9kZWwvRG9uVmkvJyk7XG5jb25zdCB7Qm9vdHN0cmFwTW9kYWx9ID0gcmVxdWlyZSgnLi4vYXBwL01vZGVsL0Jvb3N0cmFwTW9kYWwnKTtcblxuY29uc3QgZG9udmkgPSBuZXcgRG9uVmkoKTtcblxuJChkb2N1bWVudCkucmVhZHkoYXN5bmMgKCk9PntcbiAgICBhc3luYyBmdW5jdGlvbiB1cGRhdGVUYWJsZSgpIHtcbiAgICAgICAgY29uc3QgdGFibGUgPSAkKFwiI25oYXBfZG9uX3ZpLS10YWJsZSB0Ym9keVwiKTtcbiAgICAgICAgdGFibGUuY2hpbGRyZW4oKS5yZW1vdmUoKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGRvbnZpLmdldCgpO1xuICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiBkYXRhKSB7XG4gICAgICAgICAgICBjb25zdCB0ciA9ICQoJzx0ci8+JykuaHRtbChgXG4gICAgICAgICAgICAgICAgPHRkPiR7cm93LmlkfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkPiR7cm93LnRlbn08L3RkPlxuICAgICAgICAgICAgYCk7XG4gICAgICAgICAgICB0YWJsZS5hcHBlbmQodHIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlVGFibGUoKTtcblxufSk7XG4iLCJjb25zdCB7SG9hRG9uRm9ybX0gPSByZXF1aXJlKCcuLi9hcHAvSG9hRG9uRm9ybScpO1xuY29uc3Qge1FMTlR9ID0gcmVxdWlyZSgnLi4vYXBwL0FwcCcpO1xuY29uc3Qge0Jvb3RzdHJhcE1vZGFsfSA9IHJlcXVpcmUoJy4uL2FwcC9Nb2RlbC9Cb29zdHJhcE1vZGFsJyk7XG5jb25zdCBDT05GSUcgPSByZXF1aXJlKCcuLi8uLi9jb25maWcnKTtcblxuY29uc3QgaG9hRG9uRm9ybSA9IG5ldyBIb2FEb25Gb3JtKCk7XG5jb25zdCBBcHAgPSBuZXcgUUxOVCgpO1xuY29uc3QgcG9wdXAgPSBuZXcgQm9vdHN0cmFwTW9kYWwoJ25oYXBfaG9hX2Rvbi0tcG9wdXAnKTtcblxuZnVuY3Rpb24gZGlzcGxheVRpbWUoKSB7XG4gICAgbGV0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgJChcIiN0aW1lLWRhdGVcIikudGV4dChub3cudG9Mb2NhbGVEYXRlU3RyaW5nKCkpO1xuICAgICQoXCIjdGltZS10aW1lXCIpLnRleHQobm93LnRvTG9jYWxlVGltZVN0cmluZygpKTtcbn1cblxuZnVuY3Rpb24gbG9vcFNob3dUaW1lKCkge1xuICAgIHNldEludGVydmFsKCgpPT57XG4gICAgICAgIGRpc3BsYXlUaW1lKCk7XG4gICAgfSwgMTAwMCk7XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlVc2VyKCkge1xuICAgIGxldCB1c2VybmFtZSA9IGhvYURvbkZvcm0uZ2V0VXNlcm5hbWUoKTtcbiAgICAkKFwiI25oYXBfaG9hX2Rvbi0tdXNlcm5hbWVcIikudGV4dCh1c2VybmFtZSk7XG59XG5cbmZ1bmN0aW9uIGZvY3VzVGVuVGh1b2NGaXJzdCgpIHtcbiAgICAkKFwiI25oYXBfaG9hX2Rvbi0tdGVuLXRodW9jXCIpLmZvY3VzKCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRvbmdHaWEoKSB7XG4gICAgbGV0IHRvbmcgPSAwO1xuICAgIGxldCBsaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmN0aGQtZ2lhJyk7XG4gICAgZm9yIChsZXQgdmFsIG9mIGxpc3QpIHtcbiAgICAgICAgbGV0IGdpYSA9IHBhcnNlSW50KHZhbC50ZXh0Q29udGVudC5yZXBsYWNlKC9cXEQvLCAnJykpO1xuICAgICAgICB0b25nICs9IGdpYTtcbiAgICB9XG4gICAgY29uc3QgdmFsID0gdG9uZy50b0xvY2FsZVN0cmluZygpKycgVk7EkCc7XG5cbiAgICAkKFwiI25oYXBfaG9hX2Rvbi0tc3VtXCIpLmF0dHIoJ2N1clZhbCcsIHZhbCk7XG4gICAgaWYgKCEkKCcja2lldS1saWV1JylbMF0uY2hlY2tlZCkgJCgnI25oYXBfaG9hX2Rvbi0tc3VtJykudmFsKHZhbCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRpZW5UaG9pKCkge1xuICAgIGxldCBzdW0gPSAkKFwiI25oYXBfaG9hX2Rvbi0tc3VtXCIpLnZhbCgpLnJlcGxhY2UoL1tcXERcXHNdL2csICcnKTtcbiAgICBsZXQgdGllbmtoID0gJChcIiNuaGFwX2hvYV9kb24tLXRpZW5raC10cmFcIikudmFsKCkucmVwbGFjZSgvW1xcRFxcc10vZywgJycpO1xuXG4gICAgbGV0IHRpZW5UaG9pID0gcGFyc2VJbnQodGllbmtoKSAtIHBhcnNlSW50KHN1bSk7XG4gICAgdGllblRob2kgPSB0aWVuVGhvaSA+PSAwID8gdGllblRob2kudG9Mb2NhbGVTdHJpbmcoKSA6ICd+bG9pJztcblxuICAgICQoXCIjbmhhcF9ob2FfZG9uLS10aG9pdGllblwiKS52YWwodGllblRob2kpO1xufVxuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICBsb29wU2hvd1RpbWUoKTtcbiAgICBkaXNwbGF5VXNlcigpO1xuICAgIGZvY3VzVGVuVGh1b2NGaXJzdCgpO1xuXG4gICAgQXBwLmFkZFNlbGVjdElucHV0KCQoJ1tjb21wb25lbnQ9XCJEb25WaVwiXScpLCB7XG4gICAgICAgIHRpdGxlOiAndGVuJyxcbiAgICAgICAgdmFsdWU6ICdpZCcsXG4gICAgfSk7XG5cbiAgICBBcHAub25VcGRhdGVBbGwoKTtcblxuICAgICQoJyNuaGFwX2hvYV9kb24tLXRpZW5raC10cmEnKS5tb25leUlucHV0KCkub24oJ2tleXVwJywgKCk9PntcbiAgICAgICAgdXBkYXRlVGllblRob2koKTtcbiAgICB9KTtcblxuICAgICQoJyNuaGFwX2hvYV9kb24tLWhvYWRvbi1mb3JtJykuc3VibWl0KChlKT0+e1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgaG9hRG9uRm9ybS5wdXNoVG9EYXRhYmFzZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoJyNuaGFwX2hvYV9kb24tLWhvYWRvbi1mb3JtJykuZmluZCgnaW5wdXQsIHNlbGVjdCcpLnZhbCgnJyk7XG4gICAgICAgICAgICAkKCcjbmhhcF9ob2FfZG9uLS1mb3JtLW5oYXAnKS5maW5kKCdpbnB1dCwgc2VsZWN0JykudmFsKCcnKTtcbiAgICAgICAgICAgIGhvYURvbkZvcm0ubmV3SG9hRG9uKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhob2FEb25Gb3JtKTtcbiAgICAgICAgICAgIHBvcHVwLnNob3coJ09LJywgJycpO1xuICAgICAgICB9LCAoZXJyKT0+e1xuICAgICAgICAgICAgcG9wdXAuc2hvdygnRXJyb3InLCBlcnIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgQXBwLmFkZE5hbWVJbnB1dFRodW9jKFwibmhhcF9ob2FfZG9uLS10ZW5fdGh1b2NcIiwge1xuICAgICAgICBcIm5oYXBfaG9hX2Rvbi0tbWFfdGh1b2NcIjogXCJtYVwiLFxuICAgICAgICBcIm5oYXBfaG9hX2Rvbi0tdGVuX3RodW9jXCI6IFwidGVuXCIsXG4gICAgICAgIFwibmhhcF9ob2FfZG9uLS1kb25fdmlcIjogXCJkb25fdmlcIixcbiAgICAgICAgXCJuaGFwX2hvYV9kb24tLWNvc3RcIjogXCJkb25fZ2lhXCIsXG4gICAgfSwge1xuICAgICAgICBcIm5oYXBfaG9hX2Rvbi0tdGVuX3RodW9jXCI6IFwidGVuXCIsXG4gICAgICAgIFwibmhhcF9ob2FfZG9uLS1tYV90aHVvY1wiOiBcIm1hXCIsXG4gICAgICAgIFwibmhhcF9ob2FfZG9uLS1kb25fdmlcIjogXCJkb25fdmlcIixcbiAgICAgICAgXCJuaGFwX2hvYV9kb24tLWNvc3RcIjogXCJkb25fZ2lhXCIsXG4gICAgfSk7XG5cbiAgICAkKFwiI25oYXBfaG9hX2Rvbi0tZm9ybS1uaGFwXCIpLm9uKCdzdWJtaXQnLCAoZSk9PntcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAkKFwiI25oYXBfaG9hX2Rvbi0tZm9ybS1uaGFwXCIpLmZpbmQoJ2lucHV0LCBzZWxlY3QnKS52YWwoJycpO1xuICAgICAgICB1cGRhdGVUb25nR2lhKCk7XG4gICAgfSk7XG5cbiAgICAkKFwiI2tpZXUtbGlldVwiKS5jbGljaygoKSA9PiB7XG4gICAgICAgICQoJyNuaGFwX2hvYV9kb24tLXN1bScpLnZhbChDT05GSUcuR0lBX0JBTl9USEVPX0xJRVUpO1xuICAgIH0pO1xuICAgICQoJyNraWV1LWJhbmxlJykuY2xpY2soKCkgPT4ge1xuICAgICAgICBjb25zdCBzdW0gPSAkKCcjc3VtJyk7XG4gICAgICAgIGNvbnN0IHZhbCA9IHN1bS5hdHRyKCdjdXJWYWwnKTtcbiAgICAgICAgc3VtLnZhbCh2YWwpO1xuICAgIH0pO1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG59KTtcbiIsImNvbnN0IHtOc3h9ID0gcmVxdWlyZSgnLi4vYXBwL01vZGVsL05zeCcpO1xuXG4kKGRvY3VtZW50KS5yZWFkeSgoKT0+e1xuICAgIGNvbnN0IHBvcHVwID0gbmV3IFN0YXR1c1BvcHVwKCk7XG4gICAgY29uc3QgbnN4ID0gbmV3IE5zeCgpO1xuXG4gICAgcG9wdXAuY3JlYXRlKCk7XG4gICAgdXBkYXRlTlNYKCk7XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVUYWJsZVJvdyh2YWwpIHtcbiAgICAgICAgbGV0IHJvdyA9ICQoXCI8dHIvPlwiKTtcbiAgICAgICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKHZhbCkpIHtcbiAgICAgICAgICAgIHJvdy5hcHBlbmQoJCgnPHRkLz4nKS50ZXh0KHZhbFtrZXldKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvdztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVOU1goKSB7XG4gICAgICAgICQoJyN0YWJsZS1ib2R5JykuY2hpbGRyZW4oKS5yZW1vdmUoKTtcbiAgICAgICAgbnN4LmdldCgoZXJyLCBkYXRhKT0+e1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgcm93IG9mIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAkKFwiI3RhYmxlLWJvZHlcIikuYXBwZW5kKGNyZWF0ZVRhYmxlUm93KHJvdykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgZGF0YSByZXF1ZXN0XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGxldCBkYXRhID0gZS5kYXRhO1xuICAgICAgICBpZiAoZGF0YS5tc2cgPT0gJ3VwZGF0ZScpIHtcbiAgICAgICAgICAgIHVwZGF0ZU5TWCgpO1xuICAgICAgICB9XG4gICAgfSk7XG59KTtcbiIsImNvbnN0IHtUaHVvYywgQmFuZ1RodW9jfSA9IHJlcXVpcmUoJy4uL2FwcC9Nb2RlbC9UaHVvYycpO1xuY29uc3QgdGh1b2MgPSBuZXcgVGh1b2MoKTtcbmNvbnN0IGJhbmdUaHVvYyA9IG5ldyBCYW5nVGh1b2MoKTtcblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgYXN5bmMgZnVuY3Rpb24gdXBkYXRlVGFibGUoKSB7XG4gICAgICAgIGNvbnN0IHRhYmxlID0gJChcIiNuaGFwX3RodW9jLS10YWJsZSB0Ym9keVwiKTtcbiAgICAgICAgdGFibGUuY2hpbGRyZW4oKS5yZW1vdmUoKTtcbiAgICAgICAgYXdhaXQgYmFuZ1RodW9jLnVwZGF0ZSgpO1xuICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiBiYW5nVGh1b2MubGlzdCkge1xuICAgICAgICAgICAgY29uc3QgcHJpY2VTdHJpbmcgPSAoK3Jvdy5kb25fZ2lhKS50b0xvY2FsZVN0cmluZygpO1xuICAgICAgICAgICAgY29uc3QgdHIgPSAkKCc8dHIvPicpLmh0bWwoYFxuICAgICAgICAgICAgICAgIDx0ZD4ke3Jvdy5tYX08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZD4ke3Jvdy50ZW59PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQ+JHtyb3cudGVuX25zeH08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZD4ke3ByaWNlU3RyaW5nfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkPiR7cm93LnNvX2x1b25nfTwvdGQ+XG4gICAgICAgICAgICBgKTtcbiAgICAgICAgICAgIHRhYmxlLmFwcGVuZCh0cik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAkKFwiI25oYXBfdGh1b2MtLWZvcm1cIikub24oXCJzdWJtaXRcIiwgZnVuY3Rpb24gTmhhcFRodW9jRm9ybVN1Ym1pdChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IHt9O1xuICAgICAgICAkKHRoaXMpLnNlcmlhbGl6ZUFycmF5KCkuZm9yRWFjaCgodmFsKT0+e1xuICAgICAgICAgICAgZGF0YVt2YWwubmFtZV0gPSB2YWwudmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgICB0aHVvYy5jcmVhdGUoZGF0YSwgKGVycik9PntcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdXBkYXRlVGFibGUoKTtcbn0pO1xuIl19
