(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"./Controller":3,"./inputPreview2":11}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DonVi_1 = require("./DonVi");
const Thuoc_1 = require("./Thuoc");
const Nsx_1 = require("./Nsx");
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
            this._componentList[compoName].update(function (err, data) {
                for (const func of that._event[compoName]) {
                    func(err, data);
                }
            });
        }
    }
};
exports.Controller = _Controller;

},{"./DonVi":5,"./Nsx":8,"./Thuoc":10}],4:[function(require,module,exports){
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
class BangDonVi extends TableData_1.default {
    constructor() {
        super();
        this._dbURL = "/public/api/don_vi/";
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getData();
            for (let row of this._list) {
                let id = row['id'];
                this._map[id] = {
                    data: row,
                    ten: row['ten'],
                    donvi_quydoi: null,
                    heso: null,
                    quydoiText: "đơn vị cơ bản",
                };
            }
            for (let id of Object.keys(this._map)) {
                let idCoban = this._map[id].data['id_quy_doi'];
                let heso = +this._map[id].data['he_so_quydoi'];
                if (idCoban == null) {
                    continue;
                }
                while (this._map[idCoban].data['id_quy_doi'] != null) {
                    heso *= +this._map[idCoban].data['he_so_quydoi'];
                    idCoban = this._map[idCoban].data['id_quy_doi'];
                }
                this._map[id]['donvi_quydoi'] = this._map[idCoban];
                this._map[id]['heso'] = heso;
                this._map[id]['quydoiText'] = "= " + heso + "x ["
                    + this._map[idCoban].ten + "]";
            }
        });
    }
}
exports.default = BangDonVi;

},{"../TableData":9}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = require("../Model");
class _DonVi extends Model_1.Model {
    constructor() {
        super();
        this._database = "/public/api/don_vi/";
        this._fetchData = null;
    }
    update(callback) {
        this._get({}, (err, data) => {
            if (!!err) {
                console.log(err);
                return;
            }
            this._fetchData = this._filter(data);
            callback(err, this._fetchData);
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

},{"../Model":7}],6:[function(require,module,exports){
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

},{"./CTHoaDon":2}],7:[function(require,module,exports){
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
                    callback(json.msg);
                    return;
                }
                this._data = json.data;
                callback(false, json.data);
            }
            catch (err) {
                callback(err);
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
                    callback(json.msg);
                    return;
                }
                this._res = json.data;
                callback(false, json.data);
            }
            catch (err) {
                callback(err);
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

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = require("../Model");
class _Nsx extends Model_1.Model {
    constructor() {
        super();
        this._database = "/public/api/nsx/";
    }
    update(callback) {
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
exports.Nsx = _Nsx;

},{"../Model":7}],9:[function(require,module,exports){
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
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            // nothing here
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

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = require("../Model");
class _Thuoc extends Model_1.Model {
    constructor() {
        super();
        this._database = "/public/api/thuoc/";
    }
    update(callback) {
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

},{"../Model":7}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
const BangDonVi = require('../app/DonVi/BangDonVi').default;

function fetchToTable(data) {
    $("#nhap_don_vi--table-body").children().remove();
    $('.will-be-update').remove();

    for (let id of Object.keys(data)) {
        let ten = data[id]['ten'];
        let quydoiText = data[id]['quydoiText'];

        let row = $("<tr/>");
        row.append($('<td/>').text(id))
            .append($('<td/>').text(ten))
            .append($('<td/>').text(quydoiText));

        let opt = $('<option/>').val(id).text(ten).addClass('will-be-update');
        $("#nhap_don_vi--id_quy_doi").append(opt);
        $('#nhap_don_vi--table-body').append(row);
    }
}

$(document).ready(async ()=>{
    const bangDonvi = new BangDonVi();
    await bangDonvi.update();
    fetchToTable(bangDonvi.table);

    const popup = new StatusPopup();
    popup.create();

    $("#nhap_don_vi--form").on('submit', (e)=>{
        e.preventDefault();

        const tenDonVi = $('#nhap_don_vi--ten_don_vi').val();
        const idQuyDoi = $('#nhap_don_vi--id_quy_doi').val();
        const heSoQuyDoi = idQuyDoi == "null" ? 0 : $("#nhap_don_vi--he_so_quydoi").val();

        $.ajax('/api/addDonvi.php', {
            method: 'post',
            xhrFields: {
                withCredentials: 'include',
            },
            data: `ten_don_vi=${tenDonVi}&id_quy_doi=${idQuyDoi}&he_so_quydoi=${heSoQuyDoi}`,
            success: function(json) {
                if (!!json.err) {
                    popup.setStatus(false, json.msg);
                    popup.show();
                    return;
                }

                parent.postMessage({
                    msg: 'update',
                }, "*");

                popup.setStatus(true, json.msg);
                popup.show();
                setTimeout(()=>{
                    popup.hide();
                }, 1000);

                $("#nhap_don_vi--form input").val("");
                $("#nhap_don_vi--id_quy_doi").val("null");
            },
            error: function(err) {
                popup.setStatus(false, err.responseText);
                popup.show();

                return;
            },
        });
    });


    // on input quy doi don vi
    $('#nhap_don_vi--id_quy_doi').on('change', function ChangeOnInputDonVi(e) {
        let val = $(this).val();
        $('#nhap_don_vi--he_so_quydoi').prop('disabled', val == 'null');
    });

    // update data request
    window.addEventListener('message', async function(e) {
        let data = e.data;
        if (data.msg == 'update') {
            await bangDonvi.update();
            fetchToTable(bangDonvi.table);
        }
    });
});

},{"../app/DonVi/BangDonVi":4}],13:[function(require,module,exports){
const {HoaDonForm} = require('../app/HoaDonForm');
const {QLNT} = require('../app/App');

const hoaDonForm = new HoaDonForm();
const App = new QLNT();

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
    const popup = new StatusPopup();
    popup.create();

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
            popup.setStatus(true, "OK");
            popup.show();
        }, (err)=>{
            popup.setStatus(false, err.messageText);
            popup.show();

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
        $('#nhap_hoa_don--sum').val(8000);
    });
    $('#kieu-banle').click(() => {
        const sum = $('#sum');
        const val = sum.attr('curVal');
        sum.val(val);
    });
    // -----------------------
});

},{"../app/App":1,"../app/HoaDonForm":6}],14:[function(require,module,exports){
const {Nsx} = require('../app/Nsx');

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
        nsx.update((err, data)=>{
            if (err) {
                throw new Error(err);
            }
            for (let row of data) {
                $("#table-body").append(createTableRow(row));
            }
        });
    }

    $("#form").on('submit', (e)=>{
        e.preventDefault();

        $.ajax('/public/api/nsx/', {
            method: 'post',
            xhrFields: {
                withCredentials: 'include',
            },
            data: $("#form").serialize(),
            success: function(json) {
                if (!!json.err) {
                    popup.setStatus(false, json.msg);
                    popup.show();
                    return;
                }

                popup.setStatus(true, json.msg);
                popup.show();
                setTimeout(()=>{
                    popup.hide();
                }, 1000);

                $("input, textarea").val("");

                parent.postMessage({
                    msg: 'update',
                }, '*');
            },
            error: function(err) {
                popup.setStatus(false, err.responseText);
                popup.show();
                return;
            },
        });
    });

    // update data request
    window.addEventListener('message', function(e) {
        let data = e.data;
        if (data.msg == 'update') {
            updateNSX();
        }
    });
});

},{"../app/Nsx":8}],15:[function(require,module,exports){
const InputPreview2 = require('../app/inputPreview2').default;
const {DonVi} = require('../app/DonVi');

$(document).ready(function() {
    let popup = new StatusPopup();
    popup.create();

    const preview = new InputPreview2();
    const donVi = new DonVi();

    preview.addLookup({
        "ten_nsx": "ten",
    });
    preview.listen("ten_nsx", (data)=>{
        $("#ten_nsx").val(data["ten"]);
    });

    function updateNSX() {
        // asd
    }

    function updateDonvi() {
        $("#don_vi").children().remove();
        donVi.update((err, data)=>{
            if (err) console.log(json.msg);
            else {
                for (let row of data) {
                    let name = row['ten'];
                    let id = row['id'];
                    let newOpt = $("<option/>").val(id).text(name);

                    $("#don_vi").append(newOpt);
                }
                $("#don_vi").find("option:first-child").attr("selected", "");
            }
        });
    }

    $("#don_gia").moneyInput();
    updateNSX();
    updateDonvi();


    $("#form").on('submit', (e)=>{
        e.preventDefault();

        $.ajax({
            type: "POST",
            url: "/public/api/thuoc/",
            data: $("#form").serialize(),
            dataType: "json",
            xhrFields: {
                withCredentials: true, // for session cookie
            },
            success: (json)=>{
                if (!!json.err) {
                    popup.setStatus(false, json.msg);
                    popup.show();
                    console.log('Post failed: ', json.msg);
                } else {
                    popup.setStatus(true, 'Thêm thành công');
                    popup.show();
                    setTimeout(function() {
                        popup.hide();
                    }, 1000);

                    console.log('success');
                    $("input").val("");

                    parent.postMessage({
                        msg: 'update',
                    }, '*');
                }
            },
            error: (err)=>{
                console.log(err);
            },
        });
    });

    // update data request
    window.addEventListener('message', function(e) {
        let data = e.data;
        if (data.msg == 'update') {
            updateNSX();
            updateDonvi();
        }
    });

    // shortcut key event
    document.addEventListener('keydown', (e)=>{
        console.log("nhap thuoc: ", e.keyCode);
        parent.postMessage({
            msg: 'shortcut_key',
            key: e.keyCode,
            shift: e.shiftKey,
        }, "*");
    });
});

},{"../app/DonVi":5,"../app/inputPreview2":11}]},{},[12,13,14,15])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL0FwcC5qcyIsInNyYy9hcHAvQ1RIb2FEb24uanMiLCJzcmMvYXBwL0NvbnRyb2xsZXIuanMiLCJzcmMvYXBwL0RvblZpL0JhbmdEb25WaS5qcyIsInNyYy9hcHAvRG9uVmkvaW5kZXguanMiLCJzcmMvYXBwL0hvYURvbkZvcm0uanMiLCJzcmMvYXBwL01vZGVsL2luZGV4LmpzIiwic3JjL2FwcC9Oc3gvaW5kZXguanMiLCJzcmMvYXBwL1RhYmxlRGF0YS9pbmRleC5qcyIsInNyYy9hcHAvVGh1b2MvaW5kZXguanMiLCJzcmMvYXBwL2lucHV0UHJldmlldzIuanMiLCJzcmMvc2NyaXB0L25oYXAtZG9uLXZpLmpzIiwic3JjL3NjcmlwdC9uaGFwLWhvYS1kb24uanMiLCJzcmMvc2NyaXB0L25oYXAtbnN4LmpzIiwic3JjL3NjcmlwdC9uaGFwLXRodW9jLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IENvbnRyb2xsZXJfMSA9IHJlcXVpcmUoXCIuL0NvbnRyb2xsZXJcIik7XHJcbmNvbnN0IGlucHV0UHJldmlldzJfMSA9IHJlcXVpcmUoXCIuL2lucHV0UHJldmlldzJcIik7XHJcbmNvbnN0IF9RTE5UID0gY2xhc3MgZXh0ZW5kcyBDb250cm9sbGVyXzEuQ29udHJvbGxlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuYWRkTW9kZWwoJ0RvblZpJywgJ0RvblZpJyk7XHJcbiAgICAgICAgdGhpcy5hZGRNb2RlbCgnVGh1b2MnLCAnVGh1b2MnKTtcclxuICAgICAgICB0aGlzLmFkZE1vZGVsKCdOc3gnLCAnTnN4Jyk7XHJcbiAgICB9XHJcbiAgICBhZGRUYWJsZShlbGVtZW50KSB7XHJcbiAgICAgICAgbGV0IG5hbWVUSHMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0aFwiKTtcclxuICAgICAgICBsZXQgY29tcG9OYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2NvbXBvbmVudCcpO1xyXG4gICAgICAgIGNvbnN0IGxvb2tOYW1lID0gQXJyYXkuZnJvbShuYW1lVEhzKVxyXG4gICAgICAgICAgICAubWFwKCh2YWwpID0+IHZhbC5nZXRBdHRyaWJ1dGUoJ2ZvcicpKTtcclxuICAgICAgICBjb25zdCB1cGRhdGVUYWJsZSA9IGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGVycilcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgbGV0IGJvZHkgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3Rib2R5Jyk7XHJcbiAgICAgICAgICAgIC8vIGRlbGV0ZSBvbGQgcm93XHJcbiAgICAgICAgICAgIGxldCB0cmJvZHkgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3Rib2R5IHRyJyk7XHJcbiAgICAgICAgICAgIGlmICh0cmJvZHkgJiYgdHJib2R5Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZWwgb2YgdHJib2R5KVxyXG4gICAgICAgICAgICAgICAgICAgIGVsLnJlbW92ZUNoaWxkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gdXBkYXRhIG5ldyByb3dcclxuICAgICAgICAgICAgZm9yIChsZXQgcm93IG9mIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGxldCByb3dFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBuYW1lIG9mIGxvb2tOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld1REID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcclxuICAgICAgICAgICAgICAgICAgICBuZXdURC50ZXh0Q29udGVudCA9IHJvd1tuYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICByb3dFbC5hcHBlbmRDaGlsZChuZXdURCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBib2R5LmFwcGVuZENoaWxkKHJvd0VsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5hZGRVcGRhdGVGdW5jKGNvbXBvTmFtZSwgdXBkYXRlVGFibGUpO1xyXG4gICAgfVxyXG4gICAgYWRkTmFtZUlucHV0VGh1b2MoaWRFbGVtZW50LCBvcHRMaXN0ZW4sIG9wdENoYW5nZSkge1xyXG4gICAgICAgIGNvbnN0IHByZXZpZXcgPSBuZXcgaW5wdXRQcmV2aWV3Ml8xLmRlZmF1bHQoKTtcclxuICAgICAgICBwcmV2aWV3LmFkZExvb2t1cChvcHRMaXN0ZW4pO1xyXG4gICAgICAgIHByZXZpZXcubGlzdGVuKGlkRWxlbWVudCwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaWRFbCBpbiBvcHRDaGFuZ2UpIHtcclxuICAgICAgICAgICAgICAgIGlmICghb3B0Q2hhbmdlLmhhc093blByb3BlcnR5KGlkRWwpKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgJCgnIycgKyBpZEVsKS52YWwoZGF0YVtvcHRDaGFuZ2VbaWRFbF1dKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IG9uVXBkYXRlID0gZnVuY3Rpb24gKGVyciwgZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByZXZpZXcuYWRkRGF0YShkYXRhKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuYWRkVXBkYXRlRnVuYygnVGh1b2MnLCBvblVwZGF0ZSk7XHJcbiAgICB9XHJcbiAgICBhZGRTZWxlY3RJbnB1dChlbGVtZW50LCBvcHQpIHtcclxuICAgICAgICBsZXQgdmFsdWVLZXkgPSBvcHQudmFsdWU7XHJcbiAgICAgICAgbGV0IHRpdGxlS2V5ID0gb3B0LnRpdGxlO1xyXG4gICAgICAgIGxldCBjb21wb05hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnY29tcG9uZW50Jyk7XHJcbiAgICAgICAgY29uc3Qgb25VcGRhdGUgPSBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gcmVtb3ZlIG9sZCBvcHRpb25zXHJcbiAgICAgICAgICAgIGxldCBvbGRPcHQgPSBlbGVtZW50LmNoaWxkTm9kZXM7XHJcbiAgICAgICAgICAgIGlmIChvbGRPcHQubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgb2xkT3B0LmZvckVhY2goKHZhbCkgPT4gdmFsLnJlbW92ZSgpKTtcclxuICAgICAgICAgICAgLy8gYWRkIHVwZGF0ZWQgb3B0aW9uXHJcbiAgICAgICAgICAgIGZvciAobGV0IHJvdyBvZiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSByb3dbdmFsdWVLZXldO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRpdGxlID0gcm93W3RpdGxlS2V5XTtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdPcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICAgICAgICAgICAgbmV3T3B0LnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBuZXdPcHQudGV4dENvbnRlbnQgPSB0aXRsZTtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQobmV3T3B0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5hZGRVcGRhdGVGdW5jKGNvbXBvTmFtZSwgb25VcGRhdGUpO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnRzLlFMTlQgPSBfUUxOVDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QXBwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IF9DVEhvYURvbiA9IGNsYXNzIHtcclxuICAgIGNvbnN0cnVjdG9yKG1hID0gLTEsIHRlbiA9IFwiXCIsIGRvbnZpID0gLTEsIHNsID0gMCwgdGhhbmh0aWVuID0gMCkge1xyXG4gICAgICAgIHRoaXMubWEgPSBtYTtcclxuICAgICAgICB0aGlzLnRlbiA9IHRlbjtcclxuICAgICAgICB0aGlzLmRvbnZpID0gZG9udmk7XHJcbiAgICAgICAgdGhpcy5zbCA9IHNsO1xyXG4gICAgICAgIHRoaXMudGhhbmh0aWVuID0gdGhhbmh0aWVuO1xyXG4gICAgICAgIHRoaXMuX2NoaWxkRWxlbWVudCA9IHt9O1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudCgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQWxsVmFsdWUobWEsIHRlbiwgZG9udmksIHNsLCB0aGFuaHRpZW4pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBjcmVhdGUgcm93IGVsZW1lbnQgZm9yIHRhYmxlXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZUVsZW1lbnQoKSB7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XHJcbiAgICAgICAgY29uc3QgbWFURCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcbiAgICAgICAgY29uc3QgdGVuVEQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG4gICAgICAgIGNvbnN0IGRvbnZpVEQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG4gICAgICAgIGNvbnN0IHNsVEQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG4gICAgICAgIGNvbnN0IHRpZW5URCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcbiAgICAgICAgbWFURC5jbGFzc0xpc3QuYWRkKCdjdGhkLW10aHVvYycpO1xyXG4gICAgICAgIHRlblRELmNsYXNzTGlzdC5hZGQoJ2N0aGQtdHRodW9jJyk7XHJcbiAgICAgICAgZG9udmlURC5jbGFzc0xpc3QuYWRkKCdjdGhkLWRvbnZpJyk7XHJcbiAgICAgICAgc2xURC5jbGFzc0xpc3QuYWRkKCdjdGhkLXNsJyk7XHJcbiAgICAgICAgdGllblRELmNsYXNzTGlzdC5hZGQoJ2N0aGQtZ2lhJyk7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZChtYVREKTtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LmFwcGVuZENoaWxkKHRlblREKTtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LmFwcGVuZENoaWxkKGRvbnZpVEQpO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoc2xURCk7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZCh0aWVuVEQpO1xyXG4gICAgICAgIHRoaXMuX2NoaWxkRWxlbWVudCA9IHtcclxuICAgICAgICAgICAgXCJtYV90aHVvY1wiOiBtYVRELFxyXG4gICAgICAgICAgICBcInRlbl90aHVvY1wiOiB0ZW5URCxcclxuICAgICAgICAgICAgXCJkb25fdmlcIjogZG9udmlURCxcclxuICAgICAgICAgICAgXCJzb19sdW9uZ1wiOiBzbFRELFxyXG4gICAgICAgICAgICBcInRoYW5odGllblwiOiB0aWVuVERcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZ2V0Um93RWxlbWVudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fZWxlbWVudClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZTtcclxuICAgICAgICBpZiAocGFyZW50KVxyXG4gICAgICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQodGhpcy5fZWxlbWVudCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGdldCBqc29uIGRhdGEgZm9yIHBvc3QgZm9ybVxyXG4gICAgICovXHJcbiAgICBnZXREYXRhSlNPTigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAnbWFfdGh1b2MnOiB0aGlzLm1hLFxyXG4gICAgICAgICAgICAndGVuX3RodW9jJzogdGhpcy50ZW4sXHJcbiAgICAgICAgICAgICdkb25fdmknOiB0aGlzLmRvbnZpLFxyXG4gICAgICAgICAgICAnc29fbHVvbmcnOiB0aGlzLnNsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBtYVxyXG4gICAgICogQHBhcmFtIHRlblxyXG4gICAgICogQHBhcmFtIGRvbnZpXHJcbiAgICAgKiBAcGFyYW0gc2xcclxuICAgICAqIEBwYXJhbSB0aGFuaHRpZW5cclxuICAgICAqL1xyXG4gICAgdXBkYXRlQWxsVmFsdWUobWEsIHRlbiwgZG9udmksIHNsLCB0aGFuaHRpZW4pIHtcclxuICAgICAgICB0aGlzLm1hID0gbWE7XHJcbiAgICAgICAgdGhpcy50ZW4gPSB0ZW47XHJcbiAgICAgICAgdGhpcy5kb252aSA9IGRvbnZpO1xyXG4gICAgICAgIHRoaXMuc2wgPSBzbDtcclxuICAgICAgICB0aGlzLnRoYW5odGllbiA9IHRoYW5odGllbjtcclxuICAgICAgICB0aGlzLl9jaGlsZEVsZW1lbnRbJ21hX3RodW9jJ10udGV4dENvbnRlbnQgPSBtYSArIFwiXCI7XHJcbiAgICAgICAgdGhpcy5fY2hpbGRFbGVtZW50Wyd0ZW5fdGh1b2MnXS50ZXh0Q29udGVudCA9IHRlbiArIFwiXCI7XHJcbiAgICAgICAgdGhpcy5fY2hpbGRFbGVtZW50Wydkb25fdmknXS50ZXh0Q29udGVudCA9IGRvbnZpICsgXCJcIjtcclxuICAgICAgICB0aGlzLl9jaGlsZEVsZW1lbnRbJ3NvX2x1b25nJ10udGV4dENvbnRlbnQgPSBzbCArIFwiXCI7XHJcbiAgICAgICAgdGhpcy5fY2hpbGRFbGVtZW50Wyd0aGFuaHRpZW4nXS50ZXh0Q29udGVudCA9IHRoYW5odGllbiArIFwiXCI7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVWYWx1ZShuYW1lLCB2YWx1ZSkge1xyXG4gICAgICAgIHN3aXRjaCAobmFtZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwibWFfdGh1b2NcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMubWEgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidGVuX3RodW9jXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRlbiA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJkb25fdmlcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZG9udmkgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwic29fbHVvbmdcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuc2wgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidGhhbmhfdGllblwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy50aGFuaHRpZW4gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jaGlsZEVsZW1lbnRbbmFtZV0udGV4dENvbnRlbnQgPSB2YWx1ZTtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5DVEhvYURvbiA9IF9DVEhvYURvbjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Q1RIb2FEb24uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgRG9uVmlfMSA9IHJlcXVpcmUoXCIuL0RvblZpXCIpO1xyXG5jb25zdCBUaHVvY18xID0gcmVxdWlyZShcIi4vVGh1b2NcIik7XHJcbmNvbnN0IE5zeF8xID0gcmVxdWlyZShcIi4vTnN4XCIpO1xyXG5jb25zdCBfQ29udHJvbGxlciA9IGNsYXNzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudExpc3QgPSB7fTtcclxuICAgICAgICB0aGlzLl9ldmVudCA9IHt9O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBuYW1lIG9mIG1vZGVsXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZW5hbWUgdHlwZSBvZiBtb2RlbCAoRG9uVmkgfCBUaHVvYyB8IE5zeClcclxuICAgICAqL1xyXG4gICAgYWRkTW9kZWwobmFtZSwgdHlwZW5hbWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fY29tcG9uZW50TGlzdC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihuYW1lICsgXCIgaXMgZXhpc3RpbmcgbW9kZWxcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBuZXdPYmogPSBudWxsO1xyXG4gICAgICAgIHN3aXRjaCAodHlwZW5hbWUpIHtcclxuICAgICAgICAgICAgY2FzZSBcIkRvblZpXCI6XHJcbiAgICAgICAgICAgICAgICBuZXdPYmogPSBuZXcgRG9uVmlfMS5Eb25WaSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJUaHVvY1wiOlxyXG4gICAgICAgICAgICAgICAgbmV3T2JqID0gbmV3IFRodW9jXzEuVGh1b2MoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiTnN4XCI6XHJcbiAgICAgICAgICAgICAgICBuZXdPYmogPSBuZXcgTnN4XzEuTnN4KCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJ1bmtub3duIHR5cGVuYW1lOiBcIiArIHR5cGVuYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jb21wb25lbnRMaXN0W25hbWVdID0gbmV3T2JqO1xyXG4gICAgICAgIHRoaXMuX2V2ZW50W25hbWVdID0gW107XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb21wb05hbWUgY29tcG9uZW50IG5hbWVcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgY2FsbGJhY2sgZnVuY3Rpb25cclxuICAgICAqIEByZXR1cm4geyhlcnIsIGRhdGEpPT57fX1cclxuICAgICAqL1xyXG4gICAgYWRkVXBkYXRlRnVuYyhjb21wb05hbWUsIGZ1bmMgPSAoZXJyLCBkYXRhKSA9PiB7IH0pIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2V2ZW50Lmhhc093blByb3BlcnR5KGNvbXBvTmFtZSkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJOb3QgZm91bmQgXCIgKyBjb21wb05hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9ldmVudFtjb21wb05hbWVdLnB1c2goZnVuYyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIHVwZGF0ZSBhbGwgbW9kZWwgYW5kIGNhbGwgY2FsbGJhY2sgZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25VcGRhdGVBbGwoKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBjb21wb05hbWUgb2YgT2JqZWN0LmtleXModGhpcy5fY29tcG9uZW50TGlzdCkpIHtcclxuICAgICAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbXBvbmVudExpc3RbY29tcG9OYW1lXS51cGRhdGUoZnVuY3Rpb24gKGVyciwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBmdW5jIG9mIHRoYXQuX2V2ZW50W2NvbXBvTmFtZV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBmdW5jKGVyciwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5Db250cm9sbGVyID0gX0NvbnRyb2xsZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNvbnRyb2xsZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgVGFibGVEYXRhXzEgPSByZXF1aXJlKFwiLi4vVGFibGVEYXRhXCIpO1xyXG5jbGFzcyBCYW5nRG9uVmkgZXh0ZW5kcyBUYWJsZURhdGFfMS5kZWZhdWx0IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fZGJVUkwgPSBcIi9wdWJsaWMvYXBpL2Rvbl92aS9cIjtcclxuICAgIH1cclxuICAgIHVwZGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICB5aWVsZCB0aGlzLmdldERhdGEoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgcm93IG9mIHRoaXMuX2xpc3QpIHtcclxuICAgICAgICAgICAgICAgIGxldCBpZCA9IHJvd1snaWQnXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hcFtpZF0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogcm93LFxyXG4gICAgICAgICAgICAgICAgICAgIHRlbjogcm93Wyd0ZW4nXSxcclxuICAgICAgICAgICAgICAgICAgICBkb252aV9xdXlkb2k6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVzbzogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBxdXlkb2lUZXh0OiBcIsSRxqFuIHbhu4sgY8ahIGLhuqNuXCIsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAobGV0IGlkIG9mIE9iamVjdC5rZXlzKHRoaXMuX21hcCkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBpZENvYmFuID0gdGhpcy5fbWFwW2lkXS5kYXRhWydpZF9xdXlfZG9pJ107XHJcbiAgICAgICAgICAgICAgICBsZXQgaGVzbyA9ICt0aGlzLl9tYXBbaWRdLmRhdGFbJ2hlX3NvX3F1eWRvaSddO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlkQ29iYW4gPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuX21hcFtpZENvYmFuXS5kYXRhWydpZF9xdXlfZG9pJ10gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhlc28gKj0gK3RoaXMuX21hcFtpZENvYmFuXS5kYXRhWydoZV9zb19xdXlkb2knXTtcclxuICAgICAgICAgICAgICAgICAgICBpZENvYmFuID0gdGhpcy5fbWFwW2lkQ29iYW5dLmRhdGFbJ2lkX3F1eV9kb2knXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX21hcFtpZF1bJ2RvbnZpX3F1eWRvaSddID0gdGhpcy5fbWFwW2lkQ29iYW5dO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWFwW2lkXVsnaGVzbyddID0gaGVzbztcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hcFtpZF1bJ3F1eWRvaVRleHQnXSA9IFwiPSBcIiArIGhlc28gKyBcInggW1wiXHJcbiAgICAgICAgICAgICAgICAgICAgKyB0aGlzLl9tYXBbaWRDb2Jhbl0udGVuICsgXCJdXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBCYW5nRG9uVmk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUJhbmdEb25WaS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBNb2RlbF8xID0gcmVxdWlyZShcIi4uL01vZGVsXCIpO1xyXG5jbGFzcyBfRG9uVmkgZXh0ZW5kcyBNb2RlbF8xLk1vZGVsIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fZGF0YWJhc2UgPSBcIi9wdWJsaWMvYXBpL2Rvbl92aS9cIjtcclxuICAgICAgICB0aGlzLl9mZXRjaERhdGEgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5fZ2V0KHt9LCAoZXJyLCBkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghIWVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9mZXRjaERhdGEgPSB0aGlzLl9maWx0ZXIoZGF0YSk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgdGhpcy5fZmV0Y2hEYXRhKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIF9maWx0ZXIocmF3RGF0YSkge1xyXG4gICAgICAgIGxldCBuZXdEYXRhID0gcmF3RGF0YS5zbGljZSgpO1xyXG4gICAgICAgIGxldCBtYXAgPSB7fTtcclxuICAgICAgICBmb3IgKGxldCByb3cgb2YgbmV3RGF0YSkge1xyXG4gICAgICAgICAgICBtYXBbcm93WydpZCddXSA9IHJvdztcclxuICAgICAgICAgICAgbGV0IGhlc28gPSByb3dbJ2hlX3NvX3F1eWRvaSddO1xyXG4gICAgICAgICAgICBpZiAoIWhlc28pIHtcclxuICAgICAgICAgICAgICAgIHJvd1sndGV4dFF1eURvaSddID0gXCLEkcahbiB24buLIGPGoSBi4bqjblwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcm93Wyd0ZXh0UXV5RG9pJ10gPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IHJvdyBvZiBuZXdEYXRhKSB7XHJcbiAgICAgICAgICAgIGxldCBpZF9jb19iYW4gPSByb3dbJ2lkX3F1eV9kb2knXTtcclxuICAgICAgICAgICAgbGV0IGhlc28gPSArcm93WydoZV9zb19xdXlkb2knXTtcclxuICAgICAgICAgICAgaWYgKG1hcC5oYXNPd25Qcm9wZXJ0eShpZF9jb19iYW4pKSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAobWFwLmhhc093blByb3BlcnR5KGlkX2NvX2JhbikpIHtcclxuICAgICAgICAgICAgICAgICAgICByb3dbJ3RleHRRdXlEb2knXSArPSBgPSR7aGVzb314WyR7bWFwW2lkX2NvX2Jhbl1bJ3RlbiddfV1gO1xyXG4gICAgICAgICAgICAgICAgICAgIGhlc28gKj0gK21hcFtpZF9jb19iYW5dWydoZV9zb19xdXlkb2knXTtcclxuICAgICAgICAgICAgICAgICAgICBpZF9jb19iYW4gPSBtYXBbaWRfY29fYmFuXVsnaWRfcXV5X2RvaSddO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXdEYXRhO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuRG9uVmkgPSBfRG9uVmk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IENUSG9hRG9uXzEgPSByZXF1aXJlKFwiLi9DVEhvYURvblwiKTtcclxuLy8gaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcclxuLyoqXHJcbiAqIEjDs2EgxJDGoW4gRm9ybVxyXG4gKi9cclxuY29uc3QgX0hvYURvbkZvcm0gPSBjbGFzcyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLl9kYXRhYmFzZSA9IFwiL3B1YmxpYy9hcGkvaG9hX2Rvbi9cIjtcclxuICAgICAgICBjb25zdCBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaCgvdXNlcm5hbWU9KFxcdyspLyk7XHJcbiAgICAgICAgdGhpcy5fdXNlcm5hbWUgPSBtYXRjaCA/IG1hdGNoWzFdIDogXCJOb3QgRm91bmRcIjtcclxuICAgICAgICB0aGlzLl9saXN0Q1RIRCA9IHt9OyAvL09iamVjdCBiZWNhdXNlIGRhdGEgaGFzIGtleSAnbWFfdGh1b2MnXHJcbiAgICAgICAgdGhpcy5faGVhZGVyRm9ybSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLl9DVEhEVGFibGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5fZ2hpQ2h1ID0gXCJcIjtcclxuICAgIH1cclxuICAgIHNldEhlYWRlcihlbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5faGVhZGVyRm9ybSA9IGVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5faGVhZGVyRm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGlmICghZS50YXJnZXQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGFBcnIgPSAkKGUudGFyZ2V0KS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhT2JqID0ge307XHJcbiAgICAgICAgICAgIGRhdGFBcnIuZm9yRWFjaCgodmFsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkYXRhT2JqW3ZhbC5uYW1lXSA9IHZhbC52YWx1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ1RIRCgrZGF0YU9ialsnbWFfdGh1b2MnXSwgZGF0YU9ialsndGVuX3RodW9jJ10sICtkYXRhT2JqWydzb19sdW9uZyddLCArZGF0YU9ialsnZG9uX3ZpJ10sICtkYXRhT2JqWydjb3N0J10pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc2V0VGFibGUoZWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMuX0NUSERUYWJsZSA9IGVsZW1lbnQ7XHJcbiAgICB9XHJcbiAgICBnZXRVc2VybmFtZSgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLl91c2VybmFtZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VzZXJuYW1lO1xyXG4gICAgfVxyXG4gICAgbmV3SG9hRG9uKCkge1xyXG4gICAgICAgIGZvciAobGV0IGVsIGluIHRoaXMuX2xpc3RDVEhEKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xpc3RDVEhEW2VsXS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGdldCB0b3RhbCBjYXNoIG9mIDEgSG9hRG9uXHJcbiAgICAgKi9cclxuICAgIGdldFRvdGFsQ2FzaCgpIHtcclxuICAgICAgICBsZXQgc3VtID0gMDtcclxuICAgICAgICBmb3IgKGNvbnN0IG1hX3RodW9jIG9mIEFycmF5LmZyb20oT2JqZWN0LmtleXModGhpcy5fbGlzdENUSEQpKSkge1xyXG4gICAgICAgICAgICBjb25zdCBjdGhkID0gdGhpcy5fbGlzdENUSERbbWFfdGh1b2NdO1xyXG4gICAgICAgICAgICBzdW0gKz0gY3RoZC50b3RhbENhc2g7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdW07XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWFfdGh1b2NcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzb2x1b25nXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZG9udmlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbENhc2hcclxuICAgICAqL1xyXG4gICAgYWRkQ1RIRChtYV90aHVvYywgdGVuX3RodW9jLCBzb2x1b25nLCBkb252aSwgdG90YWxDYXNoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2xpc3RDVEhELmhhc093blByb3BlcnR5KG1hX3RodW9jKSkge1xyXG4gICAgICAgICAgICBjb25zdCBuZXdTbCA9IHRoaXMuX2xpc3RDVEhEW21hX3RodW9jXS5zbCArIHNvbHVvbmc7XHJcbiAgICAgICAgICAgIHRoaXMuX2xpc3RDVEhELm1hX3RodW9jLnVwZGF0ZVZhbHVlKCdzb19sdW9uZycsIG5ld1NsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld0NUSEQgPSBuZXcgQ1RIb2FEb25fMS5DVEhvYURvbihtYV90aHVvYywgdGVuX3RodW9jLCBkb252aSwgc29sdW9uZywgdG90YWxDYXNoICogc29sdW9uZyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2xpc3RDVEhEW21hX3RodW9jXSA9IG5ld0NUSEQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHJvd0VsZW1lbnQgPSBuZXdDVEhELmdldFJvd0VsZW1lbnQoKTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9DVEhEVGFibGUgfHwgIXJvd0VsZW1lbnQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuX0NUSERUYWJsZS50Qm9kaWVzWzBdLmluc2VydEJlZm9yZShyb3dFbGVtZW50LCB0aGlzLl9DVEhEVGFibGUudEJvZGllc1swXS5jaGlsZE5vZGVzWzBdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHB1c2hUb0RhdGFiYXNlKHN1Y2Nlc3NDYWxsYmFjaywgZXJyb3JDYWxsYmFjaykge1xyXG4gICAgICAgIGNvbnN0IGhvYURvbkluZm8gPSB7XHJcbiAgICAgICAgICAgIHVzZXJuYW1lOiB0aGlzLl91c2VybmFtZSxcclxuICAgICAgICAgICAgdGltZTogKG5ldyBEYXRlKCkpLmdldFRpbWUoKSxcclxuICAgICAgICAgICAgZ2hpY2h1OiB0aGlzLl9naGlDaHVcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIGhvYV9kb246IGhvYURvbkluZm8sXHJcbiAgICAgICAgICAgIGN0aGQ6IHRoaXMuX2xpc3RDVEhEXHJcbiAgICAgICAgfTtcclxuICAgICAgICAkLmFqYXgodGhpcy5fZGF0YWJhc2UsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHhockZpZWxkczoge1xyXG4gICAgICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRhdGE6IFwiZGF0YT1cIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChqc29uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoISFqc29uLmVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yQ2FsbGJhY2soanNvbi5tc2cpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3NDYWxsYmFjaygpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JDYWxsYmFjayhlcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMuSG9hRG9uRm9ybSA9IF9Ib2FEb25Gb3JtO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Ib2FEb25Gb3JtLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNsYXNzIF9Nb2RlbCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLl9kYXRhYmFzZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5fZGF0YSA9IFtdO1xyXG4gICAgfVxyXG4gICAgZ2V0IGRhdGEoKSB7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX2RhdGEpO1xyXG4gICAgfVxyXG4gICAgZ2V0IHJlc3BvbnNlKCkge1xyXG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9yZXMpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBmZXRjaCBkYXRhIGZyb20gZGF0YWJhc2UgYW5kIGRvIHRoaW5nXHJcbiAgICAgKiBAcGFyYW0gcGFyYW1zXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgY2FsbGJhY2sgZnVuY3Rpb25cclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIF9nZXQocGFyYW1zLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RhdGEgPSBbXTtcclxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdFVSTCA9IHRoaXMuX2RhdGFiYXNlICsgdGhpcy5fdXJscGFyYW1zKHBhcmFtcyk7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSB5aWVsZCBmZXRjaChyZXF1ZXN0VVJMLCB7IGNyZWRlbnRpYWxzOiAnaW5jbHVkZScgfSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBqc29uID0geWllbGQgcmVzLmpzb24oKTtcclxuICAgICAgICAgICAgICAgIGlmIChqc29uLmVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGpzb24ubXNnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kYXRhID0ganNvbi5kYXRhO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UsIGpzb24uZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGRhdGFcclxuICAgICAqIEBwYXJhbSBjYWxsYmFja1xyXG4gICAgICovXHJcbiAgICBfcG9zdChkYXRhLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlcyA9IFwiXCI7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSB5aWVsZCBmZXRjaCh0aGlzLl9kYXRhYmFzZSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgY29uc3QganNvbiA9IHlpZWxkIHJlcy5qc29uKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoanNvbi5lcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhqc29uLm1zZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzID0ganNvbi5kYXRhO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UsIGpzb24uZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgX3VybHBhcmFtcyhwYXJhbXMpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSBPYmplY3Qua2V5cyhwYXJhbXMpLm1hcChmdW5jdGlvbiAoaykge1xyXG4gICAgICAgICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KGspICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtc1trXSk7XHJcbiAgICAgICAgfSkuam9pbignJicpO1xyXG4gICAgICAgIHJldHVybiB1cmw7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5Nb2RlbCA9IF9Nb2RlbDtcclxuO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBNb2RlbF8xID0gcmVxdWlyZShcIi4uL01vZGVsXCIpO1xyXG5jbGFzcyBfTnN4IGV4dGVuZHMgTW9kZWxfMS5Nb2RlbCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2RhdGFiYXNlID0gXCIvcHVibGljL2FwaS9uc3gvXCI7XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoY2FsbGJhY2spIHtcclxuICAgICAgICBsZXQgJHRoaXMgPSB0aGlzO1xyXG4gICAgICAgICR0aGlzLl9nZXQoe30sIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYWxsYmFjayhmYWxzZSwgZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5Oc3ggPSBfTnN4O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vKipcclxuICogRGlzcGxheSBkYXRhIHVuZGVyIHRhYmxlXHJcbiAqL1xyXG5jbGFzcyBUYWJsZURhdGEge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5fbWFwID0ge307XHJcbiAgICAgICAgdGhpcy5fbGlzdCA9IFtdO1xyXG4gICAgICAgIHRoaXMuX2lzQ29ubmVjdCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2Nvbm5lY3RTdGF0dXMgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuX2lzRmV0Y2hlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2RiVVJMID0gXCJcIjtcclxuICAgIH1cclxuICAgIGdldERhdGEoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgbGV0IHJlcyA9IHlpZWxkIGZldGNoKHRoaXMuX2RiVVJMLCB7IG1ldGhvZDogXCJHRVRcIiwgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyB9KTtcclxuICAgICAgICAgICAgaWYgKCFyZXMub2spIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2lzQ29ubmVjdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29ubmVjdFN0YXR1cyA9IHJlcy5zdGF0dXNUZXh0O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2lzQ29ubmVjdCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3RTdGF0dXMgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQganNvbiA9IHlpZWxkIHJlcy5qc29uKCk7XHJcbiAgICAgICAgICAgIGlmICghIWpzb24uZXJyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0ZldGNoZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3RTdGF0dXMgPSBqc29uLm1zZztcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9pc0ZldGNoZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0U3RhdHVzID0gXCJPS1wiO1xyXG4gICAgICAgICAgICB0aGlzLl9saXN0ID0ganNvbi5kYXRhO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIC8vIG5vdGhpbmcgaGVyZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZ2V0IHRhYmxlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXA7XHJcbiAgICB9XHJcbiAgICBnZXQgbGlzdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdDtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBUYWJsZURhdGE7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IE1vZGVsXzEgPSByZXF1aXJlKFwiLi4vTW9kZWxcIik7XHJcbmNsYXNzIF9UaHVvYyBleHRlbmRzIE1vZGVsXzEuTW9kZWwge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9kYXRhYmFzZSA9IFwiL3B1YmxpYy9hcGkvdGh1b2MvXCI7XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoY2FsbGJhY2spIHtcclxuICAgICAgICBsZXQgJHRoaXMgPSB0aGlzO1xyXG4gICAgICAgICR0aGlzLl9nZXQoe30sIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYWxsYmFjayhmYWxzZSwgZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5UaHVvYyA9IF9UaHVvYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY2xhc3MgaW5wdXRQcmV2aWV3MiB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQgPSBkb2N1bWVudCkge1xyXG4gICAgICAgIHRoaXMuX2xpc3QgPSB7fTtcclxuICAgICAgICB0aGlzLl9kYXRhID0gW107XHJcbiAgICAgICAgdGhpcy5fbG9va3VwID0ge307XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgICAgIHRoaXMuX3ByZXZpZXdfZGl2ID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9jdXJyZW50UHJldmlld0RhdGEgPSBbXTtcclxuICAgICAgICAvLyBjb25zdHJ1Y3RvciAgICBcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XHJcbiAgICAgICAgICAgIGlmICghdGFyZ2V0LmNsYXNzTGlzdC5oYXNPd25Qcm9wZXJ0eShcInByZXZpZXctcm93XCIpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVsZXRlUHJldmlldygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBhZGQgbG9va3VwIHRvIGpzb24gbmFtZVxyXG4gICAgICogQHBhcmFtIHt7aWRFbDogU3RyaW5nfX0gYXJyIHsgaWRfZWxlbWVudCA6IG5hbWVfb2ZfZmllbGR9XHJcbiAgICAgKi9cclxuICAgIGFkZExvb2t1cChhcnIpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGFyciAhPSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKE9iamVjdC5jYWxsKGFycikpO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJhbWV0ZXIgbXVzdCBiZSBqc29uIG9ialwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXMoYXJyKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9sb29rdXBba2V5XSA9IGFycltrZXldO1xyXG4gICAgICAgICAgICBsZXQgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChrZXkpO1xyXG4gICAgICAgICAgICBpZiAoIWVsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhFcnJvcihgQ2Fubm90IGZpbmQgIyR7a2V5fSBlbGVtZW50YCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGlzdFtrZXldID0gZWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICA7XHJcbiAgICAvKipcclxuICAgICAqIGFkZCBob3N0IHRvIGZldGNoIGRhdGFiYXNlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIGFzZFxyXG4gICAgICovXHJcbiAgICBhZGREYXRhKGRhdGEpIHtcclxuICAgICAgICBpZiAodHlwZW9mIChkYXRhKSAhPSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInBhcmFtZXRlciBtdXN0IGJlIGpzb25cIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZGF0YSA9IGRhdGE7XHJcbiAgICB9XHJcbiAgICA7XHJcbiAgICBsaXN0ZW4oaWQsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY29kZSA9IGUua2V5Q29kZTtcclxuICAgICAgICAgICAgaWYgKGNvZGUgPT0gMjcpIC8vZXNjXHJcbiAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWxldGVQcmV2aWV3KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY29kZSA9PSAzOCB8fCBjb2RlID09IDQwKSAvL3VwIC1kb3duXHJcbiAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VyID0gK3RoaXMuX3ByZXZpZXdfZGl2LmdldEF0dHJpYnV0ZSgnY3VyJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmV2aWV3X2Rpdi5jaGlsZHJlbltjdXJdXHJcbiAgICAgICAgICAgICAgICAgICAgLmNsYXNzTGlzdC5yZW1vdmUoXCJwcmV2aWV3LXJvdy1hY3RpdmVcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29kZSA9PSAzOClcclxuICAgICAgICAgICAgICAgICAgICAtLWN1cjtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICArK2N1cjtcclxuICAgICAgICAgICAgICAgIGxldCBsZW4gPSB0aGlzLl9wcmV2aWV3X2Rpdi5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VyIDwgMClcclxuICAgICAgICAgICAgICAgICAgICBjdXIgPSBsZW4gLSAxO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1ciA+IGxlbiAtIDEpXHJcbiAgICAgICAgICAgICAgICAgICAgY3VyID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ByZXZpZXdfZGl2LmNoaWxkcmVuW2N1cl1cclxuICAgICAgICAgICAgICAgICAgICAuY2xhc3NMaXN0LmFkZChcInByZXZpZXctcm93LWFjdGl2ZVwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ByZXZpZXdfZGl2LnNldEF0dHJpYnV0ZShcImN1clwiLCBjdXIgKyBcIlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChjb2RlID09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VyID0gK3RoaXMuX3ByZXZpZXdfZGl2LmdldEF0dHJpYnV0ZShcImN1clwiKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRoaXMuX2N1cnJlbnRQcmV2aWV3RGF0YVtjdXJdKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RlbGV0ZVByZXZpZXcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hPbihpZCwgY2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBmZXRjaCBkYXRhYmFzZSBhbmQgc2hvdyBpbiBpbnB1dFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIGlkIG9mIGh0bWwgZWxlbWVudCBpbnB1dCBuZWVkIHRvIGZldGNoIGJ5IHZhbHVlXHJcbiAgICAgKi9cclxuICAgIGZldGNoT24oaWQsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5fZGVsZXRlUHJldmlldygpO1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRQcmV2aWV3RGF0YS5sZW5ndGggPSAwOyAvL2NsZWFyIGN1cnJlbnQgcHJldmlldyBzdWdnZXN0IG5hbWVcclxuICAgICAgICBpZiAodGhpcy5fbGlzdC5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcclxuICAgICAgICAgICAgbGV0IGlucHV0ID0gdGhpcy5fbGlzdFtpZF07XHJcbiAgICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnYXV0b2NvbXBsZXRlJywgJ29mZicpO1xyXG4gICAgICAgICAgICBsZXQgaW5wdXRfcHJldmlldyA9IHRoaXMuX2NyZWF0ZUZseVdyYXAoaW5wdXQpO1xyXG4gICAgICAgICAgICB0aGlzLl9wcmV2aWV3X2RpdiA9IGlucHV0X3ByZXZpZXc7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IGlucHV0LnZhbHVlO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiB0aGlzLl9kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2lzTGlrZShyb3dbdGhpcy5fbG9va3VwW2lkXV0sIHZhbHVlKSlcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRQcmV2aWV3RGF0YS5wdXNoKHJvdyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYXJyID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG5hbWUgaW4gdGhpcy5fbG9va3VwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9sb29rdXBbbmFtZV0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gdGhpcy5fbG9va3VwW25hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKHJvd1tmaWVsZF0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IG5ld1JvdyA9IHRoaXMuX2NyZWF0ZUZseVJvdyhhcnIpO1xyXG4gICAgICAgICAgICAgICAgbmV3Um93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHJvdyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVsZXRlUHJldmlldygpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpbnB1dF9wcmV2aWV3LmFwcGVuZENoaWxkKG5ld1Jvdyk7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGlucHV0X3ByZXZpZXcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImNhbm5vdCBmaW5kIGlkXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIDtcclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtIVE1MRGl2RWxlbWVudH0gZWxlbWVudFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXHJcbiAgICAgKi9cclxuICAgIF9jcmVhdGVGbHlXcmFwKGVsZW1lbnQpIHtcclxuICAgICAgICBpZiAoIWVsZW1lbnQpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIGxldCByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkaXYuY2xhc3NOYW1lID0gXCJwcmV2aWV3LWlucHV0XCI7XHJcbiAgICAgICAgZGl2LnN0eWxlLm1pbldpZHRoID0gcmVjdC53aWR0aCArIFwicHhcIjtcclxuICAgICAgICBkaXYuc3R5bGUudG9wID0gK3JlY3QudG9wICsgcmVjdC5oZWlnaHQgKyBcInB4XCI7XHJcbiAgICAgICAgZGl2LnN0eWxlLmxlZnQgPSArcmVjdC5sZWZ0ICsgXCJweFwiO1xyXG4gICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoXCJjdXJcIiwgXCIwXCIpO1xyXG4gICAgICAgIHJldHVybiBkaXY7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEByZXR1cm4ge3RydWV9IGlmIHN0cjEgbGlrZSBzdHIyXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyMVxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0cjJcclxuICAgICAqL1xyXG4gICAgX2lzTGlrZShzdHIxLCBzdHIyKSB7XHJcbiAgICAgICAgc3RyMSA9IHN0cjEudHJpbSgpO1xyXG4gICAgICAgIHN0cjIgPSBzdHIyLnRyaW0oKTtcclxuICAgICAgICBpZiAoc3RyMSA9PSBcIlwiIHx8IHN0cjIgPT0gXCJcIilcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHN0cjEgPSBzdHIxLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgIHN0cjIgPSBzdHIyLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgIHN0cjEgPSBzdHIxLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgc3RyMiA9IHN0cjIudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBsZXQgcmVnID0gbmV3IFJlZ0V4cChgXi4qJHtzdHIyfS4qJGApO1xyXG4gICAgICAgIHJldHVybiBzdHIxLm1hdGNoKHJlZyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFyclZhbHVlc1xyXG4gICAgICovXHJcbiAgICBfY3JlYXRlRmx5Um93KGFyclZhbHVlcykge1xyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShhcnJWYWx1ZXMpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICByb3cuY2xhc3NOYW1lID0gXCJwcmV2aWV3LXJvd1wiO1xyXG4gICAgICAgIGZvciAobGV0IHZhbHVlIG9mIGFyclZhbHVlcykge1xyXG4gICAgICAgICAgICBsZXQgY29sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgY29sLnN0eWxlLm1hcmdpbiA9IFwiYXV0b1wiO1xyXG4gICAgICAgICAgICBjb2wudGV4dENvbnRlbnQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgcm93LmFwcGVuZENoaWxkKGNvbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByb3c7XHJcbiAgICB9XHJcbiAgICBfZGVsZXRlUHJldmlldygpIHtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnByZXZpZXctaW5wdXRcIikuZm9yRWFjaCgodmFsKSA9PiB7XHJcbiAgICAgICAgICAgIHZhbC5yZW1vdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBpbnB1dFByZXZpZXcyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbnB1dFByZXZpZXcyLmpzLm1hcCIsImNvbnN0IEJhbmdEb25WaSA9IHJlcXVpcmUoJy4uL2FwcC9Eb25WaS9CYW5nRG9uVmknKS5kZWZhdWx0O1xyXG5cclxuZnVuY3Rpb24gZmV0Y2hUb1RhYmxlKGRhdGEpIHtcclxuICAgICQoXCIjbmhhcF9kb25fdmktLXRhYmxlLWJvZHlcIikuY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgICQoJy53aWxsLWJlLXVwZGF0ZScpLnJlbW92ZSgpO1xyXG5cclxuICAgIGZvciAobGV0IGlkIG9mIE9iamVjdC5rZXlzKGRhdGEpKSB7XHJcbiAgICAgICAgbGV0IHRlbiA9IGRhdGFbaWRdWyd0ZW4nXTtcclxuICAgICAgICBsZXQgcXV5ZG9pVGV4dCA9IGRhdGFbaWRdWydxdXlkb2lUZXh0J107XHJcblxyXG4gICAgICAgIGxldCByb3cgPSAkKFwiPHRyLz5cIik7XHJcbiAgICAgICAgcm93LmFwcGVuZCgkKCc8dGQvPicpLnRleHQoaWQpKVxyXG4gICAgICAgICAgICAuYXBwZW5kKCQoJzx0ZC8+JykudGV4dCh0ZW4pKVxyXG4gICAgICAgICAgICAuYXBwZW5kKCQoJzx0ZC8+JykudGV4dChxdXlkb2lUZXh0KSk7XHJcblxyXG4gICAgICAgIGxldCBvcHQgPSAkKCc8b3B0aW9uLz4nKS52YWwoaWQpLnRleHQodGVuKS5hZGRDbGFzcygnd2lsbC1iZS11cGRhdGUnKTtcclxuICAgICAgICAkKFwiI25oYXBfZG9uX3ZpLS1pZF9xdXlfZG9pXCIpLmFwcGVuZChvcHQpO1xyXG4gICAgICAgICQoJyNuaGFwX2Rvbl92aS0tdGFibGUtYm9keScpLmFwcGVuZChyb3cpO1xyXG4gICAgfVxyXG59XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShhc3luYyAoKT0+e1xyXG4gICAgY29uc3QgYmFuZ0RvbnZpID0gbmV3IEJhbmdEb25WaSgpO1xyXG4gICAgYXdhaXQgYmFuZ0RvbnZpLnVwZGF0ZSgpO1xyXG4gICAgZmV0Y2hUb1RhYmxlKGJhbmdEb252aS50YWJsZSk7XHJcblxyXG4gICAgY29uc3QgcG9wdXAgPSBuZXcgU3RhdHVzUG9wdXAoKTtcclxuICAgIHBvcHVwLmNyZWF0ZSgpO1xyXG5cclxuICAgICQoXCIjbmhhcF9kb25fdmktLWZvcm1cIikub24oJ3N1Ym1pdCcsIChlKT0+e1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgY29uc3QgdGVuRG9uVmkgPSAkKCcjbmhhcF9kb25fdmktLXRlbl9kb25fdmknKS52YWwoKTtcclxuICAgICAgICBjb25zdCBpZFF1eURvaSA9ICQoJyNuaGFwX2Rvbl92aS0taWRfcXV5X2RvaScpLnZhbCgpO1xyXG4gICAgICAgIGNvbnN0IGhlU29RdXlEb2kgPSBpZFF1eURvaSA9PSBcIm51bGxcIiA/IDAgOiAkKFwiI25oYXBfZG9uX3ZpLS1oZV9zb19xdXlkb2lcIikudmFsKCk7XHJcblxyXG4gICAgICAgICQuYWpheCgnL2FwaS9hZGREb252aS5waHAnLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgICAgICAgICB4aHJGaWVsZHM6IHtcclxuICAgICAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogJ2luY2x1ZGUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkYXRhOiBgdGVuX2Rvbl92aT0ke3RlbkRvblZpfSZpZF9xdXlfZG9pPSR7aWRRdXlEb2l9JmhlX3NvX3F1eWRvaT0ke2hlU29RdXlEb2l9YCxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oanNvbikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCEhanNvbi5lcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBwb3B1cC5zZXRTdGF0dXMoZmFsc2UsIGpzb24ubXNnKTtcclxuICAgICAgICAgICAgICAgICAgICBwb3B1cC5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHBhcmVudC5wb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgbXNnOiAndXBkYXRlJyxcclxuICAgICAgICAgICAgICAgIH0sIFwiKlwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwb3B1cC5zZXRTdGF0dXModHJ1ZSwganNvbi5tc2cpO1xyXG4gICAgICAgICAgICAgICAgcG9wdXAuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcHVwLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xyXG5cclxuICAgICAgICAgICAgICAgICQoXCIjbmhhcF9kb25fdmktLWZvcm0gaW5wdXRcIikudmFsKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNuaGFwX2Rvbl92aS0taWRfcXV5X2RvaVwiKS52YWwoXCJudWxsXCIpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBwb3B1cC5zZXRTdGF0dXMoZmFsc2UsIGVyci5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgcG9wdXAuc2hvdygpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyBvbiBpbnB1dCBxdXkgZG9pIGRvbiB2aVxyXG4gICAgJCgnI25oYXBfZG9uX3ZpLS1pZF9xdXlfZG9pJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uIENoYW5nZU9uSW5wdXREb25WaShlKSB7XHJcbiAgICAgICAgbGV0IHZhbCA9ICQodGhpcykudmFsKCk7XHJcbiAgICAgICAgJCgnI25oYXBfZG9uX3ZpLS1oZV9zb19xdXlkb2knKS5wcm9wKCdkaXNhYmxlZCcsIHZhbCA9PSAnbnVsbCcpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gdXBkYXRlIGRhdGEgcmVxdWVzdFxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBhc3luYyBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBlLmRhdGE7XHJcbiAgICAgICAgaWYgKGRhdGEubXNnID09ICd1cGRhdGUnKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGJhbmdEb252aS51cGRhdGUoKTtcclxuICAgICAgICAgICAgZmV0Y2hUb1RhYmxlKGJhbmdEb252aS50YWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pO1xyXG4iLCJjb25zdCB7SG9hRG9uRm9ybX0gPSByZXF1aXJlKCcuLi9hcHAvSG9hRG9uRm9ybScpO1xyXG5jb25zdCB7UUxOVH0gPSByZXF1aXJlKCcuLi9hcHAvQXBwJyk7XHJcblxyXG5jb25zdCBob2FEb25Gb3JtID0gbmV3IEhvYURvbkZvcm0oKTtcclxuY29uc3QgQXBwID0gbmV3IFFMTlQoKTtcclxuXHJcbmZ1bmN0aW9uIGRpc3BsYXlUaW1lKCkge1xyXG4gICAgbGV0IG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICAkKFwiI3RpbWUtZGF0ZVwiKS50ZXh0KG5vdy50b0xvY2FsZURhdGVTdHJpbmcoKSk7XHJcbiAgICAkKFwiI3RpbWUtdGltZVwiKS50ZXh0KG5vdy50b0xvY2FsZVRpbWVTdHJpbmcoKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvb3BTaG93VGltZSgpIHtcclxuICAgIHNldEludGVydmFsKCgpPT57XHJcbiAgICAgICAgZGlzcGxheVRpbWUoKTtcclxuICAgIH0sIDEwMDApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaXNwbGF5VXNlcigpIHtcclxuICAgIGxldCB1c2VybmFtZSA9IGhvYURvbkZvcm0uZ2V0VXNlcm5hbWUoKTtcclxuICAgICQoXCIjbmhhcF9ob2FfZG9uLS11c2VybmFtZVwiKS50ZXh0KHVzZXJuYW1lKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZm9jdXNUZW5UaHVvY0ZpcnN0KCkge1xyXG4gICAgJChcIiNuaGFwX2hvYV9kb24tLXRlbi10aHVvY1wiKS5mb2N1cygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVUb25nR2lhKCkge1xyXG4gICAgbGV0IHRvbmcgPSAwO1xyXG4gICAgbGV0IGxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3RoZC1naWEnKTtcclxuICAgIGZvciAobGV0IHZhbCBvZiBsaXN0KSB7XHJcbiAgICAgICAgbGV0IGdpYSA9IHBhcnNlSW50KHZhbC50ZXh0Q29udGVudC5yZXBsYWNlKC9cXEQvLCAnJykpO1xyXG4gICAgICAgIHRvbmcgKz0gZ2lhO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdmFsID0gdG9uZy50b0xvY2FsZVN0cmluZygpKycgVk7EkCc7XHJcblxyXG4gICAgJChcIiNuaGFwX2hvYV9kb24tLXN1bVwiKS5hdHRyKCdjdXJWYWwnLCB2YWwpO1xyXG4gICAgaWYgKCEkKCcja2lldS1saWV1JylbMF0uY2hlY2tlZCkgJCgnI25oYXBfaG9hX2Rvbi0tc3VtJykudmFsKHZhbCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVRpZW5UaG9pKCkge1xyXG4gICAgbGV0IHN1bSA9ICQoXCIjbmhhcF9ob2FfZG9uLS1zdW1cIikudmFsKCkucmVwbGFjZSgvW1xcRFxcc10vZywgJycpO1xyXG4gICAgbGV0IHRpZW5raCA9ICQoXCIjbmhhcF9ob2FfZG9uLS10aWVua2gtdHJhXCIpLnZhbCgpLnJlcGxhY2UoL1tcXERcXHNdL2csICcnKTtcclxuXHJcbiAgICBsZXQgdGllblRob2kgPSBwYXJzZUludCh0aWVua2gpIC0gcGFyc2VJbnQoc3VtKTtcclxuICAgIHRpZW5UaG9pID0gdGllblRob2kgPj0gMCA/IHRpZW5UaG9pLnRvTG9jYWxlU3RyaW5nKCkgOiAnfmxvaSc7XHJcblxyXG4gICAgJChcIiNuaGFwX2hvYV9kb24tLXRob2l0aWVuXCIpLnZhbCh0aWVuVGhvaSk7XHJcbn1cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG4gICAgbG9vcFNob3dUaW1lKCk7XHJcbiAgICBkaXNwbGF5VXNlcigpO1xyXG4gICAgZm9jdXNUZW5UaHVvY0ZpcnN0KCk7XHJcbiAgICBjb25zdCBwb3B1cCA9IG5ldyBTdGF0dXNQb3B1cCgpO1xyXG4gICAgcG9wdXAuY3JlYXRlKCk7XHJcblxyXG4gICAgQXBwLmFkZFNlbGVjdElucHV0KCQoJyNuaGFwX2hvYV9kb24tLWRvbl92aScpWzBdLCB7XHJcbiAgICAgICAgdGl0bGU6ICd0ZW4nLFxyXG4gICAgICAgIHZhbHVlOiAnaWQnLFxyXG4gICAgfSk7XHJcbiAgICBBcHAub25VcGRhdGVBbGwoKTtcclxuXHJcbiAgICBob2FEb25Gb3JtLnNldEhlYWRlcigkKFwiI25oYXBfaG9hX2Rvbi0tZm9ybS1uaGFwXCIpLmdldCgwKSk7XHJcbiAgICBob2FEb25Gb3JtLnNldFRhYmxlKCQoXCIjdGFibGUtbmhhcFwiKS5nZXQoMCkpO1xyXG5cclxuICAgICQoJyNuaGFwX2hvYV9kb24tLXRpZW5raC10cmEnKS5tb25leUlucHV0KCkub24oJ2tleXVwJywgKCk9PntcclxuICAgICAgICB1cGRhdGVUaWVuVGhvaSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnI25oYXBfaG9hX2Rvbi0taG9hZG9uLWZvcm0nKS5zdWJtaXQoKGUpPT57XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBob2FEb25Gb3JtLnB1c2hUb0RhdGFiYXNlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKCcjbmhhcF9ob2FfZG9uLS1ob2Fkb24tZm9ybScpLmZpbmQoJ2lucHV0LCBzZWxlY3QnKS52YWwoJycpO1xyXG4gICAgICAgICAgICAkKCcjbmhhcF9ob2FfZG9uLS1mb3JtLW5oYXAnKS5maW5kKCdpbnB1dCwgc2VsZWN0JykudmFsKCcnKTtcclxuICAgICAgICAgICAgaG9hRG9uRm9ybS5uZXdIb2FEb24oKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coaG9hRG9uRm9ybSk7XHJcbiAgICAgICAgICAgIHBvcHVwLnNldFN0YXR1cyh0cnVlLCBcIk9LXCIpO1xyXG4gICAgICAgICAgICBwb3B1cC5zaG93KCk7XHJcbiAgICAgICAgfSwgKGVycik9PntcclxuICAgICAgICAgICAgcG9wdXAuc2V0U3RhdHVzKGZhbHNlLCBlcnIubWVzc2FnZVRleHQpO1xyXG4gICAgICAgICAgICBwb3B1cC5zaG93KCk7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgQXBwLmFkZE5hbWVJbnB1dFRodW9jKFwibmhhcF9ob2FfZG9uLS10ZW5fdGh1b2NcIiwge1xyXG4gICAgICAgIFwibmhhcF9ob2FfZG9uLS1tYV90aHVvY1wiOiBcIm1hX3RodW9jXCIsXHJcbiAgICAgICAgXCJuaGFwX2hvYV9kb24tLXRlbl90aHVvY1wiOiBcInRlbl90aHVvY1wiLFxyXG4gICAgICAgIFwibmhhcF9ob2FfZG9uLS1kb25fdmlcIjogXCJ0ZW5fZG9uX3ZpXCIsXHJcbiAgICAgICAgXCJuaGFwX2hvYV9kb24tLWNvc3RcIjogXCJkb25fZ2lhXCIsXHJcbiAgICB9LCB7XHJcbiAgICAgICAgXCJuaGFwX2hvYV9kb24tLXRlbl90aHVvY1wiOiBcInRlbl90aHVvY1wiLFxyXG4gICAgICAgIFwibmhhcF9ob2FfZG9uLS1tYV90aHVvY1wiOiBcIm1hX3RodW9jXCIsXHJcbiAgICAgICAgXCJuaGFwX2hvYV9kb24tLWRvbl92aVwiOiBcImlkX2Rvbl92aVwiLFxyXG4gICAgICAgIFwibmhhcF9ob2FfZG9uLS1jb3N0XCI6IFwiZG9uX2dpYVwiLFxyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNuaGFwX2hvYV9kb24tLWZvcm0tbmhhcFwiKS5vbignc3VibWl0JywgKGUpPT57XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICQoXCIjbmhhcF9ob2FfZG9uLS1mb3JtLW5oYXBcIikuZmluZCgnaW5wdXQsIHNlbGVjdCcpLnZhbCgnJyk7XHJcbiAgICAgICAgdXBkYXRlVG9uZ0dpYSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIiNraWV1LWxpZXVcIikuY2xpY2soKCkgPT4ge1xyXG4gICAgICAgICQoJyNuaGFwX2hvYV9kb24tLXN1bScpLnZhbCg4MDAwKTtcclxuICAgIH0pO1xyXG4gICAgJCgnI2tpZXUtYmFubGUnKS5jbGljaygoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc3VtID0gJCgnI3N1bScpO1xyXG4gICAgICAgIGNvbnN0IHZhbCA9IHN1bS5hdHRyKCdjdXJWYWwnKTtcclxuICAgICAgICBzdW0udmFsKHZhbCk7XHJcbiAgICB9KTtcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbn0pO1xyXG4iLCJjb25zdCB7TnN4fSA9IHJlcXVpcmUoJy4uL2FwcC9Oc3gnKTtcblxuJChkb2N1bWVudCkucmVhZHkoKCk9PntcbiAgICBjb25zdCBwb3B1cCA9IG5ldyBTdGF0dXNQb3B1cCgpO1xuICAgIGNvbnN0IG5zeCA9IG5ldyBOc3goKTtcblxuICAgIHBvcHVwLmNyZWF0ZSgpO1xuICAgIHVwZGF0ZU5TWCgpO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlVGFibGVSb3codmFsKSB7XG4gICAgICAgIGxldCByb3cgPSAkKFwiPHRyLz5cIik7XG4gICAgICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyh2YWwpKSB7XG4gICAgICAgICAgICByb3cuYXBwZW5kKCQoJzx0ZC8+JykudGV4dCh2YWxba2V5XSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByb3c7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlTlNYKCkge1xuICAgICAgICAkKCcjdGFibGUtYm9keScpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XG4gICAgICAgIG5zeC51cGRhdGUoKGVyciwgZGF0YSk9PntcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IHJvdyBvZiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgJChcIiN0YWJsZS1ib2R5XCIpLmFwcGVuZChjcmVhdGVUYWJsZVJvdyhyb3cpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgJChcIiNmb3JtXCIpLm9uKCdzdWJtaXQnLCAoZSk9PntcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICQuYWpheCgnL3B1YmxpYy9hcGkvbnN4LycsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICAgICAgeGhyRmllbGRzOiB7XG4gICAgICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiAnaW5jbHVkZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGF0YTogJChcIiNmb3JtXCIpLnNlcmlhbGl6ZSgpLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oanNvbikge1xuICAgICAgICAgICAgICAgIGlmICghIWpzb24uZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvcHVwLnNldFN0YXR1cyhmYWxzZSwganNvbi5tc2cpO1xuICAgICAgICAgICAgICAgICAgICBwb3B1cC5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBwb3B1cC5zZXRTdGF0dXModHJ1ZSwganNvbi5tc2cpO1xuICAgICAgICAgICAgICAgIHBvcHVwLnNob3coKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICAgICAgICAgICAgICAgIHBvcHVwLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcblxuICAgICAgICAgICAgICAgICQoXCJpbnB1dCwgdGV4dGFyZWFcIikudmFsKFwiXCIpO1xuXG4gICAgICAgICAgICAgICAgcGFyZW50LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgbXNnOiAndXBkYXRlJyxcbiAgICAgICAgICAgICAgICB9LCAnKicpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICBwb3B1cC5zZXRTdGF0dXMoZmFsc2UsIGVyci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIHBvcHVwLnNob3coKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIHVwZGF0ZSBkYXRhIHJlcXVlc3RcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgbGV0IGRhdGEgPSBlLmRhdGE7XG4gICAgICAgIGlmIChkYXRhLm1zZyA9PSAndXBkYXRlJykge1xuICAgICAgICAgICAgdXBkYXRlTlNYKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuIiwiY29uc3QgSW5wdXRQcmV2aWV3MiA9IHJlcXVpcmUoJy4uL2FwcC9pbnB1dFByZXZpZXcyJykuZGVmYXVsdDtcclxuY29uc3Qge0RvblZpfSA9IHJlcXVpcmUoJy4uL2FwcC9Eb25WaScpO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgcG9wdXAgPSBuZXcgU3RhdHVzUG9wdXAoKTtcclxuICAgIHBvcHVwLmNyZWF0ZSgpO1xyXG5cclxuICAgIGNvbnN0IHByZXZpZXcgPSBuZXcgSW5wdXRQcmV2aWV3MigpO1xyXG4gICAgY29uc3QgZG9uVmkgPSBuZXcgRG9uVmkoKTtcclxuXHJcbiAgICBwcmV2aWV3LmFkZExvb2t1cCh7XHJcbiAgICAgICAgXCJ0ZW5fbnN4XCI6IFwidGVuXCIsXHJcbiAgICB9KTtcclxuICAgIHByZXZpZXcubGlzdGVuKFwidGVuX25zeFwiLCAoZGF0YSk9PntcclxuICAgICAgICAkKFwiI3Rlbl9uc3hcIikudmFsKGRhdGFbXCJ0ZW5cIl0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlTlNYKCkge1xyXG4gICAgICAgIC8vIGFzZFxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZURvbnZpKCkge1xyXG4gICAgICAgICQoXCIjZG9uX3ZpXCIpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XHJcbiAgICAgICAgZG9uVmkudXBkYXRlKChlcnIsIGRhdGEpPT57XHJcbiAgICAgICAgICAgIGlmIChlcnIpIGNvbnNvbGUubG9nKGpzb24ubXNnKTtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCByb3cgb2YgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gcm93Wyd0ZW4nXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaWQgPSByb3dbJ2lkJ107XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld09wdCA9ICQoXCI8b3B0aW9uLz5cIikudmFsKGlkKS50ZXh0KG5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkKFwiI2Rvbl92aVwiKS5hcHBlbmQobmV3T3B0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICQoXCIjZG9uX3ZpXCIpLmZpbmQoXCJvcHRpb246Zmlyc3QtY2hpbGRcIikuYXR0cihcInNlbGVjdGVkXCIsIFwiXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgJChcIiNkb25fZ2lhXCIpLm1vbmV5SW5wdXQoKTtcclxuICAgIHVwZGF0ZU5TWCgpO1xyXG4gICAgdXBkYXRlRG9udmkoKTtcclxuXHJcblxyXG4gICAgJChcIiNmb3JtXCIpLm9uKCdzdWJtaXQnLCAoZSk9PntcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICB1cmw6IFwiL3B1YmxpYy9hcGkvdGh1b2MvXCIsXHJcbiAgICAgICAgICAgIGRhdGE6ICQoXCIjZm9ybVwiKS5zZXJpYWxpemUoKSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxyXG4gICAgICAgICAgICB4aHJGaWVsZHM6IHtcclxuICAgICAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZSwgLy8gZm9yIHNlc3Npb24gY29va2llXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChqc29uKT0+e1xyXG4gICAgICAgICAgICAgICAgaWYgKCEhanNvbi5lcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBwb3B1cC5zZXRTdGF0dXMoZmFsc2UsIGpzb24ubXNnKTtcclxuICAgICAgICAgICAgICAgICAgICBwb3B1cC5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1Bvc3QgZmFpbGVkOiAnLCBqc29uLm1zZyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcHVwLnNldFN0YXR1cyh0cnVlLCAnVGjDqm0gdGjDoG5oIGPDtG5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9wdXAuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCAxMDAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3N1Y2Nlc3MnKTtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiaW5wdXRcIikudmFsKFwiXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQucG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtc2c6ICd1cGRhdGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sICcqJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiAoZXJyKT0+e1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIHVwZGF0ZSBkYXRhIHJlcXVlc3RcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGxldCBkYXRhID0gZS5kYXRhO1xyXG4gICAgICAgIGlmIChkYXRhLm1zZyA9PSAndXBkYXRlJykge1xyXG4gICAgICAgICAgICB1cGRhdGVOU1goKTtcclxuICAgICAgICAgICAgdXBkYXRlRG9udmkoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBzaG9ydGN1dCBrZXkgZXZlbnRcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSk9PntcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm5oYXAgdGh1b2M6IFwiLCBlLmtleUNvZGUpO1xyXG4gICAgICAgIHBhcmVudC5wb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgICAgIG1zZzogJ3Nob3J0Y3V0X2tleScsXHJcbiAgICAgICAgICAgIGtleTogZS5rZXlDb2RlLFxyXG4gICAgICAgICAgICBzaGlmdDogZS5zaGlmdEtleSxcclxuICAgICAgICB9LCBcIipcIik7XHJcbiAgICB9KTtcclxufSk7XHJcbiJdfQ==
