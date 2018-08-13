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
        const valueKey = opt.value;
        const titleKey = opt.title;
        const compoName = element.getAttribute('component');
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
                const newOpt = document.createElement("option");
                newOpt.value = row[valueKey];
                newOpt.textContent = row[titleKey];
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
            let cur = +this._preview_div.getAttribute("cur");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb25maWcvaW5kZXguanMiLCJzcmMvYXBwL0FwcC5qcyIsInNyYy9hcHAvQ1RIb2FEb24uanMiLCJzcmMvYXBwL0NvbnRyb2xsZXIuanMiLCJzcmMvYXBwL0hvYURvbkZvcm0uanMiLCJzcmMvYXBwL01vZGVsL0Jvb3N0cmFwTW9kYWwvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL0RvblZpL2luZGV4LmpzIiwic3JjL2FwcC9Nb2RlbC9Nb2RlbENsYXNzL2luZGV4LmpzIiwic3JjL2FwcC9Nb2RlbC9Oc3gvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL1RhYmxlRGF0YS9pbmRleC5qcyIsInNyYy9hcHAvTW9kZWwvVGh1b2MvQmFuZ1RodW9jLmpzIiwic3JjL2FwcC9Nb2RlbC9UaHVvYy9pbmRleC5qcyIsInNyYy9hcHAvaW5wdXRQcmV2aWV3Mi5qcyIsInNyYy9zY3JpcHQvbmhhcC1kb24tdmkuanMiLCJzcmMvc2NyaXB0L25oYXAtaG9hLWRvbi5qcyIsInNyYy9zY3JpcHQvbmhhcC1uc3guanMiLCJzcmMvc2NyaXB0L25oYXAtdGh1b2MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgXCJHSUFfQkFOX1RIRU9fTElFVVwiOiA4MDAwLFxyXG59O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBDb250cm9sbGVyXzEgPSByZXF1aXJlKFwiLi9Db250cm9sbGVyXCIpO1xyXG5jb25zdCBpbnB1dFByZXZpZXcyXzEgPSByZXF1aXJlKFwiLi9pbnB1dFByZXZpZXcyXCIpO1xyXG5jb25zdCBfUUxOVCA9IGNsYXNzIGV4dGVuZHMgQ29udHJvbGxlcl8xLkNvbnRyb2xsZXIge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmFkZE1vZGVsKCdEb25WaScsICdEb25WaScpO1xyXG4gICAgICAgIHRoaXMuYWRkTW9kZWwoJ1RodW9jJywgJ1RodW9jJyk7XHJcbiAgICAgICAgdGhpcy5hZGRNb2RlbCgnTnN4JywgJ05zeCcpO1xyXG4gICAgfVxyXG4gICAgYWRkVGFibGUoZWxlbWVudCkge1xyXG4gICAgICAgIGxldCBuYW1lVEhzID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwidGhcIik7XHJcbiAgICAgICAgbGV0IGNvbXBvTmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjb21wb25lbnQnKTtcclxuICAgICAgICBjb25zdCBsb29rTmFtZSA9IEFycmF5LmZyb20obmFtZVRIcykubWFwKCh2YWwpID0+IHZhbC5nZXRBdHRyaWJ1dGUoJ2ZvcicpKTtcclxuICAgICAgICBjb25zdCB1cGRhdGVUYWJsZSA9IGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGVycilcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgbGV0IGJvZHkgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3Rib2R5Jyk7XHJcbiAgICAgICAgICAgIC8vIGRlbGV0ZSBvbGQgcm93XHJcbiAgICAgICAgICAgIHdoaWxlIChib2R5Lmxhc3RDaGlsZClcclxuICAgICAgICAgICAgICAgIGJvZHkucmVtb3ZlQ2hpbGQoYm9keS5sYXN0Q2hpbGQpO1xyXG4gICAgICAgICAgICAvLyB1cGRhdGEgbmV3IHJvd1xyXG4gICAgICAgICAgICBmb3IgKGxldCByb3cgb2YgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJvd0VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IG5hbWUgb2YgbG9va05hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3VEQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld1RELnRleHRDb250ZW50ID0gcm93W25hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgIHJvd0VsLmFwcGVuZENoaWxkKG5ld1REKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJvZHkuYXBwZW5kQ2hpbGQocm93RWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmFkZFVwZGF0ZUZ1bmMoY29tcG9OYW1lLCB1cGRhdGVUYWJsZSk7XHJcbiAgICB9XHJcbiAgICBhZGROYW1lSW5wdXRUaHVvYyhpZEVsZW1lbnQsIG9wdExpc3Rlbiwgb3B0Q2hhbmdlKSB7XHJcbiAgICAgICAgY29uc3QgcHJldmlldyA9IG5ldyBpbnB1dFByZXZpZXcyXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIHByZXZpZXcuYWRkTG9va3VwKG9wdExpc3Rlbik7XHJcbiAgICAgICAgcHJldmlldy5saXN0ZW4oaWRFbGVtZW50LCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpZEVsIGluIG9wdENoYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFvcHRDaGFuZ2UuaGFzT3duUHJvcGVydHkoaWRFbCkpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAkKCcjJyArIGlkRWwpLnZhbChkYXRhW29wdENoYW5nZVtpZEVsXV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3Qgb25VcGRhdGUgPSBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJldmlldy5hZGREYXRhKGRhdGEpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5hZGRVcGRhdGVGdW5jKCdUaHVvYycsIG9uVXBkYXRlKTtcclxuICAgIH1cclxuICAgIGFkZFNlbGVjdElucHV0KGVsZW1lbnQsIG9wdCkge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlS2V5ID0gb3B0LnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHRpdGxlS2V5ID0gb3B0LnRpdGxlO1xyXG4gICAgICAgIGNvbnN0IGNvbXBvTmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjb21wb25lbnQnKTtcclxuICAgICAgICBjb25zdCBvblVwZGF0ZSA9IGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyByZW1vdmUgb2xkIG9wdGlvbnNcclxuICAgICAgICAgICAgd2hpbGUgKGVsZW1lbnQubGFzdENoaWxkKVxyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDaGlsZChlbGVtZW50Lmxhc3RDaGlsZCk7XHJcbiAgICAgICAgICAgIC8vIGFkZCB1cGRhdGVkIG9wdGlvblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdPcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICAgICAgICAgICAgbmV3T3B0LnZhbHVlID0gcm93W3ZhbHVlS2V5XTtcclxuICAgICAgICAgICAgICAgIG5ld09wdC50ZXh0Q29udGVudCA9IHJvd1t0aXRsZUtleV07XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKG5ld09wdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuYWRkVXBkYXRlRnVuYyhjb21wb05hbWUsIG9uVXBkYXRlKTtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5RTE5UID0gX1FMTlQ7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUFwcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBfQ1RIb2FEb24gPSBjbGFzcyB7XHJcbiAgICBjb25zdHJ1Y3RvcihtYSA9IC0xLCB0ZW4gPSBcIlwiLCBkb252aSA9IC0xLCBzbCA9IDAsIHRoYW5odGllbiA9IDApIHtcclxuICAgICAgICB0aGlzLm1hID0gbWE7XHJcbiAgICAgICAgdGhpcy50ZW4gPSB0ZW47XHJcbiAgICAgICAgdGhpcy5kb252aSA9IGRvbnZpO1xyXG4gICAgICAgIHRoaXMuc2wgPSBzbDtcclxuICAgICAgICB0aGlzLnRoYW5odGllbiA9IHRoYW5odGllbjtcclxuICAgICAgICB0aGlzLl9jaGlsZEVsZW1lbnQgPSB7fTtcclxuICAgICAgICB0aGlzLl9lbGVtZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNyZWF0ZUVsZW1lbnQoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUFsbFZhbHVlKG1hLCB0ZW4sIGRvbnZpLCBzbCwgdGhhbmh0aWVuKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogY3JlYXRlIHJvdyBlbGVtZW50IGZvciB0YWJsZVxyXG4gICAgICovXHJcbiAgICBjcmVhdGVFbGVtZW50KCkge1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xyXG4gICAgICAgIGNvbnN0IG1hVEQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG4gICAgICAgIGNvbnN0IHRlblREID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcclxuICAgICAgICBjb25zdCBkb252aVREID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcclxuICAgICAgICBjb25zdCBzbFREID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcclxuICAgICAgICBjb25zdCB0aWVuVEQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG4gICAgICAgIG1hVEQuY2xhc3NMaXN0LmFkZCgnY3RoZC1tdGh1b2MnKTtcclxuICAgICAgICB0ZW5URC5jbGFzc0xpc3QuYWRkKCdjdGhkLXR0aHVvYycpO1xyXG4gICAgICAgIGRvbnZpVEQuY2xhc3NMaXN0LmFkZCgnY3RoZC1kb252aScpO1xyXG4gICAgICAgIHNsVEQuY2xhc3NMaXN0LmFkZCgnY3RoZC1zbCcpO1xyXG4gICAgICAgIHRpZW5URC5jbGFzc0xpc3QuYWRkKCdjdGhkLWdpYScpO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQobWFURCk7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZCh0ZW5URCk7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZChkb252aVREKTtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LmFwcGVuZENoaWxkKHNsVEQpO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGllblREKTtcclxuICAgICAgICB0aGlzLl9jaGlsZEVsZW1lbnQgPSB7XHJcbiAgICAgICAgICAgIFwibWFfdGh1b2NcIjogbWFURCxcclxuICAgICAgICAgICAgXCJ0ZW5fdGh1b2NcIjogdGVuVEQsXHJcbiAgICAgICAgICAgIFwiZG9uX3ZpXCI6IGRvbnZpVEQsXHJcbiAgICAgICAgICAgIFwic29fbHVvbmdcIjogc2xURCxcclxuICAgICAgICAgICAgXCJ0aGFuaHRpZW5cIjogdGllblREXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGdldFJvd0VsZW1lbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2VsZW1lbnQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLl9lbGVtZW50LnBhcmVudE5vZGU7XHJcbiAgICAgICAgaWYgKHBhcmVudClcclxuICAgICAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMuX2VsZW1lbnQpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBnZXQganNvbiBkYXRhIGZvciBwb3N0IGZvcm1cclxuICAgICAqL1xyXG4gICAgZ2V0RGF0YUpTT04oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgJ21hX3RodW9jJzogdGhpcy5tYSxcclxuICAgICAgICAgICAgJ3Rlbl90aHVvYyc6IHRoaXMudGVuLFxyXG4gICAgICAgICAgICAnZG9uX3ZpJzogdGhpcy5kb252aSxcclxuICAgICAgICAgICAgJ3NvX2x1b25nJzogdGhpcy5zbFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbWFcclxuICAgICAqIEBwYXJhbSB0ZW5cclxuICAgICAqIEBwYXJhbSBkb252aVxyXG4gICAgICogQHBhcmFtIHNsXHJcbiAgICAgKiBAcGFyYW0gdGhhbmh0aWVuXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZUFsbFZhbHVlKG1hLCB0ZW4sIGRvbnZpLCBzbCwgdGhhbmh0aWVuKSB7XHJcbiAgICAgICAgdGhpcy5tYSA9IG1hO1xyXG4gICAgICAgIHRoaXMudGVuID0gdGVuO1xyXG4gICAgICAgIHRoaXMuZG9udmkgPSBkb252aTtcclxuICAgICAgICB0aGlzLnNsID0gc2w7XHJcbiAgICAgICAgdGhpcy50aGFuaHRpZW4gPSB0aGFuaHRpZW47XHJcbiAgICAgICAgdGhpcy5fY2hpbGRFbGVtZW50WydtYV90aHVvYyddLnRleHRDb250ZW50ID0gbWEgKyBcIlwiO1xyXG4gICAgICAgIHRoaXMuX2NoaWxkRWxlbWVudFsndGVuX3RodW9jJ10udGV4dENvbnRlbnQgPSB0ZW4gKyBcIlwiO1xyXG4gICAgICAgIHRoaXMuX2NoaWxkRWxlbWVudFsnZG9uX3ZpJ10udGV4dENvbnRlbnQgPSBkb252aSArIFwiXCI7XHJcbiAgICAgICAgdGhpcy5fY2hpbGRFbGVtZW50Wydzb19sdW9uZyddLnRleHRDb250ZW50ID0gc2wgKyBcIlwiO1xyXG4gICAgICAgIHRoaXMuX2NoaWxkRWxlbWVudFsndGhhbmh0aWVuJ10udGV4dENvbnRlbnQgPSB0aGFuaHRpZW4gKyBcIlwiO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlVmFsdWUobmFtZSwgdmFsdWUpIHtcclxuICAgICAgICBzd2l0Y2ggKG5hbWUpIHtcclxuICAgICAgICAgICAgY2FzZSBcIm1hX3RodW9jXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInRlbl90aHVvY1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy50ZW4gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiZG9uX3ZpXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRvbnZpID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInNvX2x1b25nXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNsID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInRoYW5oX3RpZW5cIjpcclxuICAgICAgICAgICAgICAgIHRoaXMudGhhbmh0aWVuID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY2hpbGRFbGVtZW50W25hbWVdLnRleHRDb250ZW50ID0gdmFsdWU7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMuQ1RIb2FEb24gPSBfQ1RIb2FEb247XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNUSG9hRG9uLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IERvblZpXzEgPSByZXF1aXJlKFwiLi9Nb2RlbC9Eb25WaVwiKTtcclxuY29uc3QgVGh1b2NfMSA9IHJlcXVpcmUoXCIuL01vZGVsL1RodW9jXCIpO1xyXG5jb25zdCBOc3hfMSA9IHJlcXVpcmUoXCIuL01vZGVsL05zeFwiKTtcclxuY29uc3QgX0NvbnRyb2xsZXIgPSBjbGFzcyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLl9jb21wb25lbnRMaXN0ID0ge307XHJcbiAgICAgICAgdGhpcy5fZXZlbnQgPSB7fTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgbmFtZSBvZiBtb2RlbFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVuYW1lIHR5cGUgb2YgbW9kZWwgKERvblZpIHwgVGh1b2MgfCBOc3gpXHJcbiAgICAgKi9cclxuICAgIGFkZE1vZGVsKG5hbWUsIHR5cGVuYW1lKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NvbXBvbmVudExpc3QuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IobmFtZSArIFwiIGlzIGV4aXN0aW5nIG1vZGVsXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbmV3T2JqID0gbnVsbDtcclxuICAgICAgICBzd2l0Y2ggKHR5cGVuYW1lKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEb25WaVwiOlxyXG4gICAgICAgICAgICAgICAgbmV3T2JqID0gbmV3IERvblZpXzEuRG9uVmkoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiVGh1b2NcIjpcclxuICAgICAgICAgICAgICAgIG5ld09iaiA9IG5ldyBUaHVvY18xLlRodW9jKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIk5zeFwiOlxyXG4gICAgICAgICAgICAgICAgbmV3T2JqID0gbmV3IE5zeF8xLk5zeCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwidW5rbm93biB0eXBlbmFtZTogXCIgKyB0eXBlbmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50TGlzdFtuYW1lXSA9IG5ld09iajtcclxuICAgICAgICB0aGlzLl9ldmVudFtuYW1lXSA9IFtdO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY29tcG9OYW1lIGNvbXBvbmVudCBuYW1lXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIGNhbGxiYWNrIGZ1bmN0aW9uXHJcbiAgICAgKiBAcmV0dXJuIHsoZXJyLCBkYXRhKT0+e319XHJcbiAgICAgKi9cclxuICAgIGFkZFVwZGF0ZUZ1bmMoY29tcG9OYW1lLCBmdW5jID0gKGVyciwgZGF0YSkgPT4geyB9KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9ldmVudC5oYXNPd25Qcm9wZXJ0eShjb21wb05hbWUpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm90IGZvdW5kIFwiICsgY29tcG9OYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZXZlbnRbY29tcG9OYW1lXS5wdXNoKGZ1bmMpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiB1cGRhdGUgYWxsIG1vZGVsIGFuZCBjYWxsIGNhbGxiYWNrIGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uVXBkYXRlQWxsKCkge1xyXG4gICAgICAgIGZvciAoY29uc3QgY29tcG9OYW1lIG9mIE9iamVjdC5rZXlzKHRoaXMuX2NvbXBvbmVudExpc3QpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLl9jb21wb25lbnRMaXN0W2NvbXBvTmFtZV0uZ2V0KGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZnVuYyBvZiB0aGF0Ll9ldmVudFtjb21wb05hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuYyhlcnIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMuQ29udHJvbGxlciA9IF9Db250cm9sbGVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Db250cm9sbGVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IENUSG9hRG9uXzEgPSByZXF1aXJlKFwiLi9DVEhvYURvblwiKTtcclxuLy8gaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcclxuLyoqXHJcbiAqIEjDs2EgxJDGoW4gRm9ybVxyXG4gKi9cclxuY29uc3QgX0hvYURvbkZvcm0gPSBjbGFzcyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLl9kYXRhYmFzZSA9IFwiL3B1YmxpYy9hcGkvaG9hX2Rvbi9cIjtcclxuICAgICAgICBjb25zdCBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaCgvdXNlcm5hbWU9KFxcdyspLyk7XHJcbiAgICAgICAgdGhpcy5fdXNlcm5hbWUgPSBtYXRjaCA/IG1hdGNoWzFdIDogXCJOb3QgRm91bmRcIjtcclxuICAgICAgICB0aGlzLl9saXN0Q1RIRCA9IHt9OyAvL09iamVjdCBiZWNhdXNlIGRhdGEgaGFzIGtleSAnbWFfdGh1b2MnXHJcbiAgICAgICAgdGhpcy5faGVhZGVyRm9ybSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLl9DVEhEVGFibGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5fZ2hpQ2h1ID0gXCJcIjtcclxuICAgIH1cclxuICAgIHNldEhlYWRlcihlbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5faGVhZGVyRm9ybSA9IGVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5faGVhZGVyRm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGlmICghZS50YXJnZXQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGFBcnIgPSAkKGUudGFyZ2V0KS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhT2JqID0ge307XHJcbiAgICAgICAgICAgIGRhdGFBcnIuZm9yRWFjaCgodmFsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkYXRhT2JqW3ZhbC5uYW1lXSA9IHZhbC52YWx1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ1RIRCgrZGF0YU9ialsnbWFfdGh1b2MnXSwgZGF0YU9ialsndGVuX3RodW9jJ10sICtkYXRhT2JqWydzb19sdW9uZyddLCArZGF0YU9ialsnZG9uX3ZpJ10sICtkYXRhT2JqWydjb3N0J10pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc2V0VGFibGUoZWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMuX0NUSERUYWJsZSA9IGVsZW1lbnQ7XHJcbiAgICB9XHJcbiAgICBnZXRVc2VybmFtZSgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLl91c2VybmFtZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VzZXJuYW1lO1xyXG4gICAgfVxyXG4gICAgbmV3SG9hRG9uKCkge1xyXG4gICAgICAgIGZvciAobGV0IGVsIGluIHRoaXMuX2xpc3RDVEhEKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xpc3RDVEhEW2VsXS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGdldCB0b3RhbCBjYXNoIG9mIDEgSG9hRG9uXHJcbiAgICAgKi9cclxuICAgIGdldFRvdGFsQ2FzaCgpIHtcclxuICAgICAgICBsZXQgc3VtID0gMDtcclxuICAgICAgICBmb3IgKGNvbnN0IG1hX3RodW9jIG9mIEFycmF5LmZyb20oT2JqZWN0LmtleXModGhpcy5fbGlzdENUSEQpKSkge1xyXG4gICAgICAgICAgICBjb25zdCBjdGhkID0gdGhpcy5fbGlzdENUSERbbWFfdGh1b2NdO1xyXG4gICAgICAgICAgICBzdW0gKz0gY3RoZC50b3RhbENhc2g7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdW07XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWFfdGh1b2NcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzb2x1b25nXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZG9udmlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbENhc2hcclxuICAgICAqL1xyXG4gICAgYWRkQ1RIRChtYV90aHVvYywgdGVuX3RodW9jLCBzb2x1b25nLCBkb252aSwgdG90YWxDYXNoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2xpc3RDVEhELmhhc093blByb3BlcnR5KG1hX3RodW9jKSkge1xyXG4gICAgICAgICAgICBjb25zdCBuZXdTbCA9IHRoaXMuX2xpc3RDVEhEW21hX3RodW9jXS5zbCArIHNvbHVvbmc7XHJcbiAgICAgICAgICAgIHRoaXMuX2xpc3RDVEhELm1hX3RodW9jLnVwZGF0ZVZhbHVlKCdzb19sdW9uZycsIG5ld1NsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld0NUSEQgPSBuZXcgQ1RIb2FEb25fMS5DVEhvYURvbihtYV90aHVvYywgdGVuX3RodW9jLCBkb252aSwgc29sdW9uZywgdG90YWxDYXNoICogc29sdW9uZyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2xpc3RDVEhEW21hX3RodW9jXSA9IG5ld0NUSEQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHJvd0VsZW1lbnQgPSBuZXdDVEhELmdldFJvd0VsZW1lbnQoKTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9DVEhEVGFibGUgfHwgIXJvd0VsZW1lbnQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuX0NUSERUYWJsZS50Qm9kaWVzWzBdLmluc2VydEJlZm9yZShyb3dFbGVtZW50LCB0aGlzLl9DVEhEVGFibGUudEJvZGllc1swXS5jaGlsZE5vZGVzWzBdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHB1c2hUb0RhdGFiYXNlKHN1Y2Nlc3NDYWxsYmFjaywgZXJyb3JDYWxsYmFjaykge1xyXG4gICAgICAgIGNvbnN0IGhvYURvbkluZm8gPSB7XHJcbiAgICAgICAgICAgIHVzZXJuYW1lOiB0aGlzLl91c2VybmFtZSxcclxuICAgICAgICAgICAgdGltZTogKG5ldyBEYXRlKCkpLmdldFRpbWUoKSxcclxuICAgICAgICAgICAgZ2hpY2h1OiB0aGlzLl9naGlDaHVcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIGhvYV9kb246IGhvYURvbkluZm8sXHJcbiAgICAgICAgICAgIGN0aGQ6IHRoaXMuX2xpc3RDVEhEXHJcbiAgICAgICAgfTtcclxuICAgICAgICAkLmFqYXgodGhpcy5fZGF0YWJhc2UsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHhockZpZWxkczoge1xyXG4gICAgICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRhdGE6IFwiZGF0YT1cIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChqc29uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoISFqc29uLmVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yQ2FsbGJhY2soanNvbi5tc2cpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3NDYWxsYmFjaygpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JDYWxsYmFjayhlcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMuSG9hRG9uRm9ybSA9IF9Ib2FEb25Gb3JtO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Ib2FEb25Gb3JtLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNsYXNzIEJvb3RzdHJhcE1vZGFsIHtcclxuICAgIGNvbnN0cnVjdG9yKGlkKSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSB0aGlzLl9jcmVhdGVNb2RhbChpZCk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLl9lbGVtZW50WzBdKTtcclxuICAgIH1cclxuICAgIHNldFRpdGxlKHRleHQpIHtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LmZpbmQoJy5tb2RhbC10aXRsZScpLnRleHQodGV4dCk7XHJcbiAgICB9XHJcbiAgICBzZXRDb250ZW50KGh0bWwpIHtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LmZpbmQoJy5tb2RhbC1ib2R5JykuaHRtbChodG1sKTtcclxuICAgIH1cclxuICAgIHNob3codGl0bGUsIGNvbnRlbnQpIHtcclxuICAgICAgICB0aGlzLnNldFRpdGxlKHRpdGxlKTtcclxuICAgICAgICB0aGlzLnNldENvbnRlbnQoY29udGVudCk7XHJcbiAgICAgICAgdGhpcy5vcGVuKCk7XHJcbiAgICB9XHJcbiAgICBvcGVuKCkge1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQubW9kYWwoJ3Nob3cnKTtcclxuICAgIH1cclxuICAgIGNsb3NlKCkge1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQubW9kYWwoJ2hpZGUnKTtcclxuICAgIH1cclxuICAgIF9jcmVhdGVNb2RhbChpZCkge1xyXG4gICAgICAgIGNvbnN0IGRpdiA9ICQoXCI8ZGl2Lz5cIik7XHJcbiAgICAgICAgZGl2LmF0dHIoJ2lkJywgaWQpO1xyXG4gICAgICAgIGRpdi5hZGRDbGFzcygnbW9kYWwgZmFkZScpLmRhdGEoJ3RvZ2dsZScsICdtb2RhbCcpO1xyXG4gICAgICAgIGRpdi5odG1sKGBcclxuICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1kaWFsb2cgbW9kYWwtbGcgbW9kYWwtY2VudGVyJz5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz0nbW9kYWwtY29udGVudCc+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1oZWFkZXInPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J21vZGFsLXRpdGxlJz48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdjbG9zZScgZGF0YS1kaXNtaXNzPSdtb2RhbCc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPSdmYSBmYS10aW1lcyc+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1ib2R5Jz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0nbW9kYWwtZm9vdGVyJz5cclxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPSdidG4gYnRuLXNlY29uZGFyeScgZGF0YS1kaXNtaXNzPSdtb2RhbCc+Q2xvc2U8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPSdidG4gYnRuLXByaW1hcnknPk9LPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYCk7XHJcbiAgICAgICAgcmV0dXJuIGRpdjtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkJvb3RzdHJhcE1vZGFsID0gQm9vdHN0cmFwTW9kYWw7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IE1vZGVsQ2xhc3NfMSA9IHJlcXVpcmUoXCIuLi9Nb2RlbENsYXNzXCIpO1xyXG5jbGFzcyBfRG9uVmkgZXh0ZW5kcyBNb2RlbENsYXNzXzEuTW9kZWwge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9kYXRhYmFzZSA9IFwiL2FwaS9kb25fdmkvXCI7XHJcbiAgICAgICAgdGhpcy5fZmV0Y2hEYXRhID0gbnVsbDtcclxuICAgIH1cclxuICAgIGdldChjYWxsYmFjayA9IChlcnIsIGRhdGEpID0+IHsgfSkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgdGhpcy5fZ2V0KHt9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZldGNoRGF0YSA9IHRoaXMuX2ZpbHRlcihkYXRhKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlLCB0aGlzLl9mZXRjaERhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZldGNoRGF0YTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBfZmlsdGVyKHJhd0RhdGEpIHtcclxuICAgICAgICBsZXQgbmV3RGF0YSA9IHJhd0RhdGEuc2xpY2UoKTtcclxuICAgICAgICBsZXQgbWFwID0ge307XHJcbiAgICAgICAgZm9yIChsZXQgcm93IG9mIG5ld0RhdGEpIHtcclxuICAgICAgICAgICAgbGV0IGhlc28gPSByb3dbJ2hlX3NvX3F1eWRvaSddO1xyXG4gICAgICAgICAgICBtYXBbcm93WydpZCddXSA9IHJvdztcclxuICAgICAgICAgICAgcm93Wyd0ZXh0UXV5RG9pJ10gPSBoZXNvID8gXCJcIiA6IFwixJHGoW4gduG7iyBjxqEgYuG6o25cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgcm93IG9mIG5ld0RhdGEpIHtcclxuICAgICAgICAgICAgbGV0IGlkX2NvX2JhbiA9IHJvd1snaWRfcXV5X2RvaSddO1xyXG4gICAgICAgICAgICBsZXQgaGVzbyA9ICtyb3dbJ2hlX3NvX3F1eWRvaSddO1xyXG4gICAgICAgICAgICB3aGlsZSAobWFwLmhhc093blByb3BlcnR5KGlkX2NvX2JhbikpIHtcclxuICAgICAgICAgICAgICAgIHJvd1sndGV4dFF1eURvaSddICs9IGA9JHtoZXNvfXhbJHttYXBbaWRfY29fYmFuXVsndGVuJ119XWA7XHJcbiAgICAgICAgICAgICAgICBoZXNvICo9ICttYXBbaWRfY29fYmFuXVsnaGVfc29fcXV5ZG9pJ107XHJcbiAgICAgICAgICAgICAgICBpZF9jb19iYW4gPSBtYXBbaWRfY29fYmFuXVsnaWRfcXV5X2RvaSddO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXdEYXRhO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuRG9uVmkgPSBfRG9uVmk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNsYXNzIF9Nb2RlbCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLl9kYXRhYmFzZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5fZGF0YSA9IFtdO1xyXG4gICAgfVxyXG4gICAgZ2V0IGRhdGEoKSB7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX2RhdGEpO1xyXG4gICAgfVxyXG4gICAgZ2V0IHJlc3BvbnNlKCkge1xyXG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9yZXMpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBmZXRjaCBkYXRhIGZyb20gZGF0YWJhc2UgYW5kIGRvIHRoaW5nXHJcbiAgICAgKiBAcGFyYW0gcGFyYW1zXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgY2FsbGJhY2sgZnVuY3Rpb25cclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIF9nZXQocGFyYW1zLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RhdGEgPSBbXTtcclxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdFVSTCA9IHRoaXMuX2RhdGFiYXNlICsgdGhpcy5fdXJscGFyYW1zKHBhcmFtcyk7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSB5aWVsZCBmZXRjaChyZXF1ZXN0VVJMLCB7IGNyZWRlbnRpYWxzOiAnaW5jbHVkZScgfSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBqc29uID0geWllbGQgcmVzLmpzb24oKTtcclxuICAgICAgICAgICAgICAgIGlmIChqc29uLmVycilcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoanNvbi5tc2cpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGF0YSA9IGpzb24uZGF0YTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhmYWxzZSwganNvbi5kYXRhKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBqc29uLmRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZGF0YVxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrXHJcbiAgICAgKi9cclxuICAgIF9wb3N0KGRhdGEsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVzID0gXCJcIjtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IHlpZWxkIGZldGNoKHRoaXMuX2RhdGFiYXNlLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcclxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBqc29uID0geWllbGQgcmVzLmpzb24oKTtcclxuICAgICAgICAgICAgICAgIGlmIChqc29uLmVycilcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoanNvbi5tc2cpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzID0ganNvbi5kYXRhO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlLCBqc29uLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGpzb24uZGF0YTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIF91cmxwYXJhbXMocGFyYW1zKSB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gT2JqZWN0LmtleXMocGFyYW1zKS5tYXAoZnVuY3Rpb24gKGspIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChrKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChwYXJhbXNba10pO1xyXG4gICAgICAgIH0pLmpvaW4oJyYnKTtcclxuICAgICAgICByZXR1cm4gdXJsO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuTW9kZWwgPSBfTW9kZWw7XHJcbjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgTW9kZWxDbGFzc18xID0gcmVxdWlyZShcIi4uL01vZGVsQ2xhc3NcIik7XHJcbmNsYXNzIF9Oc3ggZXh0ZW5kcyBNb2RlbENsYXNzXzEuTW9kZWwge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9kYXRhYmFzZSA9IFwiL2FwaS9uc3gvXCI7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGdldCBkYXRhIG9mIG5zeFxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIGNhbGxiYWNrIGZ1bmN0aW9uXHJcbiAgICAgKi9cclxuICAgIGdldChjYWxsYmFjaykge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB5aWVsZCB0aGlzLl9nZXQoe30pLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlLCBkYXRhKTtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJlbW92ZShjYWxsYmFjaykge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5Oc3ggPSBfTnN4O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vKipcclxuICogRGlzcGxheSBkYXRhIHVuZGVyIHRhYmxlXHJcbiAqL1xyXG5jbGFzcyBUYWJsZURhdGEge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5fbWFwID0ge307XHJcbiAgICAgICAgdGhpcy5fbGlzdCA9IFtdO1xyXG4gICAgICAgIHRoaXMuX2lzQ29ubmVjdCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2Nvbm5lY3RTdGF0dXMgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuX2lzRmV0Y2hlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2RiVVJMID0gXCJcIjtcclxuICAgIH1cclxuICAgIGdldERhdGEoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgbGV0IHJlcyA9IHlpZWxkIGZldGNoKHRoaXMuX2RiVVJMLCB7IG1ldGhvZDogXCJHRVRcIiwgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyB9KTtcclxuICAgICAgICAgICAgaWYgKCFyZXMub2spIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2lzQ29ubmVjdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29ubmVjdFN0YXR1cyA9IHJlcy5zdGF0dXNUZXh0O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2lzQ29ubmVjdCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3RTdGF0dXMgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQganNvbiA9IHlpZWxkIHJlcy5qc29uKCk7XHJcbiAgICAgICAgICAgIGlmICghIWpzb24uZXJyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0ZldGNoZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3RTdGF0dXMgPSBqc29uLm1zZztcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9pc0ZldGNoZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0U3RhdHVzID0gXCJPS1wiO1xyXG4gICAgICAgICAgICB0aGlzLl9saXN0ID0ganNvbi5kYXRhO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZ2V0IHRhYmxlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXA7XHJcbiAgICB9XHJcbiAgICBnZXQgbGlzdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdDtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBUYWJsZURhdGE7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IFRhYmxlRGF0YV8xID0gcmVxdWlyZShcIi4uL1RhYmxlRGF0YVwiKTtcclxuY2xhc3MgQmFuZ1RodW9jIGV4dGVuZHMgVGFibGVEYXRhXzEuZGVmYXVsdCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2RiVVJMID0gXCIvYXBpL3RodW9jL1wiO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIHlpZWxkIHRoaXMuZ2V0RGF0YSgpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCByb3cgb2YgdGhpcy5fbGlzdCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGlkID0gcm93WydpZCddO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWFwW2lkXSA9IHJvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuQmFuZ1RodW9jID0gQmFuZ1RodW9jO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1CYW5nVGh1b2MuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgTW9kZWxDbGFzc18xID0gcmVxdWlyZShcIi4uL01vZGVsQ2xhc3NcIik7XHJcbmNvbnN0IEJhbmdUaHVvY18xID0gcmVxdWlyZShcIi4vQmFuZ1RodW9jXCIpO1xyXG5leHBvcnRzLkJhbmdUaHVvYyA9IEJhbmdUaHVvY18xLkJhbmdUaHVvYztcclxuY2xhc3MgX1RodW9jIGV4dGVuZHMgTW9kZWxDbGFzc18xLk1vZGVsIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fZGF0YWJhc2UgPSBcIi9hcGkvdGh1b2MvXCI7XHJcbiAgICB9XHJcbiAgICBnZXQoY2FsbGJhY2spIHtcclxuICAgICAgICBsZXQgJHRoaXMgPSB0aGlzO1xyXG4gICAgICAgICR0aGlzLl9nZXQoe30sIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYWxsYmFjayhmYWxzZSwgZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5UaHVvYyA9IF9UaHVvYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY2xhc3MgaW5wdXRQcmV2aWV3MiB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQgPSBkb2N1bWVudCkge1xyXG4gICAgICAgIHRoaXMuX2xpc3QgPSB7fTtcclxuICAgICAgICB0aGlzLl9kYXRhID0gW107XHJcbiAgICAgICAgdGhpcy5fbG9va3VwID0ge307XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgICAgIHRoaXMuX3ByZXZpZXdfZGl2ID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9jdXJyZW50UHJldmlld0RhdGEgPSBbXTtcclxuICAgICAgICAvLyBjb25zdHJ1Y3RvciAgICBcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XHJcbiAgICAgICAgICAgIGlmICghdGFyZ2V0LmNsYXNzTGlzdC5oYXNPd25Qcm9wZXJ0eShcInByZXZpZXctcm93XCIpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVsZXRlUHJldmlldygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBhZGQgbG9va3VwIHRvIGpzb24gbmFtZVxyXG4gICAgICogQHBhcmFtIHt7aWRFbDogU3RyaW5nfX0gYXJyIHsgaWRfZWxlbWVudCA6IG5hbWVfb2ZfZmllbGR9XHJcbiAgICAgKi9cclxuICAgIGFkZExvb2t1cChhcnIpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGFyciAhPSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKE9iamVjdC5jYWxsKGFycikpO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJhbWV0ZXIgbXVzdCBiZSBqc29uIG9ialwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXMoYXJyKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9sb29rdXBba2V5XSA9IGFycltrZXldO1xyXG4gICAgICAgICAgICBsZXQgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChrZXkpO1xyXG4gICAgICAgICAgICBpZiAoIWVsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhFcnJvcihgQ2Fubm90IGZpbmQgIyR7a2V5fSBlbGVtZW50YCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGlzdFtrZXldID0gZWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICA7XHJcbiAgICAvKipcclxuICAgICAqIGFkZCBob3N0IHRvIGZldGNoIGRhdGFiYXNlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIGFzZFxyXG4gICAgICovXHJcbiAgICBhZGREYXRhKGRhdGEpIHtcclxuICAgICAgICBpZiAodHlwZW9mIChkYXRhKSAhPSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInBhcmFtZXRlciBtdXN0IGJlIGpzb25cIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZGF0YSA9IGRhdGE7XHJcbiAgICB9XHJcbiAgICA7XHJcbiAgICBsaXN0ZW4oaWQsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY29kZSA9IGUua2V5Q29kZTtcclxuICAgICAgICAgICAgbGV0IGN1ciA9ICt0aGlzLl9wcmV2aWV3X2Rpdi5nZXRBdHRyaWJ1dGUoXCJjdXJcIik7XHJcbiAgICAgICAgICAgIGlmIChjb2RlID09PSAyNykgeyAvLyBlc2NcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RlbGV0ZVByZXZpZXcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChjb2RlID09IDM4IHx8IGNvZGUgPT0gNDApIHsgLy8gdXAtZG93blxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcHJldmlld19kaXYuY2hpbGRyZW5bY3VyXS5jbGFzc0xpc3QucmVtb3ZlKFwicHJldmlldy1yb3ctYWN0aXZlXCIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGxlbiA9IHRoaXMuX3ByZXZpZXdfZGl2LmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGN1ciA9IChjb2RlID09IDM4KSA/IGN1ciAtIDEgOiBjdXIgKyAxO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1ciA8IDApXHJcbiAgICAgICAgICAgICAgICAgICAgY3VyID0gbGVuIC0gMTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXIgPiBsZW4gLSAxKVxyXG4gICAgICAgICAgICAgICAgICAgIGN1ciA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmV2aWV3X2Rpdi5jaGlsZHJlbltjdXJdLmNsYXNzTGlzdC5hZGQoXCJwcmV2aWV3LXJvdy1hY3RpdmVcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmV2aWV3X2Rpdi5zZXRBdHRyaWJ1dGUoXCJjdXJcIiwgY3VyICsgXCJcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY29kZSA9PSAxMykgeyAvLyBlbnRlclxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sodGhpcy5fY3VycmVudFByZXZpZXdEYXRhW2N1cl0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVsZXRlUHJldmlldygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mZXRjaE9uKGlkLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIGZldGNoIGRhdGFiYXNlIGFuZCBzaG93IGluIGlucHV0XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgaWQgb2YgaHRtbCBlbGVtZW50IGlucHV0IG5lZWQgdG8gZmV0Y2ggYnkgdmFsdWVcclxuICAgICAqL1xyXG4gICAgZmV0Y2hPbihpZCwgY2FsbGJhY2spIHtcclxuICAgICAgICB0aGlzLl9kZWxldGVQcmV2aWV3KCk7XHJcbiAgICAgICAgdGhpcy5fY3VycmVudFByZXZpZXdEYXRhLmxlbmd0aCA9IDA7IC8vY2xlYXIgY3VycmVudCBwcmV2aWV3IHN1Z2dlc3QgbmFtZVxyXG4gICAgICAgIGlmICghdGhpcy5fbGlzdC5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDYW5ub3QgZmluZCBcIiArIGlkKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICA7XHJcbiAgICAgICAgbGV0IGlucHV0ID0gdGhpcy5fbGlzdFtpZF07XHJcbiAgICAgICAgbGV0IGlucHV0X3ByZXZpZXcgPSB0aGlzLl9jcmVhdGVGbHlXcmFwKGlucHV0KTtcclxuICAgICAgICBsZXQgdmFsdWUgPSBpbnB1dC52YWx1ZTtcclxuICAgICAgICB0aGlzLl9wcmV2aWV3X2RpdiA9IGlucHV0X3ByZXZpZXc7XHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCdhdXRvY29tcGxldGUnLCAnb2ZmJyk7XHJcbiAgICAgICAgZm9yIChjb25zdCByb3cgb2YgdGhpcy5fZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2lzTGlrZShyb3dbdGhpcy5fbG9va3VwW2lkXV0sIHZhbHVlKSlcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50UHJldmlld0RhdGEucHVzaChyb3cpO1xyXG4gICAgICAgICAgICBsZXQgYXJyID0gW107XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgbmFtZSBpbiB0aGlzLl9sb29rdXApIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fbG9va3VwW25hbWVdKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZmllbGQgPSB0aGlzLl9sb29rdXBbbmFtZV07XHJcbiAgICAgICAgICAgICAgICBhcnIucHVzaChyb3dbZmllbGRdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgbmV3Um93ID0gdGhpcy5fY3JlYXRlRmx5Um93KGFycik7XHJcbiAgICAgICAgICAgIG5ld1Jvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHJvdyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWxldGVQcmV2aWV3KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpbnB1dF9wcmV2aWV3LmFwcGVuZENoaWxkKG5ld1Jvdyk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW5wdXRfcHJldmlldyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxEaXZFbGVtZW50fSBlbGVtZW50XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcclxuICAgICAqL1xyXG4gICAgX2NyZWF0ZUZseVdyYXAoZWxlbWVudCkge1xyXG4gICAgICAgIGlmICghZWxlbWVudClcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgbGV0IHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRpdi5jbGFzc05hbWUgPSBcInByZXZpZXctaW5wdXRcIjtcclxuICAgICAgICBkaXYuc3R5bGUubWluV2lkdGggPSByZWN0LndpZHRoICsgXCJweFwiO1xyXG4gICAgICAgIGRpdi5zdHlsZS50b3AgPSArcmVjdC50b3AgKyByZWN0LmhlaWdodCArIFwicHhcIjtcclxuICAgICAgICBkaXYuc3R5bGUubGVmdCA9ICtyZWN0LmxlZnQgKyBcInB4XCI7XHJcbiAgICAgICAgZGl2LnNldEF0dHJpYnV0ZShcImN1clwiLCBcIjBcIik7XHJcbiAgICAgICAgcmV0dXJuIGRpdjtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQHJldHVybiB7dHJ1ZX0gaWYgc3RyMSBsaWtlIHN0cjJcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIxXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyMlxyXG4gICAgICovXHJcbiAgICBfaXNMaWtlKHN0cjEsIHN0cjIpIHtcclxuICAgICAgICBzdHIxID0gc3RyMS50cmltKCk7XHJcbiAgICAgICAgc3RyMiA9IHN0cjIudHJpbSgpO1xyXG4gICAgICAgIGlmIChzdHIxID09IFwiXCIgfHwgc3RyMiA9PSBcIlwiKVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgc3RyMSA9IHN0cjEubm9ybWFsaXplKCk7XHJcbiAgICAgICAgc3RyMiA9IHN0cjIubm9ybWFsaXplKCk7XHJcbiAgICAgICAgc3RyMSA9IHN0cjEudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBzdHIyID0gc3RyMi50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGxldCByZWcgPSBuZXcgUmVnRXhwKGBeLioke3N0cjJ9LiokYCk7XHJcbiAgICAgICAgcmV0dXJuIHN0cjEubWF0Y2gocmVnKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyVmFsdWVzXHJcbiAgICAgKi9cclxuICAgIF9jcmVhdGVGbHlSb3coYXJyVmFsdWVzKSB7XHJcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGFyclZhbHVlcykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHJvdy5jbGFzc05hbWUgPSBcInByZXZpZXctcm93XCI7XHJcbiAgICAgICAgZm9yIChsZXQgdmFsdWUgb2YgYXJyVmFsdWVzKSB7XHJcbiAgICAgICAgICAgIGxldCBjb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBjb2wuc3R5bGUubWFyZ2luID0gXCJhdXRvXCI7XHJcbiAgICAgICAgICAgIGNvbC50ZXh0Q29udGVudCA9IHZhbHVlO1xyXG4gICAgICAgICAgICByb3cuYXBwZW5kQ2hpbGQoY29sKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJvdztcclxuICAgIH1cclxuICAgIF9kZWxldGVQcmV2aWV3KCkge1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucHJldmlldy1pbnB1dFwiKS5mb3JFYWNoKCh2YWwpID0+IHtcclxuICAgICAgICAgICAgdmFsLnJlbW92ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGlucHV0UHJldmlldzI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlucHV0UHJldmlldzIuanMubWFwIiwiY29uc3Qge0RvblZpfSA9IHJlcXVpcmUoJy4uL2FwcC9Nb2RlbC9Eb25WaS8nKTtcclxuY29uc3Qge0Jvb3RzdHJhcE1vZGFsfSA9IHJlcXVpcmUoJy4uL2FwcC9Nb2RlbC9Cb29zdHJhcE1vZGFsJyk7XHJcblxyXG5jb25zdCBkb252aSA9IG5ldyBEb25WaSgpO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoYXN5bmMgKCk9PntcclxuICAgIGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVRhYmxlKCkge1xyXG4gICAgICAgIGNvbnN0IHRhYmxlID0gJChcIiNuaGFwX2Rvbl92aS0tdGFibGUgdGJvZHlcIik7XHJcbiAgICAgICAgdGFibGUuY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgZG9udmkuZ2V0KCk7XHJcbiAgICAgICAgZm9yIChjb25zdCByb3cgb2YgZGF0YSkge1xyXG4gICAgICAgICAgICBjb25zdCB0ciA9ICQoJzx0ci8+JykuaHRtbChgXHJcbiAgICAgICAgICAgICAgICA8dGQ+JHtyb3cuaWR9PC90ZD5cclxuICAgICAgICAgICAgICAgIDx0ZD4ke3Jvdy50ZW59PC90ZD5cclxuICAgICAgICAgICAgYCk7XHJcbiAgICAgICAgICAgIHRhYmxlLmFwcGVuZCh0cik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVRhYmxlKCk7XHJcblxyXG59KTtcclxuIiwiY29uc3Qge0hvYURvbkZvcm19ID0gcmVxdWlyZSgnLi4vYXBwL0hvYURvbkZvcm0nKTtcclxuY29uc3Qge1FMTlR9ID0gcmVxdWlyZSgnLi4vYXBwL0FwcCcpO1xyXG5jb25zdCB7Qm9vdHN0cmFwTW9kYWx9ID0gcmVxdWlyZSgnLi4vYXBwL01vZGVsL0Jvb3N0cmFwTW9kYWwnKTtcclxuY29uc3QgQ09ORklHID0gcmVxdWlyZSgnLi4vLi4vY29uZmlnJyk7XHJcblxyXG5jb25zdCBob2FEb25Gb3JtID0gbmV3IEhvYURvbkZvcm0oKTtcclxuY29uc3QgQXBwID0gbmV3IFFMTlQoKTtcclxuY29uc3QgcG9wdXAgPSBuZXcgQm9vdHN0cmFwTW9kYWwoJ25oYXBfaG9hX2Rvbi0tcG9wdXAnKTtcclxuXHJcbmZ1bmN0aW9uIGRpc3BsYXlUaW1lKCkge1xyXG4gICAgbGV0IG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICAkKFwiI3RpbWUtZGF0ZVwiKS50ZXh0KG5vdy50b0xvY2FsZURhdGVTdHJpbmcoKSk7XHJcbiAgICAkKFwiI3RpbWUtdGltZVwiKS50ZXh0KG5vdy50b0xvY2FsZVRpbWVTdHJpbmcoKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvb3BTaG93VGltZSgpIHtcclxuICAgIHNldEludGVydmFsKCgpPT57XHJcbiAgICAgICAgZGlzcGxheVRpbWUoKTtcclxuICAgIH0sIDEwMDApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaXNwbGF5VXNlcigpIHtcclxuICAgIGxldCB1c2VybmFtZSA9IGhvYURvbkZvcm0uZ2V0VXNlcm5hbWUoKTtcclxuICAgICQoXCIjbmhhcF9ob2FfZG9uLS11c2VybmFtZVwiKS50ZXh0KHVzZXJuYW1lKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZm9jdXNUZW5UaHVvY0ZpcnN0KCkge1xyXG4gICAgJChcIiNuaGFwX2hvYV9kb24tLXRlbi10aHVvY1wiKS5mb2N1cygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVUb25nR2lhKCkge1xyXG4gICAgbGV0IHRvbmcgPSAwO1xyXG4gICAgbGV0IGxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3RoZC1naWEnKTtcclxuICAgIGZvciAobGV0IHZhbCBvZiBsaXN0KSB7XHJcbiAgICAgICAgbGV0IGdpYSA9IHBhcnNlSW50KHZhbC50ZXh0Q29udGVudC5yZXBsYWNlKC9cXEQvLCAnJykpO1xyXG4gICAgICAgIHRvbmcgKz0gZ2lhO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdmFsID0gdG9uZy50b0xvY2FsZVN0cmluZygpKycgVk7EkCc7XHJcblxyXG4gICAgJChcIiNuaGFwX2hvYV9kb24tLXN1bVwiKS5hdHRyKCdjdXJWYWwnLCB2YWwpO1xyXG4gICAgaWYgKCEkKCcja2lldS1saWV1JylbMF0uY2hlY2tlZCkgJCgnI25oYXBfaG9hX2Rvbi0tc3VtJykudmFsKHZhbCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVRpZW5UaG9pKCkge1xyXG4gICAgbGV0IHN1bSA9ICQoXCIjbmhhcF9ob2FfZG9uLS1zdW1cIikudmFsKCkucmVwbGFjZSgvW1xcRFxcc10vZywgJycpO1xyXG4gICAgbGV0IHRpZW5raCA9ICQoXCIjbmhhcF9ob2FfZG9uLS10aWVua2gtdHJhXCIpLnZhbCgpLnJlcGxhY2UoL1tcXERcXHNdL2csICcnKTtcclxuXHJcbiAgICBsZXQgdGllblRob2kgPSBwYXJzZUludCh0aWVua2gpIC0gcGFyc2VJbnQoc3VtKTtcclxuICAgIHRpZW5UaG9pID0gdGllblRob2kgPj0gMCA/IHRpZW5UaG9pLnRvTG9jYWxlU3RyaW5nKCkgOiAnfmxvaSc7XHJcblxyXG4gICAgJChcIiNuaGFwX2hvYV9kb24tLXRob2l0aWVuXCIpLnZhbCh0aWVuVGhvaSk7XHJcbn1cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG4gICAgbG9vcFNob3dUaW1lKCk7XHJcbiAgICBkaXNwbGF5VXNlcigpO1xyXG4gICAgZm9jdXNUZW5UaHVvY0ZpcnN0KCk7XHJcblxyXG4gICAgQXBwLmFkZFNlbGVjdElucHV0KCQoJyNuaGFwX2hvYV9kb24tLWRvbl92aScpWzBdLCB7XHJcbiAgICAgICAgdGl0bGU6ICd0ZW4nLFxyXG4gICAgICAgIHZhbHVlOiAnaWQnLFxyXG4gICAgfSk7XHJcbiAgICBBcHAub25VcGRhdGVBbGwoKTtcclxuXHJcbiAgICBob2FEb25Gb3JtLnNldEhlYWRlcigkKFwiI25oYXBfaG9hX2Rvbi0tZm9ybS1uaGFwXCIpLmdldCgwKSk7XHJcbiAgICBob2FEb25Gb3JtLnNldFRhYmxlKCQoXCIjdGFibGUtbmhhcFwiKS5nZXQoMCkpO1xyXG5cclxuICAgICQoJyNuaGFwX2hvYV9kb24tLXRpZW5raC10cmEnKS5tb25leUlucHV0KCkub24oJ2tleXVwJywgKCk9PntcclxuICAgICAgICB1cGRhdGVUaWVuVGhvaSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnI25oYXBfaG9hX2Rvbi0taG9hZG9uLWZvcm0nKS5zdWJtaXQoKGUpPT57XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBob2FEb25Gb3JtLnB1c2hUb0RhdGFiYXNlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKCcjbmhhcF9ob2FfZG9uLS1ob2Fkb24tZm9ybScpLmZpbmQoJ2lucHV0LCBzZWxlY3QnKS52YWwoJycpO1xyXG4gICAgICAgICAgICAkKCcjbmhhcF9ob2FfZG9uLS1mb3JtLW5oYXAnKS5maW5kKCdpbnB1dCwgc2VsZWN0JykudmFsKCcnKTtcclxuICAgICAgICAgICAgaG9hRG9uRm9ybS5uZXdIb2FEb24oKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coaG9hRG9uRm9ybSk7XHJcbiAgICAgICAgICAgIHBvcHVwLnNob3coJ09LJywgJycpO1xyXG4gICAgICAgIH0sIChlcnIpPT57XHJcbiAgICAgICAgICAgIHBvcHVwLnNob3coJ0Vycm9yJywgZXJyLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBBcHAuYWRkTmFtZUlucHV0VGh1b2MoXCJuaGFwX2hvYV9kb24tLXRlbl90aHVvY1wiLCB7XHJcbiAgICAgICAgXCJuaGFwX2hvYV9kb24tLW1hX3RodW9jXCI6IFwibWFfdGh1b2NcIixcclxuICAgICAgICBcIm5oYXBfaG9hX2Rvbi0tdGVuX3RodW9jXCI6IFwidGVuX3RodW9jXCIsXHJcbiAgICAgICAgXCJuaGFwX2hvYV9kb24tLWRvbl92aVwiOiBcInRlbl9kb25fdmlcIixcclxuICAgICAgICBcIm5oYXBfaG9hX2Rvbi0tY29zdFwiOiBcImRvbl9naWFcIixcclxuICAgIH0sIHtcclxuICAgICAgICBcIm5oYXBfaG9hX2Rvbi0tdGVuX3RodW9jXCI6IFwidGVuX3RodW9jXCIsXHJcbiAgICAgICAgXCJuaGFwX2hvYV9kb24tLW1hX3RodW9jXCI6IFwibWFfdGh1b2NcIixcclxuICAgICAgICBcIm5oYXBfaG9hX2Rvbi0tZG9uX3ZpXCI6IFwiaWRfZG9uX3ZpXCIsXHJcbiAgICAgICAgXCJuaGFwX2hvYV9kb24tLWNvc3RcIjogXCJkb25fZ2lhXCIsXHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI25oYXBfaG9hX2Rvbi0tZm9ybS1uaGFwXCIpLm9uKCdzdWJtaXQnLCAoZSk9PntcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgJChcIiNuaGFwX2hvYV9kb24tLWZvcm0tbmhhcFwiKS5maW5kKCdpbnB1dCwgc2VsZWN0JykudmFsKCcnKTtcclxuICAgICAgICB1cGRhdGVUb25nR2lhKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiI2tpZXUtbGlldVwiKS5jbGljaygoKSA9PiB7XHJcbiAgICAgICAgJCgnI25oYXBfaG9hX2Rvbi0tc3VtJykudmFsKENPTkZJRy5HSUFfQkFOX1RIRU9fTElFVSk7XHJcbiAgICB9KTtcclxuICAgICQoJyNraWV1LWJhbmxlJykuY2xpY2soKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHN1bSA9ICQoJyNzdW0nKTtcclxuICAgICAgICBjb25zdCB2YWwgPSBzdW0uYXR0cignY3VyVmFsJyk7XHJcbiAgICAgICAgc3VtLnZhbCh2YWwpO1xyXG4gICAgfSk7XHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG59KTtcclxuIiwiY29uc3Qge05zeH0gPSByZXF1aXJlKCcuLi9hcHAvTW9kZWwvTnN4Jyk7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeSgoKT0+e1xyXG4gICAgY29uc3QgcG9wdXAgPSBuZXcgU3RhdHVzUG9wdXAoKTtcclxuICAgIGNvbnN0IG5zeCA9IG5ldyBOc3goKTtcclxuXHJcbiAgICBwb3B1cC5jcmVhdGUoKTtcclxuICAgIHVwZGF0ZU5TWCgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZVRhYmxlUm93KHZhbCkge1xyXG4gICAgICAgIGxldCByb3cgPSAkKFwiPHRyLz5cIik7XHJcbiAgICAgICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKHZhbCkpIHtcclxuICAgICAgICAgICAgcm93LmFwcGVuZCgkKCc8dGQvPicpLnRleHQodmFsW2tleV0pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJvdztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVOU1goKSB7XHJcbiAgICAgICAgJCgnI3RhYmxlLWJvZHknKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgIG5zeC5nZXQoKGVyciwgZGF0YSk9PntcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yIChsZXQgcm93IG9mIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICQoXCIjdGFibGUtYm9keVwiKS5hcHBlbmQoY3JlYXRlVGFibGVSb3cocm93KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB1cGRhdGUgZGF0YSByZXF1ZXN0XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBsZXQgZGF0YSA9IGUuZGF0YTtcclxuICAgICAgICBpZiAoZGF0YS5tc2cgPT0gJ3VwZGF0ZScpIHtcclxuICAgICAgICAgICAgdXBkYXRlTlNYKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pO1xyXG4iLCJjb25zdCB7QmFuZ1RodW9jfSA9IHJlcXVpcmUoJy4uL2FwcC9Nb2RlbC9UaHVvYycpO1xyXG4vLyBjb25zdCB0aHVvYyA9IG5ldyBUaHVvYygpO1xyXG5jb25zdCBiYW5nVGh1b2MgPSBuZXcgQmFuZ1RodW9jKCk7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgIGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVRhYmxlKCkge1xyXG4gICAgICAgIGNvbnN0IHRhYmxlID0gJChcIiNuaGFwX3RodW9jLS10YWJsZSB0Ym9keVwiKTtcclxuICAgICAgICB0YWJsZS5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgIGF3YWl0IGJhbmdUaHVvYy51cGRhdGUoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiBiYW5nVGh1b2MubGlzdCkge1xyXG4gICAgICAgICAgICBjb25zdCBwcmljZVN0cmluZyA9ICgrcm93LmRvbl9naWEpLnRvTG9jYWxlU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyID0gJCgnPHRyLz4nKS5odG1sKGBcclxuICAgICAgICAgICAgICAgIDx0ZD4ke3Jvdy5tYX08L3RkPlxyXG4gICAgICAgICAgICAgICAgPHRkPiR7cm93LnRlbn08L3RkPlxyXG4gICAgICAgICAgICAgICAgPHRkPiR7cm93LmlkX25zeH08L3RkPlxyXG4gICAgICAgICAgICAgICAgPHRkPiR7cHJpY2VTdHJpbmd9PC90ZD5cclxuICAgICAgICAgICAgICAgIDx0ZD4ke3Jvdy5zb19sdW9uZ308L3RkPlxyXG4gICAgICAgICAgICBgKTtcclxuICAgICAgICAgICAgdGFibGUuYXBwZW5kKHRyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVGFibGUoKTtcclxufSk7XHJcbiJdfQ==
