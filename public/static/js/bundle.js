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

},{"./Controller":4,"./inputPreview2":14}],3:[function(require,module,exports){
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
            this._componentList[compoName].update(function (err, data) {
                for (const func of that._event[compoName]) {
                    func(err, data);
                }
            });
        }
    }
};
exports.Controller = _Controller;

},{"./Model/DonVi":8,"./Model/Nsx":10,"./Model/Thuoc":13}],5:[function(require,module,exports){
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

},{"../TableData":11}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModelClass_1 = require("../ModelClass");
class _DonVi extends ModelClass_1.Model {
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

},{"../ModelClass":9}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModelClass_1 = require("../ModelClass");
class _Nsx extends ModelClass_1.Model {
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

},{"../ModelClass":9}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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
        this._dbURL = "/public/api/thuoc/";
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

},{"../TableData":11}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModelClass_1 = require("../ModelClass");
const BangThuoc_1 = require("./BangThuoc");
exports.BangThuoc = BangThuoc_1.BangThuoc;
class _Thuoc extends ModelClass_1.Model {
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

},{"../ModelClass":9,"./BangThuoc":12}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
const BangDonVi = require('../app/Model/DonVi/BangDonVi').default;
const {BootstrapModal} = require('../app/Model/BoostrapModal');

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

    const popup = new BootstrapModal('nhap_don_vi--popup');
    popup.setTitle('Nhap Don Vi');

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
                    popup.setContent(json.err);
                    popup.open();
                    return;
                }

                popup.setContent(json.data);
                popup.open();
                setTimeout(()=>{
                    popup.close();
                }, 1000);

                $("#nhap_don_vi--form input").val("");
                $("#nhap_don_vi--id_quy_doi").val("null");
            },
            error: function(err) {
                popup.setContent(err);
                popup.open();
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

},{"../app/Model/BoostrapModal":6,"../app/Model/DonVi/BangDonVi":7}],16:[function(require,module,exports){
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

},{"../../config":1,"../app/App":2,"../app/HoaDonForm":5,"../app/Model/BoostrapModal":6}],17:[function(require,module,exports){
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

},{"../app/Model/Nsx":10}],18:[function(require,module,exports){
const {Thuoc, BangThuoc} = require('../app/Model/Thuoc');
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
                <td>${row.ma_thuoc}</td>
                <td>${row.ten_thuoc}</td>
                <td>${row.ten_nsx}</td>
                <td>${priceString}</td>
                <td>${row.so_luong}</td>
            `);
            table.append(tr);
        }
    }

    updateTable();
});

},{"../app/Model/Thuoc":13}]},{},[15,16,17,18])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb25maWcvaW5kZXguanMiLCJzcmMvYXBwL0FwcC5qcyIsInNyYy9hcHAvQ1RIb2FEb24uanMiLCJzcmMvYXBwL0NvbnRyb2xsZXIuanMiLCJzcmMvYXBwL0hvYURvbkZvcm0uanMiLCJzcmMvYXBwL01vZGVsL0Jvb3N0cmFwTW9kYWwvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL0RvblZpL0JhbmdEb25WaS5qcyIsInNyYy9hcHAvTW9kZWwvRG9uVmkvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL01vZGVsQ2xhc3MvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL05zeC9pbmRleC5qcyIsInNyYy9hcHAvTW9kZWwvVGFibGVEYXRhL2luZGV4LmpzIiwic3JjL2FwcC9Nb2RlbC9UaHVvYy9CYW5nVGh1b2MuanMiLCJzcmMvYXBwL01vZGVsL1RodW9jL2luZGV4LmpzIiwic3JjL2FwcC9pbnB1dFByZXZpZXcyLmpzIiwic3JjL3NjcmlwdC9uaGFwLWRvbi12aS5qcyIsInNyYy9zY3JpcHQvbmhhcC1ob2EtZG9uLmpzIiwic3JjL3NjcmlwdC9uaGFwLW5zeC5qcyIsInNyYy9zY3JpcHQvbmhhcC10aHVvYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBcIkdJQV9CQU5fVEhFT19MSUVVXCI6IDgwMDAsXG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgQ29udHJvbGxlcl8xID0gcmVxdWlyZShcIi4vQ29udHJvbGxlclwiKTtcclxuY29uc3QgaW5wdXRQcmV2aWV3Ml8xID0gcmVxdWlyZShcIi4vaW5wdXRQcmV2aWV3MlwiKTtcclxuY29uc3QgX1FMTlQgPSBjbGFzcyBleHRlbmRzIENvbnRyb2xsZXJfMS5Db250cm9sbGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5hZGRNb2RlbCgnRG9uVmknLCAnRG9uVmknKTtcclxuICAgICAgICB0aGlzLmFkZE1vZGVsKCdUaHVvYycsICdUaHVvYycpO1xyXG4gICAgICAgIHRoaXMuYWRkTW9kZWwoJ05zeCcsICdOc3gnKTtcclxuICAgIH1cclxuICAgIGFkZFRhYmxlKGVsZW1lbnQpIHtcclxuICAgICAgICBsZXQgbmFtZVRIcyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcInRoXCIpO1xyXG4gICAgICAgIGxldCBjb21wb05hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnY29tcG9uZW50Jyk7XHJcbiAgICAgICAgY29uc3QgbG9va05hbWUgPSBBcnJheS5mcm9tKG5hbWVUSHMpXHJcbiAgICAgICAgICAgIC5tYXAoKHZhbCkgPT4gdmFsLmdldEF0dHJpYnV0ZSgnZm9yJykpO1xyXG4gICAgICAgIGNvbnN0IHVwZGF0ZVRhYmxlID0gZnVuY3Rpb24gKGVyciwgZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZXJyKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBsZXQgYm9keSA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcigndGJvZHknKTtcclxuICAgICAgICAgICAgLy8gZGVsZXRlIG9sZCByb3dcclxuICAgICAgICAgICAgbGV0IHRyYm9keSA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGJvZHkgdHInKTtcclxuICAgICAgICAgICAgaWYgKHRyYm9keSAmJiB0cmJvZHkubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBlbCBvZiB0cmJvZHkpXHJcbiAgICAgICAgICAgICAgICAgICAgZWwucmVtb3ZlQ2hpbGQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyB1cGRhdGEgbmV3IHJvd1xyXG4gICAgICAgICAgICBmb3IgKGxldCByb3cgb2YgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJvd0VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IG5hbWUgb2YgbG9va05hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3VEQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld1RELnRleHRDb250ZW50ID0gcm93W25hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgIHJvd0VsLmFwcGVuZENoaWxkKG5ld1REKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJvZHkuYXBwZW5kQ2hpbGQocm93RWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmFkZFVwZGF0ZUZ1bmMoY29tcG9OYW1lLCB1cGRhdGVUYWJsZSk7XHJcbiAgICB9XHJcbiAgICBhZGROYW1lSW5wdXRUaHVvYyhpZEVsZW1lbnQsIG9wdExpc3Rlbiwgb3B0Q2hhbmdlKSB7XHJcbiAgICAgICAgY29uc3QgcHJldmlldyA9IG5ldyBpbnB1dFByZXZpZXcyXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIHByZXZpZXcuYWRkTG9va3VwKG9wdExpc3Rlbik7XHJcbiAgICAgICAgcHJldmlldy5saXN0ZW4oaWRFbGVtZW50LCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpZEVsIGluIG9wdENoYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFvcHRDaGFuZ2UuaGFzT3duUHJvcGVydHkoaWRFbCkpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAkKCcjJyArIGlkRWwpLnZhbChkYXRhW29wdENoYW5nZVtpZEVsXV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3Qgb25VcGRhdGUgPSBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJldmlldy5hZGREYXRhKGRhdGEpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5hZGRVcGRhdGVGdW5jKCdUaHVvYycsIG9uVXBkYXRlKTtcclxuICAgIH1cclxuICAgIGFkZFNlbGVjdElucHV0KGVsZW1lbnQsIG9wdCkge1xyXG4gICAgICAgIGxldCB2YWx1ZUtleSA9IG9wdC52YWx1ZTtcclxuICAgICAgICBsZXQgdGl0bGVLZXkgPSBvcHQudGl0bGU7XHJcbiAgICAgICAgbGV0IGNvbXBvTmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjb21wb25lbnQnKTtcclxuICAgICAgICBjb25zdCBvblVwZGF0ZSA9IGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyByZW1vdmUgb2xkIG9wdGlvbnNcclxuICAgICAgICAgICAgbGV0IG9sZE9wdCA9IGVsZW1lbnQuY2hpbGROb2RlcztcclxuICAgICAgICAgICAgaWYgKG9sZE9wdC5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICBvbGRPcHQuZm9yRWFjaCgodmFsKSA9PiB2YWwucmVtb3ZlKCkpO1xyXG4gICAgICAgICAgICAvLyBhZGQgdXBkYXRlZCBvcHRpb25cclxuICAgICAgICAgICAgZm9yIChsZXQgcm93IG9mIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHJvd1t2YWx1ZUtleV07XHJcbiAgICAgICAgICAgICAgICBsZXQgdGl0bGUgPSByb3dbdGl0bGVLZXldO1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld09wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICAgICAgICAgICAgICBuZXdPcHQudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIG5ld09wdC50ZXh0Q29udGVudCA9IHRpdGxlO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChuZXdPcHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmFkZFVwZGF0ZUZ1bmMoY29tcG9OYW1lLCBvblVwZGF0ZSk7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMuUUxOVCA9IF9RTE5UO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1BcHAuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgX0NUSG9hRG9uID0gY2xhc3Mge1xyXG4gICAgY29uc3RydWN0b3IobWEgPSAtMSwgdGVuID0gXCJcIiwgZG9udmkgPSAtMSwgc2wgPSAwLCB0aGFuaHRpZW4gPSAwKSB7XHJcbiAgICAgICAgdGhpcy5tYSA9IG1hO1xyXG4gICAgICAgIHRoaXMudGVuID0gdGVuO1xyXG4gICAgICAgIHRoaXMuZG9udmkgPSBkb252aTtcclxuICAgICAgICB0aGlzLnNsID0gc2w7XHJcbiAgICAgICAgdGhpcy50aGFuaHRpZW4gPSB0aGFuaHRpZW47XHJcbiAgICAgICAgdGhpcy5fY2hpbGRFbGVtZW50ID0ge307XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVBbGxWYWx1ZShtYSwgdGVuLCBkb252aSwgc2wsIHRoYW5odGllbik7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGNyZWF0ZSByb3cgZWxlbWVudCBmb3IgdGFibGVcclxuICAgICAqL1xyXG4gICAgY3JlYXRlRWxlbWVudCgpIHtcclxuICAgICAgICB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcclxuICAgICAgICBjb25zdCBtYVREID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcclxuICAgICAgICBjb25zdCB0ZW5URCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcbiAgICAgICAgY29uc3QgZG9udmlURCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcbiAgICAgICAgY29uc3Qgc2xURCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcbiAgICAgICAgY29uc3QgdGllblREID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcclxuICAgICAgICBtYVRELmNsYXNzTGlzdC5hZGQoJ2N0aGQtbXRodW9jJyk7XHJcbiAgICAgICAgdGVuVEQuY2xhc3NMaXN0LmFkZCgnY3RoZC10dGh1b2MnKTtcclxuICAgICAgICBkb252aVRELmNsYXNzTGlzdC5hZGQoJ2N0aGQtZG9udmknKTtcclxuICAgICAgICBzbFRELmNsYXNzTGlzdC5hZGQoJ2N0aGQtc2wnKTtcclxuICAgICAgICB0aWVuVEQuY2xhc3NMaXN0LmFkZCgnY3RoZC1naWEnKTtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LmFwcGVuZENoaWxkKG1hVEQpO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGVuVEQpO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9udmlURCk7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZChzbFREKTtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LmFwcGVuZENoaWxkKHRpZW5URCk7XHJcbiAgICAgICAgdGhpcy5fY2hpbGRFbGVtZW50ID0ge1xyXG4gICAgICAgICAgICBcIm1hX3RodW9jXCI6IG1hVEQsXHJcbiAgICAgICAgICAgIFwidGVuX3RodW9jXCI6IHRlblRELFxyXG4gICAgICAgICAgICBcImRvbl92aVwiOiBkb252aVRELFxyXG4gICAgICAgICAgICBcInNvX2x1b25nXCI6IHNsVEQsXHJcbiAgICAgICAgICAgIFwidGhhbmh0aWVuXCI6IHRpZW5URFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBnZXRSb3dFbGVtZW50KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICByZW1vdmUoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9lbGVtZW50KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5fZWxlbWVudC5wYXJlbnROb2RlO1xyXG4gICAgICAgIGlmIChwYXJlbnQpXHJcbiAgICAgICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLl9lbGVtZW50KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogZ2V0IGpzb24gZGF0YSBmb3IgcG9zdCBmb3JtXHJcbiAgICAgKi9cclxuICAgIGdldERhdGFKU09OKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICdtYV90aHVvYyc6IHRoaXMubWEsXHJcbiAgICAgICAgICAgICd0ZW5fdGh1b2MnOiB0aGlzLnRlbixcclxuICAgICAgICAgICAgJ2Rvbl92aSc6IHRoaXMuZG9udmksXHJcbiAgICAgICAgICAgICdzb19sdW9uZyc6IHRoaXMuc2xcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG1hXHJcbiAgICAgKiBAcGFyYW0gdGVuXHJcbiAgICAgKiBAcGFyYW0gZG9udmlcclxuICAgICAqIEBwYXJhbSBzbFxyXG4gICAgICogQHBhcmFtIHRoYW5odGllblxyXG4gICAgICovXHJcbiAgICB1cGRhdGVBbGxWYWx1ZShtYSwgdGVuLCBkb252aSwgc2wsIHRoYW5odGllbikge1xyXG4gICAgICAgIHRoaXMubWEgPSBtYTtcclxuICAgICAgICB0aGlzLnRlbiA9IHRlbjtcclxuICAgICAgICB0aGlzLmRvbnZpID0gZG9udmk7XHJcbiAgICAgICAgdGhpcy5zbCA9IHNsO1xyXG4gICAgICAgIHRoaXMudGhhbmh0aWVuID0gdGhhbmh0aWVuO1xyXG4gICAgICAgIHRoaXMuX2NoaWxkRWxlbWVudFsnbWFfdGh1b2MnXS50ZXh0Q29udGVudCA9IG1hICsgXCJcIjtcclxuICAgICAgICB0aGlzLl9jaGlsZEVsZW1lbnRbJ3Rlbl90aHVvYyddLnRleHRDb250ZW50ID0gdGVuICsgXCJcIjtcclxuICAgICAgICB0aGlzLl9jaGlsZEVsZW1lbnRbJ2Rvbl92aSddLnRleHRDb250ZW50ID0gZG9udmkgKyBcIlwiO1xyXG4gICAgICAgIHRoaXMuX2NoaWxkRWxlbWVudFsnc29fbHVvbmcnXS50ZXh0Q29udGVudCA9IHNsICsgXCJcIjtcclxuICAgICAgICB0aGlzLl9jaGlsZEVsZW1lbnRbJ3RoYW5odGllbiddLnRleHRDb250ZW50ID0gdGhhbmh0aWVuICsgXCJcIjtcclxuICAgIH1cclxuICAgIHVwZGF0ZVZhbHVlKG5hbWUsIHZhbHVlKSB7XHJcbiAgICAgICAgc3dpdGNoIChuYW1lKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJtYV90aHVvY1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5tYSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ0ZW5fdGh1b2NcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMudGVuID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImRvbl92aVwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5kb252aSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzb19sdW9uZ1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zbCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ0aGFuaF90aWVuXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRoYW5odGllbiA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2NoaWxkRWxlbWVudFtuYW1lXS50ZXh0Q29udGVudCA9IHZhbHVlO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnRzLkNUSG9hRG9uID0gX0NUSG9hRG9uO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1DVEhvYURvbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBEb25WaV8xID0gcmVxdWlyZShcIi4vTW9kZWwvRG9uVmlcIik7XHJcbmNvbnN0IFRodW9jXzEgPSByZXF1aXJlKFwiLi9Nb2RlbC9UaHVvY1wiKTtcclxuY29uc3QgTnN4XzEgPSByZXF1aXJlKFwiLi9Nb2RlbC9Oc3hcIik7XHJcbmNvbnN0IF9Db250cm9sbGVyID0gY2xhc3Mge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50TGlzdCA9IHt9O1xyXG4gICAgICAgIHRoaXMuX2V2ZW50ID0ge307XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIG5hbWUgb2YgbW9kZWxcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlbmFtZSB0eXBlIG9mIG1vZGVsIChEb25WaSB8IFRodW9jIHwgTnN4KVxyXG4gICAgICovXHJcbiAgICBhZGRNb2RlbChuYW1lLCB0eXBlbmFtZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jb21wb25lbnRMaXN0Lmhhc093blByb3BlcnR5KG5hbWUpKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKG5hbWUgKyBcIiBpcyBleGlzdGluZyBtb2RlbFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IG5ld09iaiA9IG51bGw7XHJcbiAgICAgICAgc3dpdGNoICh0eXBlbmFtZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiRG9uVmlcIjpcclxuICAgICAgICAgICAgICAgIG5ld09iaiA9IG5ldyBEb25WaV8xLkRvblZpKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlRodW9jXCI6XHJcbiAgICAgICAgICAgICAgICBuZXdPYmogPSBuZXcgVGh1b2NfMS5UaHVvYygpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJOc3hcIjpcclxuICAgICAgICAgICAgICAgIG5ld09iaiA9IG5ldyBOc3hfMS5Oc3goKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcInVua25vd24gdHlwZW5hbWU6IFwiICsgdHlwZW5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudExpc3RbbmFtZV0gPSBuZXdPYmo7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRbbmFtZV0gPSBbXTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNvbXBvTmFtZSBjb21wb25lbnQgbmFtZVxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBjYWxsYmFjayBmdW5jdGlvblxyXG4gICAgICogQHJldHVybiB7KGVyciwgZGF0YSk9Pnt9fVxyXG4gICAgICovXHJcbiAgICBhZGRVcGRhdGVGdW5jKGNvbXBvTmFtZSwgZnVuYyA9IChlcnIsIGRhdGEpID0+IHsgfSkge1xyXG4gICAgICAgIGlmICghdGhpcy5fZXZlbnQuaGFzT3duUHJvcGVydHkoY29tcG9OYW1lKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vdCBmb3VuZCBcIiArIGNvbXBvTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2V2ZW50W2NvbXBvTmFtZV0ucHVzaChmdW5jKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogdXBkYXRlIGFsbCBtb2RlbCBhbmQgY2FsbCBjYWxsYmFjayBldmVudFxyXG4gICAgICovXHJcbiAgICBvblVwZGF0ZUFsbCgpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGNvbXBvTmFtZSBvZiBPYmplY3Qua2V5cyh0aGlzLl9jb21wb25lbnRMaXN0KSkge1xyXG4gICAgICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50TGlzdFtjb21wb05hbWVdLnVwZGF0ZShmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGZ1bmMgb2YgdGhhdC5fZXZlbnRbY29tcG9OYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmMoZXJyLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5leHBvcnRzLkNvbnRyb2xsZXIgPSBfQ29udHJvbGxlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Q29udHJvbGxlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBDVEhvYURvbl8xID0gcmVxdWlyZShcIi4vQ1RIb2FEb25cIik7XHJcbi8vIGltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XHJcbi8qKlxyXG4gKiBIw7NhIMSQxqFuIEZvcm1cclxuICovXHJcbmNvbnN0IF9Ib2FEb25Gb3JtID0gY2xhc3Mge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5fZGF0YWJhc2UgPSBcIi9wdWJsaWMvYXBpL2hvYV9kb24vXCI7XHJcbiAgICAgICAgY29uc3QgbWF0Y2ggPSBkb2N1bWVudC5jb29raWUubWF0Y2goL3VzZXJuYW1lPShcXHcrKS8pO1xyXG4gICAgICAgIHRoaXMuX3VzZXJuYW1lID0gbWF0Y2ggPyBtYXRjaFsxXSA6IFwiTm90IEZvdW5kXCI7XHJcbiAgICAgICAgdGhpcy5fbGlzdENUSEQgPSB7fTsgLy9PYmplY3QgYmVjYXVzZSBkYXRhIGhhcyBrZXkgJ21hX3RodW9jJ1xyXG4gICAgICAgIHRoaXMuX2hlYWRlckZvcm0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5fQ1RIRFRhYmxlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuX2doaUNodSA9IFwiXCI7XHJcbiAgICB9XHJcbiAgICBzZXRIZWFkZXIoZWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMuX2hlYWRlckZvcm0gPSBlbGVtZW50O1xyXG4gICAgICAgIHRoaXMuX2hlYWRlckZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGUpID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBpZiAoIWUudGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhQXJyID0gJChlLnRhcmdldCkuc2VyaWFsaXplQXJyYXkoKTtcclxuICAgICAgICAgICAgY29uc3QgZGF0YU9iaiA9IHt9O1xyXG4gICAgICAgICAgICBkYXRhQXJyLmZvckVhY2goKHZhbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGF0YU9ialt2YWwubmFtZV0gPSB2YWwudmFsdWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmFkZENUSEQoK2RhdGFPYmpbJ21hX3RodW9jJ10sIGRhdGFPYmpbJ3Rlbl90aHVvYyddLCArZGF0YU9ialsnc29fbHVvbmcnXSwgK2RhdGFPYmpbJ2Rvbl92aSddLCArZGF0YU9ialsnY29zdCddKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHNldFRhYmxlKGVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLl9DVEhEVGFibGUgPSBlbGVtZW50O1xyXG4gICAgfVxyXG4gICAgZ2V0VXNlcm5hbWUoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5fdXNlcm5hbWUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl91c2VybmFtZTtcclxuICAgIH1cclxuICAgIG5ld0hvYURvbigpIHtcclxuICAgICAgICBmb3IgKGxldCBlbCBpbiB0aGlzLl9saXN0Q1RIRCkge1xyXG4gICAgICAgICAgICB0aGlzLl9saXN0Q1RIRFtlbF0ucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBnZXQgdG90YWwgY2FzaCBvZiAxIEhvYURvblxyXG4gICAgICovXHJcbiAgICBnZXRUb3RhbENhc2goKSB7XHJcbiAgICAgICAgbGV0IHN1bSA9IDA7XHJcbiAgICAgICAgZm9yIChjb25zdCBtYV90aHVvYyBvZiBBcnJheS5mcm9tKE9iamVjdC5rZXlzKHRoaXMuX2xpc3RDVEhEKSkpIHtcclxuICAgICAgICAgICAgY29uc3QgY3RoZCA9IHRoaXMuX2xpc3RDVEhEW21hX3RodW9jXTtcclxuICAgICAgICAgICAgc3VtICs9IGN0aGQudG90YWxDYXNoO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3VtO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1hX3RodW9jXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc29sdW9uZ1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRvbnZpXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdG90YWxDYXNoXHJcbiAgICAgKi9cclxuICAgIGFkZENUSEQobWFfdGh1b2MsIHRlbl90aHVvYywgc29sdW9uZywgZG9udmksIHRvdGFsQ2FzaCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9saXN0Q1RIRC5oYXNPd25Qcm9wZXJ0eShtYV90aHVvYykpIHtcclxuICAgICAgICAgICAgY29uc3QgbmV3U2wgPSB0aGlzLl9saXN0Q1RIRFttYV90aHVvY10uc2wgKyBzb2x1b25nO1xyXG4gICAgICAgICAgICB0aGlzLl9saXN0Q1RIRC5tYV90aHVvYy51cGRhdGVWYWx1ZSgnc29fbHVvbmcnLCBuZXdTbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBuZXdDVEhEID0gbmV3IENUSG9hRG9uXzEuQ1RIb2FEb24obWFfdGh1b2MsIHRlbl90aHVvYywgZG9udmksIHNvbHVvbmcsIHRvdGFsQ2FzaCAqIHNvbHVvbmcpO1xyXG4gICAgICAgICAgICB0aGlzLl9saXN0Q1RIRFttYV90aHVvY10gPSBuZXdDVEhEO1xyXG4gICAgICAgICAgICBjb25zdCByb3dFbGVtZW50ID0gbmV3Q1RIRC5nZXRSb3dFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fQ1RIRFRhYmxlIHx8ICFyb3dFbGVtZW50KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLl9DVEhEVGFibGUudEJvZGllc1swXS5pbnNlcnRCZWZvcmUocm93RWxlbWVudCwgdGhpcy5fQ1RIRFRhYmxlLnRCb2RpZXNbMF0uY2hpbGROb2Rlc1swXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICBwdXNoVG9EYXRhYmFzZShzdWNjZXNzQ2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spIHtcclxuICAgICAgICBjb25zdCBob2FEb25JbmZvID0ge1xyXG4gICAgICAgICAgICB1c2VybmFtZTogdGhpcy5fdXNlcm5hbWUsXHJcbiAgICAgICAgICAgIHRpbWU6IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCksXHJcbiAgICAgICAgICAgIGdoaWNodTogdGhpcy5fZ2hpQ2h1XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICAgICAgICBob2FfZG9uOiBob2FEb25JbmZvLFxyXG4gICAgICAgICAgICBjdGhkOiB0aGlzLl9saXN0Q1RIRFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgJC5hamF4KHRoaXMuX2RhdGFiYXNlLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICB4aHJGaWVsZHM6IHtcclxuICAgICAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkYXRhOiBcImRhdGE9XCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiAoanNvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCEhanNvbi5lcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvckNhbGxiYWNrKGpzb24ubXNnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzQ2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIGVycm9yQ2FsbGJhY2soZXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnRzLkhvYURvbkZvcm0gPSBfSG9hRG9uRm9ybTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9SG9hRG9uRm9ybS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jbGFzcyBCb290c3RyYXBNb2RhbCB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZCkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLl9lbGVtZW50ID0gdGhpcy5fY3JlYXRlTW9kYWwoaWQpO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5fZWxlbWVudFswXSk7XHJcbiAgICB9XHJcbiAgICBzZXRUaXRsZSh0ZXh0KSB7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5maW5kKCcubW9kYWwtdGl0bGUnKS50ZXh0KHRleHQpO1xyXG4gICAgfVxyXG4gICAgc2V0Q29udGVudChodG1sKSB7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5maW5kKCcubW9kYWwtYm9keScpLmh0bWwoaHRtbCk7XHJcbiAgICB9XHJcbiAgICBzaG93KHRpdGxlLCBjb250ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zZXRUaXRsZSh0aXRsZSk7XHJcbiAgICAgICAgdGhpcy5zZXRDb250ZW50KGNvbnRlbnQpO1xyXG4gICAgICAgIHRoaXMub3BlbigpO1xyXG4gICAgfVxyXG4gICAgb3BlbigpIHtcclxuICAgICAgICB0aGlzLl9lbGVtZW50Lm1vZGFsKCdzaG93Jyk7XHJcbiAgICB9XHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICB0aGlzLl9lbGVtZW50Lm1vZGFsKCdoaWRlJyk7XHJcbiAgICB9XHJcbiAgICBfY3JlYXRlTW9kYWwoaWQpIHtcclxuICAgICAgICBjb25zdCBkaXYgPSAkKFwiPGRpdi8+XCIpO1xyXG4gICAgICAgIGRpdi5hdHRyKCdpZCcsIGlkKTtcclxuICAgICAgICBkaXYuYWRkQ2xhc3MoJ21vZGFsIGZhZGUnKS5kYXRhKCd0b2dnbGUnLCAnbW9kYWwnKTtcclxuICAgICAgICBkaXYuaHRtbChgXG4gICAgICAgIDxkaXYgY2xhc3M9J21vZGFsLWRpYWxvZyBtb2RhbC1sZyBtb2RhbC1jZW50ZXInPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz0nbW9kYWwtY29udGVudCc+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0nbW9kYWwtaGVhZGVyJz5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0nbW9kYWwtdGl0bGUnPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdjbG9zZScgZGF0YS1kaXNtaXNzPSdtb2RhbCc+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz0nZmEgZmEtdGltZXMnPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0nbW9kYWwtYm9keSc+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0nbW9kYWwtZm9vdGVyJz5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1zZWNvbmRhcnknIGRhdGEtZGlzbWlzcz0nbW9kYWwnPkNsb3NlPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9J2J0biBidG4tcHJpbWFyeSc+T0s8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgYCk7XHJcbiAgICAgICAgcmV0dXJuIGRpdjtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkJvb3RzdHJhcE1vZGFsID0gQm9vdHN0cmFwTW9kYWw7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IFRhYmxlRGF0YV8xID0gcmVxdWlyZShcIi4uL1RhYmxlRGF0YVwiKTtcclxuY2xhc3MgQmFuZ0RvblZpIGV4dGVuZHMgVGFibGVEYXRhXzEuZGVmYXVsdCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2RiVVJMID0gXCIvcHVibGljL2FwaS9kb25fdmkvXCI7XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgeWllbGQgdGhpcy5nZXREYXRhKCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHJvdyBvZiB0aGlzLl9saXN0KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaWQgPSByb3dbJ2lkJ107XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXBbaWRdID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHJvdyxcclxuICAgICAgICAgICAgICAgICAgICB0ZW46IHJvd1sndGVuJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgZG9udmlfcXV5ZG9pOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlc286IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgcXV5ZG9pVGV4dDogXCLEkcahbiB24buLIGPGoSBi4bqjblwiLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGxldCBpZCBvZiBPYmplY3Qua2V5cyh0aGlzLl9tYXApKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaWRDb2JhbiA9IHRoaXMuX21hcFtpZF0uZGF0YVsnaWRfcXV5X2RvaSddO1xyXG4gICAgICAgICAgICAgICAgbGV0IGhlc28gPSArdGhpcy5fbWFwW2lkXS5kYXRhWydoZV9zb19xdXlkb2knXTtcclxuICAgICAgICAgICAgICAgIGlmIChpZENvYmFuID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLl9tYXBbaWRDb2Jhbl0uZGF0YVsnaWRfcXV5X2RvaSddICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBoZXNvICo9ICt0aGlzLl9tYXBbaWRDb2Jhbl0uZGF0YVsnaGVfc29fcXV5ZG9pJ107XHJcbiAgICAgICAgICAgICAgICAgICAgaWRDb2JhbiA9IHRoaXMuX21hcFtpZENvYmFuXS5kYXRhWydpZF9xdXlfZG9pJ107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXBbaWRdWydkb252aV9xdXlkb2knXSA9IHRoaXMuX21hcFtpZENvYmFuXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hcFtpZF1bJ2hlc28nXSA9IGhlc287XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXBbaWRdWydxdXlkb2lUZXh0J10gPSBcIj0gXCIgKyBoZXNvICsgXCJ4IFtcIlxyXG4gICAgICAgICAgICAgICAgICAgICsgdGhpcy5fbWFwW2lkQ29iYW5dLnRlbiArIFwiXVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gQmFuZ0RvblZpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1CYW5nRG9uVmkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgTW9kZWxDbGFzc18xID0gcmVxdWlyZShcIi4uL01vZGVsQ2xhc3NcIik7XHJcbmNsYXNzIF9Eb25WaSBleHRlbmRzIE1vZGVsQ2xhc3NfMS5Nb2RlbCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2RhdGFiYXNlID0gXCIvcHVibGljL2FwaS9kb25fdmkvXCI7XHJcbiAgICAgICAgdGhpcy5fZmV0Y2hEYXRhID0gbnVsbDtcclxuICAgIH1cclxuICAgIHVwZGF0ZShjYWxsYmFjaykge1xyXG4gICAgICAgIHRoaXMuX2dldCh7fSwgKGVyciwgZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoISFlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fZmV0Y2hEYXRhID0gdGhpcy5fZmlsdGVyKGRhdGEpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnIsIHRoaXMuX2ZldGNoRGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBfZmlsdGVyKHJhd0RhdGEpIHtcclxuICAgICAgICBsZXQgbmV3RGF0YSA9IHJhd0RhdGEuc2xpY2UoKTtcclxuICAgICAgICBsZXQgbWFwID0ge307XHJcbiAgICAgICAgZm9yIChsZXQgcm93IG9mIG5ld0RhdGEpIHtcclxuICAgICAgICAgICAgbWFwW3Jvd1snaWQnXV0gPSByb3c7XHJcbiAgICAgICAgICAgIGxldCBoZXNvID0gcm93WydoZV9zb19xdXlkb2knXTtcclxuICAgICAgICAgICAgaWYgKCFoZXNvKSB7XHJcbiAgICAgICAgICAgICAgICByb3dbJ3RleHRRdXlEb2knXSA9IFwixJHGoW4gduG7iyBjxqEgYuG6o25cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJvd1sndGV4dFF1eURvaSddID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCByb3cgb2YgbmV3RGF0YSkge1xyXG4gICAgICAgICAgICBsZXQgaWRfY29fYmFuID0gcm93WydpZF9xdXlfZG9pJ107XHJcbiAgICAgICAgICAgIGxldCBoZXNvID0gK3Jvd1snaGVfc29fcXV5ZG9pJ107XHJcbiAgICAgICAgICAgIGlmIChtYXAuaGFzT3duUHJvcGVydHkoaWRfY29fYmFuKSkge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKG1hcC5oYXNPd25Qcm9wZXJ0eShpZF9jb19iYW4pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcm93Wyd0ZXh0UXV5RG9pJ10gKz0gYD0ke2hlc299eFske21hcFtpZF9jb19iYW5dWyd0ZW4nXX1dYDtcclxuICAgICAgICAgICAgICAgICAgICBoZXNvICo9ICttYXBbaWRfY29fYmFuXVsnaGVfc29fcXV5ZG9pJ107XHJcbiAgICAgICAgICAgICAgICAgICAgaWRfY29fYmFuID0gbWFwW2lkX2NvX2Jhbl1bJ2lkX3F1eV9kb2knXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3RGF0YTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkRvblZpID0gX0RvblZpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jbGFzcyBfTW9kZWwge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5fZGF0YWJhc2UgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuX2RhdGEgPSBbXTtcclxuICAgIH1cclxuICAgIGdldCBkYXRhKCkge1xyXG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9kYXRhKTtcclxuICAgIH1cclxuICAgIGdldCByZXNwb25zZSgpIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fcmVzKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogZmV0Y2ggZGF0YSBmcm9tIGRhdGFiYXNlIGFuZCBkbyB0aGluZ1xyXG4gICAgICogQHBhcmFtIHBhcmFtc1xyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIGNhbGxiYWNrIGZ1bmN0aW9uXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICBfZ2V0KHBhcmFtcywgY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kYXRhID0gW107XHJcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RVUkwgPSB0aGlzLl9kYXRhYmFzZSArIHRoaXMuX3VybHBhcmFtcyhwYXJhbXMpO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0geWllbGQgZmV0Y2gocmVxdWVzdFVSTCwgeyBjcmVkZW50aWFsczogJ2luY2x1ZGUnIH0pO1xyXG4gICAgICAgICAgICAgICAgY29uc3QganNvbiA9IHlpZWxkIHJlcy5qc29uKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoanNvbi5lcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhqc29uLm1zZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGF0YSA9IGpzb24uZGF0YTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlLCBqc29uLmRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkYXRhXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tcclxuICAgICAqL1xyXG4gICAgX3Bvc3QoZGF0YSwgY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yZXMgPSBcIlwiO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0geWllbGQgZmV0Y2godGhpcy5fZGF0YWJhc2UsIHtcclxuICAgICAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGpzb24gPSB5aWVsZCByZXMuanNvbigpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGpzb24uZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soanNvbi5tc2cpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlcyA9IGpzb24uZGF0YTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlLCBqc29uLmRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIF91cmxwYXJhbXMocGFyYW1zKSB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gT2JqZWN0LmtleXMocGFyYW1zKS5tYXAoZnVuY3Rpb24gKGspIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChrKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChwYXJhbXNba10pO1xyXG4gICAgICAgIH0pLmpvaW4oJyYnKTtcclxuICAgICAgICByZXR1cm4gdXJsO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuTW9kZWwgPSBfTW9kZWw7XHJcbjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgTW9kZWxDbGFzc18xID0gcmVxdWlyZShcIi4uL01vZGVsQ2xhc3NcIik7XHJcbmNsYXNzIF9Oc3ggZXh0ZW5kcyBNb2RlbENsYXNzXzEuTW9kZWwge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9kYXRhYmFzZSA9IFwiL3B1YmxpYy9hcGkvbnN4L1wiO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgbGV0ICR0aGlzID0gdGhpcztcclxuICAgICAgICAkdGhpcy5fZ2V0KHt9LCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UsIGRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuTnN4ID0gX05zeDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLyoqXHJcbiAqIERpc3BsYXkgZGF0YSB1bmRlciB0YWJsZVxyXG4gKi9cclxuY2xhc3MgVGFibGVEYXRhIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX21hcCA9IHt9O1xyXG4gICAgICAgIHRoaXMuX2xpc3QgPSBbXTtcclxuICAgICAgICB0aGlzLl9pc0Nvbm5lY3QgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9jb25uZWN0U3RhdHVzID0gXCJcIjtcclxuICAgICAgICB0aGlzLl9pc0ZldGNoZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9kYlVSTCA9IFwiXCI7XHJcbiAgICB9XHJcbiAgICBnZXREYXRhKCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIGxldCByZXMgPSB5aWVsZCBmZXRjaCh0aGlzLl9kYlVSTCwgeyBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScgfSk7XHJcbiAgICAgICAgICAgIGlmICghcmVzLm9rKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0Nvbm5lY3QgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3RTdGF0dXMgPSByZXMuc3RhdHVzVGV4dDtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9pc0Nvbm5lY3QgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0U3RhdHVzID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IGpzb24gPSB5aWVsZCByZXMuanNvbigpO1xyXG4gICAgICAgICAgICBpZiAoISFqc29uLmVycikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faXNGZXRjaGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25uZWN0U3RhdHVzID0ganNvbi5tc2c7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5faXNGZXRjaGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdFN0YXR1cyA9IFwiT0tcIjtcclxuICAgICAgICAgICAgdGhpcy5fbGlzdCA9IGpzb24uZGF0YTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGdldCB0YWJsZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWFwO1xyXG4gICAgfVxyXG4gICAgZ2V0IGxpc3QoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3Q7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gVGFibGVEYXRhO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBUYWJsZURhdGFfMSA9IHJlcXVpcmUoXCIuLi9UYWJsZURhdGFcIik7XHJcbmNsYXNzIEJhbmdUaHVvYyBleHRlbmRzIFRhYmxlRGF0YV8xLmRlZmF1bHQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9kYlVSTCA9IFwiL3B1YmxpYy9hcGkvdGh1b2MvXCI7XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgeWllbGQgdGhpcy5nZXREYXRhKCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHJvdyBvZiB0aGlzLl9saXN0KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaWQgPSByb3dbJ2lkJ107XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXBbaWRdID0gcm93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5CYW5nVGh1b2MgPSBCYW5nVGh1b2M7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUJhbmdUaHVvYy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBNb2RlbENsYXNzXzEgPSByZXF1aXJlKFwiLi4vTW9kZWxDbGFzc1wiKTtcclxuY29uc3QgQmFuZ1RodW9jXzEgPSByZXF1aXJlKFwiLi9CYW5nVGh1b2NcIik7XHJcbmV4cG9ydHMuQmFuZ1RodW9jID0gQmFuZ1RodW9jXzEuQmFuZ1RodW9jO1xyXG5jbGFzcyBfVGh1b2MgZXh0ZW5kcyBNb2RlbENsYXNzXzEuTW9kZWwge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9kYXRhYmFzZSA9IFwiL3B1YmxpYy9hcGkvdGh1b2MvXCI7XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoY2FsbGJhY2spIHtcclxuICAgICAgICBsZXQgJHRoaXMgPSB0aGlzO1xyXG4gICAgICAgICR0aGlzLl9nZXQoe30sIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYWxsYmFjayhmYWxzZSwgZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5UaHVvYyA9IF9UaHVvYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY2xhc3MgaW5wdXRQcmV2aWV3MiB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQgPSBkb2N1bWVudCkge1xyXG4gICAgICAgIHRoaXMuX2xpc3QgPSB7fTtcclxuICAgICAgICB0aGlzLl9kYXRhID0gW107XHJcbiAgICAgICAgdGhpcy5fbG9va3VwID0ge307XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgICAgIHRoaXMuX3ByZXZpZXdfZGl2ID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9jdXJyZW50UHJldmlld0RhdGEgPSBbXTtcclxuICAgICAgICAvLyBjb25zdHJ1Y3RvciAgICBcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XHJcbiAgICAgICAgICAgIGlmICghdGFyZ2V0LmNsYXNzTGlzdC5oYXNPd25Qcm9wZXJ0eShcInByZXZpZXctcm93XCIpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVsZXRlUHJldmlldygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBhZGQgbG9va3VwIHRvIGpzb24gbmFtZVxyXG4gICAgICogQHBhcmFtIHt7aWRFbDogU3RyaW5nfX0gYXJyIHsgaWRfZWxlbWVudCA6IG5hbWVfb2ZfZmllbGR9XHJcbiAgICAgKi9cclxuICAgIGFkZExvb2t1cChhcnIpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGFyciAhPSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKE9iamVjdC5jYWxsKGFycikpO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJhbWV0ZXIgbXVzdCBiZSBqc29uIG9ialwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXMoYXJyKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9sb29rdXBba2V5XSA9IGFycltrZXldO1xyXG4gICAgICAgICAgICBsZXQgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChrZXkpO1xyXG4gICAgICAgICAgICBpZiAoIWVsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhFcnJvcihgQ2Fubm90IGZpbmQgIyR7a2V5fSBlbGVtZW50YCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGlzdFtrZXldID0gZWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICA7XHJcbiAgICAvKipcclxuICAgICAqIGFkZCBob3N0IHRvIGZldGNoIGRhdGFiYXNlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIGFzZFxyXG4gICAgICovXHJcbiAgICBhZGREYXRhKGRhdGEpIHtcclxuICAgICAgICBpZiAodHlwZW9mIChkYXRhKSAhPSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInBhcmFtZXRlciBtdXN0IGJlIGpzb25cIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZGF0YSA9IGRhdGE7XHJcbiAgICB9XHJcbiAgICA7XHJcbiAgICBsaXN0ZW4oaWQsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY29kZSA9IGUua2V5Q29kZTtcclxuICAgICAgICAgICAgaWYgKGNvZGUgPT0gMjcpIC8vZXNjXHJcbiAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWxldGVQcmV2aWV3KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY29kZSA9PSAzOCB8fCBjb2RlID09IDQwKSAvL3VwIC1kb3duXHJcbiAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VyID0gK3RoaXMuX3ByZXZpZXdfZGl2LmdldEF0dHJpYnV0ZSgnY3VyJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmV2aWV3X2Rpdi5jaGlsZHJlbltjdXJdXHJcbiAgICAgICAgICAgICAgICAgICAgLmNsYXNzTGlzdC5yZW1vdmUoXCJwcmV2aWV3LXJvdy1hY3RpdmVcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29kZSA9PSAzOClcclxuICAgICAgICAgICAgICAgICAgICAtLWN1cjtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICArK2N1cjtcclxuICAgICAgICAgICAgICAgIGxldCBsZW4gPSB0aGlzLl9wcmV2aWV3X2Rpdi5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VyIDwgMClcclxuICAgICAgICAgICAgICAgICAgICBjdXIgPSBsZW4gLSAxO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1ciA+IGxlbiAtIDEpXHJcbiAgICAgICAgICAgICAgICAgICAgY3VyID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ByZXZpZXdfZGl2LmNoaWxkcmVuW2N1cl1cclxuICAgICAgICAgICAgICAgICAgICAuY2xhc3NMaXN0LmFkZChcInByZXZpZXctcm93LWFjdGl2ZVwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ByZXZpZXdfZGl2LnNldEF0dHJpYnV0ZShcImN1clwiLCBjdXIgKyBcIlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChjb2RlID09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VyID0gK3RoaXMuX3ByZXZpZXdfZGl2LmdldEF0dHJpYnV0ZShcImN1clwiKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRoaXMuX2N1cnJlbnRQcmV2aWV3RGF0YVtjdXJdKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RlbGV0ZVByZXZpZXcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hPbihpZCwgY2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBmZXRjaCBkYXRhYmFzZSBhbmQgc2hvdyBpbiBpbnB1dFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIGlkIG9mIGh0bWwgZWxlbWVudCBpbnB1dCBuZWVkIHRvIGZldGNoIGJ5IHZhbHVlXHJcbiAgICAgKi9cclxuICAgIGZldGNoT24oaWQsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5fZGVsZXRlUHJldmlldygpO1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRQcmV2aWV3RGF0YS5sZW5ndGggPSAwOyAvL2NsZWFyIGN1cnJlbnQgcHJldmlldyBzdWdnZXN0IG5hbWVcclxuICAgICAgICBpZiAodGhpcy5fbGlzdC5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcclxuICAgICAgICAgICAgbGV0IGlucHV0ID0gdGhpcy5fbGlzdFtpZF07XHJcbiAgICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnYXV0b2NvbXBsZXRlJywgJ29mZicpO1xyXG4gICAgICAgICAgICBsZXQgaW5wdXRfcHJldmlldyA9IHRoaXMuX2NyZWF0ZUZseVdyYXAoaW5wdXQpO1xyXG4gICAgICAgICAgICB0aGlzLl9wcmV2aWV3X2RpdiA9IGlucHV0X3ByZXZpZXc7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IGlucHV0LnZhbHVlO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiB0aGlzLl9kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2lzTGlrZShyb3dbdGhpcy5fbG9va3VwW2lkXV0sIHZhbHVlKSlcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRQcmV2aWV3RGF0YS5wdXNoKHJvdyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYXJyID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG5hbWUgaW4gdGhpcy5fbG9va3VwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9sb29rdXBbbmFtZV0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gdGhpcy5fbG9va3VwW25hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKHJvd1tmaWVsZF0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IG5ld1JvdyA9IHRoaXMuX2NyZWF0ZUZseVJvdyhhcnIpO1xyXG4gICAgICAgICAgICAgICAgbmV3Um93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHJvdyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVsZXRlUHJldmlldygpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpbnB1dF9wcmV2aWV3LmFwcGVuZENoaWxkKG5ld1Jvdyk7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGlucHV0X3ByZXZpZXcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImNhbm5vdCBmaW5kIGlkXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIDtcclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtIVE1MRGl2RWxlbWVudH0gZWxlbWVudFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXHJcbiAgICAgKi9cclxuICAgIF9jcmVhdGVGbHlXcmFwKGVsZW1lbnQpIHtcclxuICAgICAgICBpZiAoIWVsZW1lbnQpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIGxldCByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkaXYuY2xhc3NOYW1lID0gXCJwcmV2aWV3LWlucHV0XCI7XHJcbiAgICAgICAgZGl2LnN0eWxlLm1pbldpZHRoID0gcmVjdC53aWR0aCArIFwicHhcIjtcclxuICAgICAgICBkaXYuc3R5bGUudG9wID0gK3JlY3QudG9wICsgcmVjdC5oZWlnaHQgKyBcInB4XCI7XHJcbiAgICAgICAgZGl2LnN0eWxlLmxlZnQgPSArcmVjdC5sZWZ0ICsgXCJweFwiO1xyXG4gICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoXCJjdXJcIiwgXCIwXCIpO1xyXG4gICAgICAgIHJldHVybiBkaXY7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEByZXR1cm4ge3RydWV9IGlmIHN0cjEgbGlrZSBzdHIyXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyMVxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0cjJcclxuICAgICAqL1xyXG4gICAgX2lzTGlrZShzdHIxLCBzdHIyKSB7XHJcbiAgICAgICAgc3RyMSA9IHN0cjEudHJpbSgpO1xyXG4gICAgICAgIHN0cjIgPSBzdHIyLnRyaW0oKTtcclxuICAgICAgICBpZiAoc3RyMSA9PSBcIlwiIHx8IHN0cjIgPT0gXCJcIilcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHN0cjEgPSBzdHIxLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgIHN0cjIgPSBzdHIyLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgIHN0cjEgPSBzdHIxLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgc3RyMiA9IHN0cjIudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBsZXQgcmVnID0gbmV3IFJlZ0V4cChgXi4qJHtzdHIyfS4qJGApO1xyXG4gICAgICAgIHJldHVybiBzdHIxLm1hdGNoKHJlZyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFyclZhbHVlc1xyXG4gICAgICovXHJcbiAgICBfY3JlYXRlRmx5Um93KGFyclZhbHVlcykge1xyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShhcnJWYWx1ZXMpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICByb3cuY2xhc3NOYW1lID0gXCJwcmV2aWV3LXJvd1wiO1xyXG4gICAgICAgIGZvciAobGV0IHZhbHVlIG9mIGFyclZhbHVlcykge1xyXG4gICAgICAgICAgICBsZXQgY29sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgY29sLnN0eWxlLm1hcmdpbiA9IFwiYXV0b1wiO1xyXG4gICAgICAgICAgICBjb2wudGV4dENvbnRlbnQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgcm93LmFwcGVuZENoaWxkKGNvbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByb3c7XHJcbiAgICB9XHJcbiAgICBfZGVsZXRlUHJldmlldygpIHtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnByZXZpZXctaW5wdXRcIikuZm9yRWFjaCgodmFsKSA9PiB7XHJcbiAgICAgICAgICAgIHZhbC5yZW1vdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBpbnB1dFByZXZpZXcyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbnB1dFByZXZpZXcyLmpzLm1hcCIsImNvbnN0IEJhbmdEb25WaSA9IHJlcXVpcmUoJy4uL2FwcC9Nb2RlbC9Eb25WaS9CYW5nRG9uVmknKS5kZWZhdWx0O1xyXG5jb25zdCB7Qm9vdHN0cmFwTW9kYWx9ID0gcmVxdWlyZSgnLi4vYXBwL01vZGVsL0Jvb3N0cmFwTW9kYWwnKTtcclxuXHJcbmZ1bmN0aW9uIGZldGNoVG9UYWJsZShkYXRhKSB7XHJcbiAgICAkKFwiI25oYXBfZG9uX3ZpLS10YWJsZS1ib2R5XCIpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XHJcbiAgICAkKCcud2lsbC1iZS11cGRhdGUnKS5yZW1vdmUoKTtcclxuXHJcbiAgICBmb3IgKGxldCBpZCBvZiBPYmplY3Qua2V5cyhkYXRhKSkge1xyXG4gICAgICAgIGxldCB0ZW4gPSBkYXRhW2lkXVsndGVuJ107XHJcbiAgICAgICAgbGV0IHF1eWRvaVRleHQgPSBkYXRhW2lkXVsncXV5ZG9pVGV4dCddO1xyXG5cclxuICAgICAgICBsZXQgcm93ID0gJChcIjx0ci8+XCIpO1xyXG4gICAgICAgIHJvdy5hcHBlbmQoJCgnPHRkLz4nKS50ZXh0KGlkKSlcclxuICAgICAgICAgICAgLmFwcGVuZCgkKCc8dGQvPicpLnRleHQodGVuKSlcclxuICAgICAgICAgICAgLmFwcGVuZCgkKCc8dGQvPicpLnRleHQocXV5ZG9pVGV4dCkpO1xyXG5cclxuICAgICAgICBsZXQgb3B0ID0gJCgnPG9wdGlvbi8+JykudmFsKGlkKS50ZXh0KHRlbikuYWRkQ2xhc3MoJ3dpbGwtYmUtdXBkYXRlJyk7XHJcbiAgICAgICAgJChcIiNuaGFwX2Rvbl92aS0taWRfcXV5X2RvaVwiKS5hcHBlbmQob3B0KTtcclxuICAgICAgICAkKCcjbmhhcF9kb25fdmktLXRhYmxlLWJvZHknKS5hcHBlbmQocm93KTtcclxuICAgIH1cclxufVxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoYXN5bmMgKCk9PntcclxuICAgIGNvbnN0IGJhbmdEb252aSA9IG5ldyBCYW5nRG9uVmkoKTtcclxuICAgIGF3YWl0IGJhbmdEb252aS51cGRhdGUoKTtcclxuICAgIGZldGNoVG9UYWJsZShiYW5nRG9udmkudGFibGUpO1xyXG5cclxuICAgIGNvbnN0IHBvcHVwID0gbmV3IEJvb3RzdHJhcE1vZGFsKCduaGFwX2Rvbl92aS0tcG9wdXAnKTtcclxuICAgIHBvcHVwLnNldFRpdGxlKCdOaGFwIERvbiBWaScpO1xyXG5cclxuICAgICQoXCIjbmhhcF9kb25fdmktLWZvcm1cIikub24oJ3N1Ym1pdCcsIChlKT0+e1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgY29uc3QgdGVuRG9uVmkgPSAkKCcjbmhhcF9kb25fdmktLXRlbl9kb25fdmknKS52YWwoKTtcclxuICAgICAgICBjb25zdCBpZFF1eURvaSA9ICQoJyNuaGFwX2Rvbl92aS0taWRfcXV5X2RvaScpLnZhbCgpO1xyXG4gICAgICAgIGNvbnN0IGhlU29RdXlEb2kgPSBpZFF1eURvaSA9PSBcIm51bGxcIiA/IDAgOiAkKFwiI25oYXBfZG9uX3ZpLS1oZV9zb19xdXlkb2lcIikudmFsKCk7XHJcblxyXG4gICAgICAgICQuYWpheCgnL2FwaS9hZGREb252aS5waHAnLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgICAgICAgICB4aHJGaWVsZHM6IHtcclxuICAgICAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogJ2luY2x1ZGUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkYXRhOiBgdGVuX2Rvbl92aT0ke3RlbkRvblZpfSZpZF9xdXlfZG9pPSR7aWRRdXlEb2l9JmhlX3NvX3F1eWRvaT0ke2hlU29RdXlEb2l9YCxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oanNvbikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCEhanNvbi5lcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBwb3B1cC5zZXRDb250ZW50KGpzb24uZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICBwb3B1cC5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHBvcHVwLnNldENvbnRlbnQoanNvbi5kYXRhKTtcclxuICAgICAgICAgICAgICAgIHBvcHVwLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCk9PntcclxuICAgICAgICAgICAgICAgICAgICBwb3B1cC5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgfSwgMTAwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgJChcIiNuaGFwX2Rvbl92aS0tZm9ybSBpbnB1dFwiKS52YWwoXCJcIik7XHJcbiAgICAgICAgICAgICAgICAkKFwiI25oYXBfZG9uX3ZpLS1pZF9xdXlfZG9pXCIpLnZhbChcIm51bGxcIik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihlcnIpIHtcclxuICAgICAgICAgICAgICAgIHBvcHVwLnNldENvbnRlbnQoZXJyKTtcclxuICAgICAgICAgICAgICAgIHBvcHVwLm9wZW4oKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyBvbiBpbnB1dCBxdXkgZG9pIGRvbiB2aVxyXG4gICAgJCgnI25oYXBfZG9uX3ZpLS1pZF9xdXlfZG9pJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uIENoYW5nZU9uSW5wdXREb25WaShlKSB7XHJcbiAgICAgICAgbGV0IHZhbCA9ICQodGhpcykudmFsKCk7XHJcbiAgICAgICAgJCgnI25oYXBfZG9uX3ZpLS1oZV9zb19xdXlkb2knKS5wcm9wKCdkaXNhYmxlZCcsIHZhbCA9PSAnbnVsbCcpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gdXBkYXRlIGRhdGEgcmVxdWVzdFxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBhc3luYyBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBlLmRhdGE7XHJcbiAgICAgICAgaWYgKGRhdGEubXNnID09ICd1cGRhdGUnKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGJhbmdEb252aS51cGRhdGUoKTtcclxuICAgICAgICAgICAgZmV0Y2hUb1RhYmxlKGJhbmdEb252aS50YWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pO1xyXG4iLCJjb25zdCB7SG9hRG9uRm9ybX0gPSByZXF1aXJlKCcuLi9hcHAvSG9hRG9uRm9ybScpO1xyXG5jb25zdCB7UUxOVH0gPSByZXF1aXJlKCcuLi9hcHAvQXBwJyk7XHJcbmNvbnN0IHtCb290c3RyYXBNb2RhbH0gPSByZXF1aXJlKCcuLi9hcHAvTW9kZWwvQm9vc3RyYXBNb2RhbCcpO1xyXG5jb25zdCBDT05GSUcgPSByZXF1aXJlKCcuLi8uLi9jb25maWcnKTtcclxuXHJcbmNvbnN0IGhvYURvbkZvcm0gPSBuZXcgSG9hRG9uRm9ybSgpO1xyXG5jb25zdCBBcHAgPSBuZXcgUUxOVCgpO1xyXG5jb25zdCBwb3B1cCA9IG5ldyBCb290c3RyYXBNb2RhbCgnbmhhcF9ob2FfZG9uLS1wb3B1cCcpO1xyXG5cclxuZnVuY3Rpb24gZGlzcGxheVRpbWUoKSB7XHJcbiAgICBsZXQgbm93ID0gbmV3IERhdGUoKTtcclxuICAgICQoXCIjdGltZS1kYXRlXCIpLnRleHQobm93LnRvTG9jYWxlRGF0ZVN0cmluZygpKTtcclxuICAgICQoXCIjdGltZS10aW1lXCIpLnRleHQobm93LnRvTG9jYWxlVGltZVN0cmluZygpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbG9vcFNob3dUaW1lKCkge1xyXG4gICAgc2V0SW50ZXJ2YWwoKCk9PntcclxuICAgICAgICBkaXNwbGF5VGltZSgpO1xyXG4gICAgfSwgMTAwMCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpc3BsYXlVc2VyKCkge1xyXG4gICAgbGV0IHVzZXJuYW1lID0gaG9hRG9uRm9ybS5nZXRVc2VybmFtZSgpO1xyXG4gICAgJChcIiNuaGFwX2hvYV9kb24tLXVzZXJuYW1lXCIpLnRleHQodXNlcm5hbWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmb2N1c1RlblRodW9jRmlyc3QoKSB7XHJcbiAgICAkKFwiI25oYXBfaG9hX2Rvbi0tdGVuLXRodW9jXCIpLmZvY3VzKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVRvbmdHaWEoKSB7XHJcbiAgICBsZXQgdG9uZyA9IDA7XHJcbiAgICBsZXQgbGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jdGhkLWdpYScpO1xyXG4gICAgZm9yIChsZXQgdmFsIG9mIGxpc3QpIHtcclxuICAgICAgICBsZXQgZ2lhID0gcGFyc2VJbnQodmFsLnRleHRDb250ZW50LnJlcGxhY2UoL1xcRC8sICcnKSk7XHJcbiAgICAgICAgdG9uZyArPSBnaWE7XHJcbiAgICB9XHJcbiAgICBjb25zdCB2YWwgPSB0b25nLnRvTG9jYWxlU3RyaW5nKCkrJyBWTsSQJztcclxuXHJcbiAgICAkKFwiI25oYXBfaG9hX2Rvbi0tc3VtXCIpLmF0dHIoJ2N1clZhbCcsIHZhbCk7XHJcbiAgICBpZiAoISQoJyNraWV1LWxpZXUnKVswXS5jaGVja2VkKSAkKCcjbmhhcF9ob2FfZG9uLS1zdW0nKS52YWwodmFsKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlVGllblRob2koKSB7XHJcbiAgICBsZXQgc3VtID0gJChcIiNuaGFwX2hvYV9kb24tLXN1bVwiKS52YWwoKS5yZXBsYWNlKC9bXFxEXFxzXS9nLCAnJyk7XHJcbiAgICBsZXQgdGllbmtoID0gJChcIiNuaGFwX2hvYV9kb24tLXRpZW5raC10cmFcIikudmFsKCkucmVwbGFjZSgvW1xcRFxcc10vZywgJycpO1xyXG5cclxuICAgIGxldCB0aWVuVGhvaSA9IHBhcnNlSW50KHRpZW5raCkgLSBwYXJzZUludChzdW0pO1xyXG4gICAgdGllblRob2kgPSB0aWVuVGhvaSA+PSAwID8gdGllblRob2kudG9Mb2NhbGVTdHJpbmcoKSA6ICd+bG9pJztcclxuXHJcbiAgICAkKFwiI25oYXBfaG9hX2Rvbi0tdGhvaXRpZW5cIikudmFsKHRpZW5UaG9pKTtcclxufVxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICBsb29wU2hvd1RpbWUoKTtcclxuICAgIGRpc3BsYXlVc2VyKCk7XHJcbiAgICBmb2N1c1RlblRodW9jRmlyc3QoKTtcclxuXHJcbiAgICBBcHAuYWRkU2VsZWN0SW5wdXQoJCgnI25oYXBfaG9hX2Rvbi0tZG9uX3ZpJylbMF0sIHtcclxuICAgICAgICB0aXRsZTogJ3RlbicsXHJcbiAgICAgICAgdmFsdWU6ICdpZCcsXHJcbiAgICB9KTtcclxuICAgIEFwcC5vblVwZGF0ZUFsbCgpO1xyXG5cclxuICAgIGhvYURvbkZvcm0uc2V0SGVhZGVyKCQoXCIjbmhhcF9ob2FfZG9uLS1mb3JtLW5oYXBcIikuZ2V0KDApKTtcclxuICAgIGhvYURvbkZvcm0uc2V0VGFibGUoJChcIiN0YWJsZS1uaGFwXCIpLmdldCgwKSk7XHJcblxyXG4gICAgJCgnI25oYXBfaG9hX2Rvbi0tdGllbmtoLXRyYScpLm1vbmV5SW5wdXQoKS5vbigna2V5dXAnLCAoKT0+e1xyXG4gICAgICAgIHVwZGF0ZVRpZW5UaG9pKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCcjbmhhcF9ob2FfZG9uLS1ob2Fkb24tZm9ybScpLnN1Ym1pdCgoZSk9PntcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIGhvYURvbkZvcm0ucHVzaFRvRGF0YWJhc2UoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQoJyNuaGFwX2hvYV9kb24tLWhvYWRvbi1mb3JtJykuZmluZCgnaW5wdXQsIHNlbGVjdCcpLnZhbCgnJyk7XHJcbiAgICAgICAgICAgICQoJyNuaGFwX2hvYV9kb24tLWZvcm0tbmhhcCcpLmZpbmQoJ2lucHV0LCBzZWxlY3QnKS52YWwoJycpO1xyXG4gICAgICAgICAgICBob2FEb25Gb3JtLm5ld0hvYURvbigpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhob2FEb25Gb3JtKTtcclxuICAgICAgICAgICAgcG9wdXAuc2hvdygnT0snLCAnJyk7XHJcbiAgICAgICAgfSwgKGVycik9PntcclxuICAgICAgICAgICAgcG9wdXAuc2hvdygnRXJyb3InLCBlcnIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIEFwcC5hZGROYW1lSW5wdXRUaHVvYyhcIm5oYXBfaG9hX2Rvbi0tdGVuX3RodW9jXCIsIHtcclxuICAgICAgICBcIm5oYXBfaG9hX2Rvbi0tbWFfdGh1b2NcIjogXCJtYV90aHVvY1wiLFxyXG4gICAgICAgIFwibmhhcF9ob2FfZG9uLS10ZW5fdGh1b2NcIjogXCJ0ZW5fdGh1b2NcIixcclxuICAgICAgICBcIm5oYXBfaG9hX2Rvbi0tZG9uX3ZpXCI6IFwidGVuX2Rvbl92aVwiLFxyXG4gICAgICAgIFwibmhhcF9ob2FfZG9uLS1jb3N0XCI6IFwiZG9uX2dpYVwiLFxyXG4gICAgfSwge1xyXG4gICAgICAgIFwibmhhcF9ob2FfZG9uLS10ZW5fdGh1b2NcIjogXCJ0ZW5fdGh1b2NcIixcclxuICAgICAgICBcIm5oYXBfaG9hX2Rvbi0tbWFfdGh1b2NcIjogXCJtYV90aHVvY1wiLFxyXG4gICAgICAgIFwibmhhcF9ob2FfZG9uLS1kb25fdmlcIjogXCJpZF9kb25fdmlcIixcclxuICAgICAgICBcIm5oYXBfaG9hX2Rvbi0tY29zdFwiOiBcImRvbl9naWFcIixcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIjbmhhcF9ob2FfZG9uLS1mb3JtLW5oYXBcIikub24oJ3N1Ym1pdCcsIChlKT0+e1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAkKFwiI25oYXBfaG9hX2Rvbi0tZm9ybS1uaGFwXCIpLmZpbmQoJ2lucHV0LCBzZWxlY3QnKS52YWwoJycpO1xyXG4gICAgICAgIHVwZGF0ZVRvbmdHaWEoKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIja2lldS1saWV1XCIpLmNsaWNrKCgpID0+IHtcclxuICAgICAgICAkKCcjbmhhcF9ob2FfZG9uLS1zdW0nKS52YWwoQ09ORklHLkdJQV9CQU5fVEhFT19MSUVVKTtcclxuICAgIH0pO1xyXG4gICAgJCgnI2tpZXUtYmFubGUnKS5jbGljaygoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc3VtID0gJCgnI3N1bScpO1xyXG4gICAgICAgIGNvbnN0IHZhbCA9IHN1bS5hdHRyKCdjdXJWYWwnKTtcclxuICAgICAgICBzdW0udmFsKHZhbCk7XHJcbiAgICB9KTtcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbn0pO1xyXG4iLCJjb25zdCB7TnN4fSA9IHJlcXVpcmUoJy4uL2FwcC9Nb2RlbC9Oc3gnKTtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KCgpPT57XHJcbiAgICBjb25zdCBwb3B1cCA9IG5ldyBTdGF0dXNQb3B1cCgpO1xyXG4gICAgY29uc3QgbnN4ID0gbmV3IE5zeCgpO1xyXG5cclxuICAgIHBvcHVwLmNyZWF0ZSgpO1xyXG4gICAgdXBkYXRlTlNYKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlVGFibGVSb3codmFsKSB7XHJcbiAgICAgICAgbGV0IHJvdyA9ICQoXCI8dHIvPlwiKTtcclxuICAgICAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXModmFsKSkge1xyXG4gICAgICAgICAgICByb3cuYXBwZW5kKCQoJzx0ZC8+JykudGV4dCh2YWxba2V5XSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcm93O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZU5TWCgpIHtcclxuICAgICAgICAkKCcjdGFibGUtYm9keScpLmNoaWxkcmVuKCkucmVtb3ZlKCk7XHJcbiAgICAgICAgbnN4LnVwZGF0ZSgoZXJyLCBkYXRhKT0+e1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGxldCByb3cgb2YgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgJChcIiN0YWJsZS1ib2R5XCIpLmFwcGVuZChjcmVhdGVUYWJsZVJvdyhyb3cpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICQoXCIjZm9ybVwiKS5vbignc3VibWl0JywgKGUpPT57XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAkLmFqYXgoJy9wdWJsaWMvYXBpL25zeC8nLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgICAgICAgICB4aHJGaWVsZHM6IHtcclxuICAgICAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogJ2luY2x1ZGUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkYXRhOiAkKFwiI2Zvcm1cIikuc2VyaWFsaXplKCksXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGpzb24pIHtcclxuICAgICAgICAgICAgICAgIGlmICghIWpzb24uZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9wdXAuc2V0U3RhdHVzKGZhbHNlLCBqc29uLm1zZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9wdXAuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBwb3B1cC5zZXRTdGF0dXModHJ1ZSwganNvbi5tc2cpO1xyXG4gICAgICAgICAgICAgICAgcG9wdXAuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcHVwLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xyXG5cclxuICAgICAgICAgICAgICAgICQoXCJpbnB1dCwgdGV4dGFyZWFcIikudmFsKFwiXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHBhcmVudC5wb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgbXNnOiAndXBkYXRlJyxcclxuICAgICAgICAgICAgICAgIH0sICcqJyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihlcnIpIHtcclxuICAgICAgICAgICAgICAgIHBvcHVwLnNldFN0YXR1cyhmYWxzZSwgZXJyLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICBwb3B1cC5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyB1cGRhdGUgZGF0YSByZXF1ZXN0XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBsZXQgZGF0YSA9IGUuZGF0YTtcclxuICAgICAgICBpZiAoZGF0YS5tc2cgPT0gJ3VwZGF0ZScpIHtcclxuICAgICAgICAgICAgdXBkYXRlTlNYKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pO1xyXG4iLCJjb25zdCB7VGh1b2MsIEJhbmdUaHVvY30gPSByZXF1aXJlKCcuLi9hcHAvTW9kZWwvVGh1b2MnKTtcclxuLy8gY29uc3QgdGh1b2MgPSBuZXcgVGh1b2MoKTtcclxuY29uc3QgYmFuZ1RodW9jID0gbmV3IEJhbmdUaHVvYygpO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICBhc3luYyBmdW5jdGlvbiB1cGRhdGVUYWJsZSgpIHtcclxuICAgICAgICBjb25zdCB0YWJsZSA9ICQoXCIjbmhhcF90aHVvYy0tdGFibGUgdGJvZHlcIik7XHJcbiAgICAgICAgdGFibGUuY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgICAgICBhd2FpdCBiYW5nVGh1b2MudXBkYXRlKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCByb3cgb2YgYmFuZ1RodW9jLmxpc3QpIHtcclxuICAgICAgICAgICAgY29uc3QgcHJpY2VTdHJpbmcgPSAoK3Jvdy5kb25fZ2lhKS50b0xvY2FsZVN0cmluZygpO1xyXG4gICAgICAgICAgICBjb25zdCB0ciA9ICQoJzx0ci8+JykuaHRtbChgXHJcbiAgICAgICAgICAgICAgICA8dGQ+JHtyb3cubWFfdGh1b2N9PC90ZD5cclxuICAgICAgICAgICAgICAgIDx0ZD4ke3Jvdy50ZW5fdGh1b2N9PC90ZD5cclxuICAgICAgICAgICAgICAgIDx0ZD4ke3Jvdy50ZW5fbnN4fTwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8dGQ+JHtwcmljZVN0cmluZ308L3RkPlxyXG4gICAgICAgICAgICAgICAgPHRkPiR7cm93LnNvX2x1b25nfTwvdGQ+XHJcbiAgICAgICAgICAgIGApO1xyXG4gICAgICAgICAgICB0YWJsZS5hcHBlbmQodHIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVUYWJsZSgpO1xyXG59KTtcclxuIl19
